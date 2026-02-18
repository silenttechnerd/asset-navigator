import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Monitor, Package, Users, MapPin, FileSpreadsheet,
  Settings, LogOut, Building2, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/assets", icon: Package, label: "Assets" },
  { to: "/employees", icon: Users, label: "Employees" },
  { to: "/locations", icon: MapPin, label: "Locations" },
  { to: "/reports", icon: FileSpreadsheet, label: "Reports" },
  { to: "/admin/companies", icon: Settings, label: "Admin", adminOnly: true },
];

const AppLayout = () => {
  const { selectedCompany, memberships, setSelectedCompany, userRole } = useCompany();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-sidebar">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Monitor className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground">AssetTrack</span>
        </div>

        {/* Company Switcher */}
        <div className="px-4 pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent/80">
                <Building2 className="h-4 w-4 text-sidebar-foreground" />
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium text-sidebar-primary-foreground">
                    {selectedCompany?.companies?.name ?? "Select company"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {memberships.map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  onClick={() => setSelectedCompany(m)}
                  className={m.company_id === selectedCompany?.company_id ? "bg-accent" : ""}
                >
                  {m.companies.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems
            .filter((item) => !item.adminOnly || userRole === "system_admin" || userRole === "company_admin")
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
