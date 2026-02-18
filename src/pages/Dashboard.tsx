import { Package, Users, MapPin, AlertTriangle, Clock, FileSignature } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/context/CompanyContext";

const kpiData = [
  { label: "Total Assets", value: "1,247", icon: Package, change: "+12 this month" },
  { label: "Assigned", value: "982", icon: Users, change: "78.7% utilization" },
  { label: "In Stock", value: "198", icon: MapPin, change: "Ready to deploy" },
  { label: "Pending Signatures", value: "14", icon: FileSignature, change: "Awaiting action" },
  { label: "In Repair", value: "43", icon: AlertTriangle, change: "3.4% of fleet" },
  { label: "Recently Added", value: "27", icon: Clock, change: "Last 30 days" },
];

const pendingSignatures = [
  { id: "1", employee: "Sarah Johnson", asset: "MacBook Pro 16\"", tag: "AST-001234", type: "Issue", sentAt: "2 hours ago" },
  { id: "2", employee: "Mike Chen", asset: "iPhone 15 Pro", tag: "AST-001235", type: "Issue", sentAt: "5 hours ago" },
  { id: "3", employee: "Lisa Williams", asset: "Dell Monitor 27\"", tag: "AST-001198", type: "Return", sentAt: "1 day ago" },
  { id: "4", employee: "Tom Davis", asset: "ThinkPad X1 Carbon", tag: "AST-001200", type: "Issue", sentAt: "2 days ago" },
];

const recentEvents = [
  { action: "Asset assigned", detail: "MacBook Pro → Sarah Johnson", time: "2 hours ago" },
  { action: "Signature completed", detail: "Mike Chen signed for iPhone 15", time: "3 hours ago" },
  { action: "Asset checked in", detail: "Dell Laptop returned by Alex Park", time: "5 hours ago" },
  { action: "New asset added", detail: "10x Dell Monitors imported via CSV", time: "1 day ago" },
  { action: "Employee offboarded", detail: "James Wilson - 3 assets returned", time: "2 days ago" },
];

const Dashboard = () => {
  const { selectedCompany } = useCompany();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{selectedCompany?.name} — Overview</p>
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
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Pending Signatures */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingSignatures.map((sig) => (
                <div key={sig.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{sig.employee}</p>
                    <p className="text-xs text-muted-foreground">{sig.asset} · {sig.tag}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={sig.type === "Issue" ? "default" : "secondary"}>
                      {sig.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{sig.sentAt}</span>
                  </div>
                </div>
              ))}
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
              {recentEvents.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.action}</p>
                    <p className="text-xs text-muted-foreground">{event.detail}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
