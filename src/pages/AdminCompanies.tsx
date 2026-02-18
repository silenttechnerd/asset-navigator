import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { Settings } from "lucide-react";

export default function AdminCompanies() {
  const { userRole } = useCompany();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCompany, setEditCompany] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const db = supabase as any;

  const canAccess = userRole === "system_admin";

  const load = async () => {
    setLoading(true);
    const { data } = await db.from("companies").select("*").order("name");
    setCompanies(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (canAccess) load();
  }, [canAccess]);

  if (!canAccess) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-muted-foreground">Access restricted to system administrators.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editCompany) return;
    setSaving(true);
    await db.from("companies").update({
      name: editCompany.name,
      asset_tag_prefix: editCompany.asset_tag_prefix,
      default_warranty_months: parseInt(editCompany.default_warranty_months),
      require_signature_on_issue: editCompany.require_signature_on_issue,
      require_signature_on_return: editCompany.require_signature_on_return,
      asset_issuance_policy_text: editCompany.asset_issuance_policy_text,
      asset_issuance_policy_version: editCompany.asset_issuance_policy_version,
    }).eq("id", editCompany.id);
    setSaving(false);
    setEditCompany(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Companies</h1>
        <p className="text-sm text-muted-foreground">System admin — manage all tenants</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        ) : companies.map((company) => (
          <Card key={company.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">{company.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{company.asset_tag_prefix}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditCompany({ ...company })}>
                <Settings className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Warranty Default</p>
                <p className="font-medium text-foreground">{company.default_warranty_months} months</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sig on Issue</p>
                <Badge variant={company.require_signature_on_issue ? "default" : "secondary"}>
                  {company.require_signature_on_issue ? "Required" : "Optional"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Sig on Return</p>
                <Badge variant={company.require_signature_on_return ? "default" : "secondary"}>
                  {company.require_signature_on_return ? "Required" : "Optional"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Policy Version</p>
                <p className="font-medium text-foreground">v{company.asset_issuance_policy_version}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editCompany} onOpenChange={() => setEditCompany(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Company — {editCompany?.name}</DialogTitle>
          </DialogHeader>
          {editCompany && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Company Name</Label>
                  <Input value={editCompany.name} onChange={(e) => setEditCompany((c: any) => ({ ...c, name: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Asset Tag Prefix</Label>
                  <Input value={editCompany.asset_tag_prefix ?? ""} onChange={(e) => setEditCompany((c: any) => ({ ...c, asset_tag_prefix: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Default Warranty (months)</Label>
                  <Input type="number" value={editCompany.default_warranty_months ?? ""} onChange={(e) => setEditCompany((c: any) => ({ ...c, default_warranty_months: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Policy Version</Label>
                  <Input value={editCompany.asset_issuance_policy_version ?? ""} onChange={(e) => setEditCompany((c: any) => ({ ...c, asset_issuance_policy_version: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Require Signature on Issue</p>
                  <p className="text-xs text-muted-foreground">Employee must sign when asset is assigned</p>
                </div>
                <Switch
                  checked={editCompany.require_signature_on_issue}
                  onCheckedChange={(v) => setEditCompany((c: any) => ({ ...c, require_signature_on_issue: v }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Require Signature on Return</p>
                  <p className="text-xs text-muted-foreground">Employee must sign when asset is returned</p>
                </div>
                <Switch
                  checked={editCompany.require_signature_on_return}
                  onCheckedChange={(v) => setEditCompany((c: any) => ({ ...c, require_signature_on_return: v }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Asset Issuance Policy Text</Label>
                <Textarea
                  value={editCompany.asset_issuance_policy_text ?? ""}
                  onChange={(e) => setEditCompany((c: any) => ({ ...c, asset_issuance_policy_text: e.target.value }))}
                  rows={5}
                  placeholder="Full policy text shown on signing page and embedded in PDF..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCompany(null)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
