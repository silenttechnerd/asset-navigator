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
      <div className="flex items-center justify-center h-full">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {selectedCompany.companies.name} — Overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                {stats.loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-3xl font-bold">{kpi.value}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Signatures</CardTitle>
            <Link to="/assets?filter=pending_signatures" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : stats.pendingForms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending signatures</p>
            ) : (
              <div className="space-y-3">
                {stats.pendingForms.map((form) => {
                  const emp = form.assignments?.employees;
                  const empName = emp ? `${emp.first_name} ${emp.last_name}` : "Unknown Employee";
                  const assetLabel = form.assets ? `${form.assets.make} ${form.assets.model}` : "Unknown Asset";
                  return (
                    <div key={form.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{empName}</p>
                        <p className="text-xs text-muted-foreground">{assetLabel} · {form.assets?.asset_tag}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {form.type === "issuance" ? "Issue" : "Return"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{timeAgo(form.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : stats.recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {stats.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{formatEventType(event.event_type)}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.assets?.asset_tag}{event.profiles?.full_name ? ` · ${event.profiles.full_name}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(event.created_at)}</p>
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
