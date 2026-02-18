const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientId = Deno.env.get("AZURE_CLIENT_ID")!;
  const tenantUrl = Deno.env.get("AZURE_TENANT_URL")!;
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  const redirectUri = `${supabaseUrl}/functions/v1/azure-auth-callback`;

  const authUrl = new URL(`${tenantUrl}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid email profile offline_access");
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("prompt", "select_account");

  return Response.redirect(authUrl.toString(), 302);
});
