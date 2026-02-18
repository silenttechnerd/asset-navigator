import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "openid profile email",
      },
    });
    if (error) {
      console.error("OAuth error:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Monitor className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar-primary-foreground">AssetTrack</h1>
          <p className="mt-2 text-sidebar-foreground">IT Asset Management System</p>
        </div>

        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-8">
          <h2 className="mb-2 text-center text-lg font-semibold text-sidebar-primary-foreground">
            Sign in to continue
          </h2>
          <p className="mb-6 text-center text-sm text-sidebar-foreground">
            Use your organization's Microsoft 365 account
          </p>

          <Button
            onClick={handleMicrosoftLogin}
            className="w-full gap-3 bg-[hsl(210,100%,40%)] py-6 text-base font-medium hover:bg-[hsl(210,100%,35%)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            Continue with Microsoft
          </Button>

          <p className="mt-6 text-center text-xs text-sidebar-foreground">
            Access restricted to authorized domains only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
