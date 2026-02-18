import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  asset: { id: string; asset_tag: string; company_id: string; active_assignment_id: string | null };
  onSuccess: () => void;
}

export default function CheckInModal({ open, onClose, asset, onSuccess }: Props) {
  const [condition, setCondition] = useState("good");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const db = supabase as any;

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const now = new Date().toISOString();

    if (asset.active_assignment_id) {
      const { data: assignment } = await db.from("assignments")
        .select("employee_id, company_id")
        .eq("id", asset.active_assignment_id).single();

      await db.from("assignments").update({
        returned_at: now,
        return_condition: condition,
        return_notes: notes || null,
      }).eq("id", asset.active_assignment_id);

      await db.from("assets").update({
        status: "in_stock",
        assigned_to_employee_id: null,
        active_assignment_id: null,
        condition: condition,
      }).eq("id", asset.id);

      await db.from("asset_events").insert({
        company_id: asset.company_id,
        asset_id: asset.id,
        event_type: "unassigned",
        performed_by_user_id: session?.user.id,
        related_employee_id: assignment?.employee_id,
        related_assignment_id: asset.active_assignment_id,
        old_value: { status: "assigned" },
        new_value: { status: "in_stock", condition },
        notes: notes || null,
      });
    }

    setSaving(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In {asset.asset_tag}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label>Return Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Return Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any damage, missing items..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Checking in..." : "Check In Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
