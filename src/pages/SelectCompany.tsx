import { useNavigate } from "react-router-dom";
import { useCompany, Membership } from "@/context/CompanyContext";
import { Building2, ChevronRight, Monitor } from "lucide-react";

const SelectCompany = () => {
  const navigate = useNavigate();
  const { memberships, setSelectedCompany } = useCompany();

  const handleSelect = (membership: Membership) => {
    setSelectedCompany(membership);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Monitor className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-sidebar-primary-foreground">Select Company</h1>
          <p className="mt-2 text-sm text-sidebar-foreground">
            You have access to multiple organizations
          </p>
        </div>

        <div className="space-y-3">
          {memberships.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className="group flex w-full items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar-accent p-4 text-left transition-all hover:border-primary hover:bg-sidebar-accent/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-border">
                <Building2 className="h-6 w-6 text-sidebar-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sidebar-primary-foreground">{m.companies.name}</p>
                <p className="text-sm text-sidebar-foreground">{m.companies.domain} · {m.role.replace("_", " ")}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-sidebar-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCompany;
