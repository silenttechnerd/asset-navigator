import { Package, Users, MapPin, AlertTriangle, FileSignature, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { useDashboardStats, timeAgo, formatEventType } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { selectedCompany } = useCompany();
  const stats = useDashboardStats(selectedCompany?.company_id);

  if (!selectedCompany) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-muted-foreground">Select a company to view the dashboard.</p>
      </div>
    );
  }

  const kpiCards = [
    { label: "Total Assets", value: stats.totalAssets, icon: Package, sub: "All tracked assets" },
    { label: "Assigned", value: stats.assigned, icon: Users, sub: `${stats.totalAssets ? Math.round((stats.assigned / stats.totalAssets) * 100) : 0}% utilization` },
    { label: "In Stock", value: stats.inStock, icon: MapPin, sub: "Ready to deploy" },
    { label: "Pending Signatures", value: stats.pendingSignatures, icon: FileSignature, sub: "Awaiting action" },
    { label: "In Repair", value: stats.inRepair, icon: AlertTriangle, sub: `${stats.totalAssets ? Math.round((stats.inRepair / stats.totalAssets) * 100) : 0}% of fleet` },
    { label: "Pending Forms", value: stats.pendingForms.length, icon: Activity, sub: "Sent, not yet signed" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {selectedCompany.companies.name} — Overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((kpi) => (
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
                <p className="text-xs text-muted-foreground">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Pending Signatures Table */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Pending Signatures</CardTitle>
            <Link to="/assets?filter=pending_signatures" className="text-xs font-medium text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : stats.pendingForms.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No pending signatures
              </p>
            ) : (
              <div className="space-y-3">
                {stats.pendingForms.map((form) => {
                  const emp = form.assignments?.employees;
                  const empName = emp
                    ? `${emp.first_name} ${emp.last_name}`
                    : "Unknown Employee";
                  const assetLabel = form.assets
                    ? `${form.assets.make} ${form.assets.model}`
                    : "Unknown Asset";
                  return (
                    <div key={form.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{empName}</p>
                        <p className="text-xs text-muted-foreground">
                          {assetLabel} · {form.assets?.asset_tag}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={form.type === "issuance" ? "default" : "secondary"}>
                          {form.type === "issuance" ? "Issue" : "Return"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(form.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats.recentEvents.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentEvents.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatEventType(event.event_type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.assets?.asset_tag}
                        {event.profiles?.full_name ? ` · ${event.profiles.full_name}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(event.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
