import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRole } = useCompany();
  const [employee, setEmployee] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [terminating, setTerminating] = useState(false);
  const db = supabase as any;

  const canWrite = userRole && ["system_admin", "company_admin", "it_staff"].includes(userRole);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [empRes, assetsRes] = await Promise.all([
        db.from("employees").select("*, locations(name)").eq("id", id).single(),
        db.from("assets").select("id, asset_tag, category, make, model, status").eq("assigned_to_employee_id", id),
      ]);
      setEmployee(empRes.data);
      setAssets(assetsRes.data ?? []);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleTerminate = async () => {
    setTerminating(true);
    const { data: { session } } = await supabase.auth.getSession();
    const now = new Date().toISOString();
    await db.from("employees").update({ is_active: false, terminated_at: now }).eq("id", id);
    for (const asset of assets) {
      await db.from("assets").update({
        status: "in_stock", assigned_to_employee_id: null, active_assignment_id: null,
      }).eq("id", asset.id);
      await db.from("asset_events").insert({
        company_id: employee.company_id, asset_id: asset.id,
        event_type: "unassigned",
        performed_by_user_id: session?.user.id,
        related_employee_id: id,
        new_value: { status: "in_stock", reason: "employee_terminated" },
      });
    }
    setTerminating(false);
    setTerminateOpen(false);
    navigate("/employees");
  };

  if (loading) return (
    <div className="p-6 lg:p-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (!employee) return (
    <div className="p-6 lg:p-8">
      <p className="text-muted-foreground">Employee not found.</p>
      <Button variant="ghost" onClick={() => navigate("/employees")} className="mt-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/employees")} className="mb-4 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Employees
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{employee.first_name} {employee.last_name}</h1>
          <p className="text-muted-foreground">{employee.job_title ?? "—"} · {employee.department ?? "—"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={employee.is_active ? "default" : "secondary"}>
            {employee.is_active ? "Active" : "Terminated"}
          </Badge>
          {canWrite && employee.is_active && (
            <Button variant="destructive" size="sm" onClick={() => setTerminateOpen(true)}>
              <UserX className="h-4 w-4 mr-1" /> Terminate
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Employee Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Email", employee.email],
              ["Job Title", employee.job_title ?? "—"],
              ["Department", employee.department ?? "—"],
              ["Location", employee.locations?.name ?? "—"],
              ["Status", employee.is_active ? "Active" : "Terminated"],
              ["Terminated At", employee.terminated_at ? new Date(employee.terminated_at).toLocaleDateString() : "—"],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assigned Assets ({assets.length})</CardTitle></CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets currently assigned</p>
            ) : (
              <div className="space-y-2">
                {assets.map((a) => (
                  <Link key={a.id} to={`/assets/${a.id}`} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{a.asset_tag}</p>
                      <p className="text-xs text-muted-foreground">{a.make} {a.model} · {a.category}</p>
                    </div>
                    <Badge variant="secondary">{a.status.replace(/_/g, " ")}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={terminateOpen} onOpenChange={setTerminateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate {employee.first_name} {employee.last_name}?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This will mark the employee as terminated and check in all {assets.length} assigned asset{assets.length !== 1 ? "s" : ""} back to in_stock.
            </p>
            {assets.length > 0 && (
              <div className="text-sm space-y-1">
                {assets.map((a) => (
                  <p key={a.id} className="text-muted-foreground">· {a.asset_tag} — {a.make} {a.model}</p>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTerminateOpen(false)} disabled={terminating}>Cancel</Button>
            <Button variant="destructive" onClick={handleTerminate} disabled={terminating}>
              {terminating ? "Terminating..." : "Confirm Terminate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
