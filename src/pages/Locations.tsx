import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";

export default function Locations() {
  const { selectedCompany, userRole } = useCompany();
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", notes: "" });
  const db = supabase as any;

  const canWrite = userRole && ["system_admin", "company_admin", "it_staff"].includes(userRole);

  const load = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    const { data } = await db.from("locations")
      .select("id, name, address, notes, created_at")
      .eq("company_id", selectedCompany.company_id)
      .order("name");
    setLocations(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedCompany]);

  const handleAdd = async () => {
    if (!form.name || !selectedCompany) return;
    setSaving(true);
    await db.from("locations").insert({
      company_id: selectedCompany.company_id,
      name: form.name.trim(),
      address: form.address || null,
      notes: form.notes || null,
    });
    setSaving(false);
    setAddOpen(false);
    setForm({ name: "", address: "", notes: "" });
    load();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Locations</h1>
          <p className="text-sm text-muted-foreground">{selectedCompany?.companies.name}</p>
        </div>
        {canWrite && (
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Location
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
        ) : locations.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-12 text-center">
            <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No locations yet</p>
          </div>
        ) : locations.map((loc) => (
          <Link key={loc.id} to={`/locations/${loc.id}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">{loc.name}</p>
                </div>
                {loc.address && <p className="text-sm text-muted-foreground">{loc.address}</p>}
                {loc.notes && <p className="text-xs text-muted-foreground">{loc.notes}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Location</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Main Office" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving || !form.name}>
              {saving ? "Saving..." : "Add Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
