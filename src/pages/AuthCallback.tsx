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
    // Listen for auth state changes — this fires after the client
    // processes the hash tokens from the magic-link redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          try {
            // Profile & membership already created by azure-auth-callback,
            // just reload memberships into context.
            await loadMemberships();

            // Check how many memberships to decide where to navigate
            const { data: memberships } = await supabase
              .from("company_memberships")
              .select("id, company_id, role, companies(id, name, domain)")
              .eq("user_id", session.user.id);

            if (!memberships || memberships.length === 0) {
              await supabase.auth.signOut();
              setError("No company memberships found for your account.");
              return;
            }

            if (memberships.length > 1) {
              navigate("/select-company", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          } catch (err) {
            console.error("AuthCallback error:", err);
            setError("Something went wrong. Please try again.");
          }
        }
      }
    );

    // Also check if there's already a session (in case event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Trigger the same logic by re-emitting
        loadMemberships().then(async () => {
          const { data: memberships } = await supabase
            .from("company_memberships")
            .select("id, company_id, role, companies(id, name, domain)")
            .eq("user_id", session.user.id);

          if (!memberships || memberships.length === 0) {
            await supabase.auth.signOut();
            setError("No company memberships found for your account.");
            return;
          }

          if (memberships.length > 1) {
            navigate("/select-company", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }).catch(() => {
          setError("Something went wrong. Please try again.");
        });
      }
    });

    return () => subscription.unsubscribe();
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
