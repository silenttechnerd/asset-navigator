import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_DOMAINS = [
  "spragginsinc.com",
  "contractorsource.com",
  "integrateddoorllc.com",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the user's JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: claimsData, error: claimsError } =
      await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));

    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const email = claimsData.claims.email as string;

    if (!email) {
      return new Response(JSON.stringify({ error: "No email in token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const domain = email.split("@")[1]?.toLowerCase();

    if (!ALLOWED_DOMAINS.includes(domain)) {
      // Delete unauthorized user
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.auth.admin.deleteUser(userId);

      return new Response(
        JSON.stringify({
          error: "Access denied: your email domain is not authorized.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use service role for upserts (bypasses RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Upsert profile
    const displayName = email.split("@")[0];
    await adminClient.from("profiles").upsert(
      {
        user_id: userId,
        email,
        display_name: displayName,
      },
      { onConflict: "user_id" }
    );

    // Find the company for this domain
    const { data: company } = await adminClient
      .from("companies")
      .select("id")
      .eq("domain", domain)
      .single();

    if (company) {
      // Upsert membership with default role
      await adminClient.from("company_memberships").upsert(
        {
          user_id: userId,
          company_id: company.id,
          role: "read_only",
        },
        { onConflict: "user_id,company_id" }
      );
    }

    // Return all memberships
    const { data: memberships } = await adminClient
      .from("company_memberships")
      .select("id, company_id, role, companies(id, name, domain)")
      .eq("user_id", userId);

    return new Response(JSON.stringify({ memberships }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
