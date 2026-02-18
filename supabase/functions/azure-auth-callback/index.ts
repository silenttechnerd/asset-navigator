import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_DOMAINS = [
  "spragginsinc.com",
  "contractorsource.com",
  "integrateddoorllc.com",
];

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json);
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  const appUrl = Deno.env.get("APP_URL")!;

  if (errorParam) {
    return Response.redirect(
      `${appUrl}/login?error=unauthorized`,
      302
    );
  }

  if (!code) {
    return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
  }

  try {
    const clientId = Deno.env.get("AZURE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("AZURE_CLIENT_SECRET")!;
    const tenantUrl = Deno.env.get("AZURE_TENANT_URL")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const redirectUri = `${supabaseUrl}/functions/v1/azure-auth-callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(`${tenantUrl}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        scope: "openid email profile offline_access",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData.error, tokenData.error_description);
      return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
    }

    // Decode ID token to get user info
    const payload = decodeJwtPayload(tokenData.id_token);
    const email = (
      (payload.email as string) ||
      (payload.preferred_username as string) ||
      ""
    ).toLowerCase();
    const fullName = (payload.name as string) || "";

    if (!email) {
      return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
    }

    // Check domain allowlist
    const domain = email.split("@")[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Try to create user; if they already exist, that's fine
    const { data: newUserData, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    let userId: string;

    if (createError) {
      // User already exists – look up from profiles
      const { data: profile } = await adminClient
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .single();

      if (!profile) {
        console.error("User exists in auth but no profile found for:", email);
        return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
      }
      userId = profile.user_id;
    } else {
      userId = newUserData.user.id;
    }

    // Upsert profile
    const displayName = email.split("@")[0];
    await adminClient.from("profiles").upsert(
      {
        user_id: userId,
        email,
        display_name: displayName,
        full_name: fullName,
      },
      { onConflict: "user_id" }
    );

    // Find company for this domain and upsert membership
    const { data: company } = await adminClient
      .from("companies")
      .select("id")
      .eq("domain", domain)
      .single();

    if (company) {
      await adminClient.from("company_memberships").upsert(
        {
          user_id: userId,
          company_id: company.id,
          role: "read_only",
        },
        { onConflict: "user_id,company_id" }
      );
    }

    // Generate magic link to create a session for this user
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${appUrl}/auth/callback`,
        },
      });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("Magic link error:", linkError?.message);
      return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
    }

    // Redirect user through Supabase's verify endpoint to establish session
    return Response.redirect(linkData.properties.action_link, 302);
  } catch (err) {
    console.error("Azure callback error:", (err as Error).message);
    return Response.redirect(`${appUrl}/login?error=unauthorized`, 302);
  }
});
