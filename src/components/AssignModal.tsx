import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  asset: { id: string; asset_tag: string; company_id: string };
  onSuccess: () => void;
}

export default function AssignModal({ open, onClose, asset, onSuccess }: Props) {
  const { selectedCompany } = useCompany();
  const [employees, setEmployees] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const db = supabase as any;

  useEffect(() => {
    if (!open || !selectedCompany) return;
    const cid = selectedCompany.company_id;
    Promise.all([
      db.from("employees").select("id,first_name,last_name,email").eq("company_id", cid).eq("is_active", true).order("last_name"),
      db.from("locations").select("id,name").eq("company_id", cid).order("name"),
    ]).then(([emp, loc]: any[]) => {
      setEmployees(emp.data ?? []);
      setLocations(loc.data ?? []);
    });
  }, [open, selectedCompany]);

  const handleSubmit = async () => {
    if (!employeeId) { setError("Please select an employee."); return; }
    setSaving(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();

    const { data: assignment, error: assignErr } = await db.from("assignments").insert({
      company_id: asset.company_id,
      asset_id: asset.id,
      employee_id: employeeId,
      assigned_by_user_id: session?.user.id,
      notes: notes || null,
    }).select().single();

    if (assignErr) { setError(assignErr.message); setSaving(false); return; }

    const { data: company } = await db.from("companies").select("require_signature_on_issue").eq("id", asset.company_id).single();
    const requireSig = company?.require_signature_on_issue ?? false;

    await db.from("assets").update({
      assigned_to_employee_id: employeeId,
      active_assignment_id: assignment.id,
      current_location_id: locationId || null,
      status: requireSig ? "assigned_pending_signature" : "assigned",
    }).eq("id", asset.id);

    if (locationId) {
      await db.from("asset_events").insert({
        company_id: asset.company_id,
        asset_id: asset.id,
        event_type: "location_changed",
        performed_by_user_id: session?.user.id,
        related_employee_id: employeeId,
        related_assignment_id: assignment.id,
        new_value: { location_id: locationId },
      });
    }

    await db.from("asset_events").insert({
      company_id: asset.company_id,
      asset_id: asset.id,
      event_type: "assigned",
      performed_by_user_id: session?.user.id,
      related_employee_id: employeeId,
      related_assignment_id: assignment.id,
      new_value: { status: requireSig ? "assigned_pending_signature" : "assigned" },
      notes: notes || null,
    });

    setSaving(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign {asset.asset_tag}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label>Employee *</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger><SelectValue placeholder="Select employee…" /></SelectTrigger>
              <SelectContent>
                {employees.map((e: any) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.first_name} {e.last_name} — {e.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger><SelectValue placeholder="Select location…" /></SelectTrigger>
              <SelectContent>
                {locations.map((l: any) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Assigning..." : "Assign Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
