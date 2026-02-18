import { Link } from "react-router-dom";
import { Package, Users, MapPin, AlertTriangle, Clock, FileSignature } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/context/CompanyContext";
import { useDashboardStats, timeAgo } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { selectedCompany } = useCompany();
  const stats = useDashboardStats();

  if (!selectedCompany) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-muted-foreground">Select a company to view dashboard</p>
      </div>
    );
  }

  const kpiData = [
    { label: "Total Assets", value: stats.totalAssets, icon: Package, change: `${stats.assigned + stats.inStock + stats.inRepair} tracked` },
    { label: "Assigned", value: stats.assigned, icon: Users, change: stats.totalAssets > 0 ? `${((stats.assigned / stats.totalAssets) * 100).toFixed(1)}% utilization` : "0% utilization" },
    { label: "In Stock", value: stats.inStock, icon: MapPin, change: "Ready to deploy" },
    { label: "Pending Signatures", value: stats.pendingSignatures, icon: FileSignature, change: "Awaiting action" },
    { label: "In Repair", value: stats.inRepair, icon: AlertTriangle, change: stats.totalAssets > 0 ? `${((stats.inRepair / stats.totalAssets) * 100).toFixed(1)}% of fleet` : "0% of fleet" },
    { label: "Recently Added", value: "—", icon: Clock, change: "Last 30 days" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{selectedCompany?.companies?.name} — Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.label} className="animate-fade-in border-border">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                {stats.loading ? (
                  <Skeleton className="mt-1 h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Pending Signatures */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Pending Signatures</CardTitle>
            <Link to="/assets?filter=pending_signatures" className="text-xs font-medium text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-14" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : stats.pendingForms.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No pending signatures</p>
              ) : (
                stats.pendingForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{form.employee_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {form.asset_description} · {form.asset_tag}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={form.type === "issuance" ? "default" : "secondary"}>
                        {form.type.charAt(0).toUpperCase() + form.type.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{timeAgo(form.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : stats.recentEvents.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No recent activity</p>
              ) : (
                stats.recentEvents.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {event.event_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.asset_tag}{event.performed_by ? ` · ${event.performed_by}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(event.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
