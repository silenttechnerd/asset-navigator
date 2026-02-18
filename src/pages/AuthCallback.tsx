import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Monitor } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { loadMemberships } = useCompany();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError("Authentication failed. Please try again.");
        return;
      }

      try {
        // Call post-login-hook edge function
        const { data, error: fnError } = await supabase.functions.invoke(
          "post-login-hook",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (fnError) {
          // Check if it's a 403 from the function
          const body = typeof fnError === "object" && "context" in fnError
            ? (fnError as any).context
            : null;

          await supabase.auth.signOut();
          setError("Access denied: your email domain is not authorized.");
          return;
        }

        const memberships = data?.memberships;

        if (!memberships || memberships.length === 0) {
          await supabase.auth.signOut();
          setError("No company memberships found for your account.");
          return;
        }

        // Reload memberships in context
        await loadMemberships();

        if (memberships.length > 1) {
          navigate("/select-company", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        await supabase.auth.signOut();
        setError("Access denied: your email domain is not authorized.");
      }
    };

    handleCallback();
  }, [navigate, loadMemberships]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sidebar">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Monitor className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-sidebar-primary-foreground">AssetTrack</h1>
          </div>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar">
      <div className="animate-pulse text-sidebar-foreground">Signing you in…</div>
    </div>
  );
};

export default AuthCallback;
