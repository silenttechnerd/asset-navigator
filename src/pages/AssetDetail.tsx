import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AssignModal from "@/components/AssignModal";
import CheckInModal from "@/components/CheckInModal";

const AssetDetail = () => {
  const { id } = useParams();
  const { selectedCompany, userRole } = useCompany();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);

  const canWrite = userRole && ["system_admin", "company_admin", "it_staff"].includes(userRole);

  useEffect(() => {
    if (!id || !selectedCompany) return;
    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      const { data } = await db
        .from("assets")
        .select(`
          *,
          employees(first_name, last_name, email),
          locations:current_location_id(name)
        `)
        .eq("id", id)
        .single();
      setAsset(data);
      setLoading(false);
    };
    load();
  }, [id, selectedCompany]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Asset Not Found</h1>
        <p className="text-muted-foreground">Asset ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{asset.asset_tag}</h1>
          <p className="text-muted-foreground">
            {[asset.make, asset.model].filter(Boolean).join(" ") || asset.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {asset.status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </Badge>
          {canWrite && !asset.assigned_to_employee_id && asset.status === "in_stock" && (
            <Button onClick={() => setAssignOpen(true)}>Assign</Button>
          )}
          {canWrite && asset.assigned_to_employee_id && (
            <Button variant="outline" onClick={() => setCheckInOpen(true)}>Check In</Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Serial:</span> {asset.serial_number ?? "—"}</p>
          <p><span className="text-muted-foreground">Category:</span> {asset.category}</p>
          <p><span className="text-muted-foreground">Condition:</span> {asset.condition}</p>
          <p><span className="text-muted-foreground">Location:</span> {asset.locations?.name ?? "—"}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Assigned To:</span> {asset.employees ? `${asset.employees.first_name} ${asset.employees.last_name}` : "—"}</p>
          <p><span className="text-muted-foreground">IMEI:</span> {asset.imei1 ?? "—"}</p>
          <p><span className="text-muted-foreground">Phone:</span> {asset.phone_number ?? "—"}</p>
          <p><span className="text-muted-foreground">Purchase Date:</span> {asset.purchase_date ?? "—"}</p>
        </div>
      </div>

      {asset && (
        <>
          <AssignModal
            open={assignOpen}
            onClose={() => setAssignOpen(false)}
            asset={{ id: asset.id, asset_tag: asset.asset_tag, company_id: asset.company_id }}
            onSuccess={() => { setAssignOpen(false); window.location.reload(); }}
          />
          <CheckInModal
            open={checkInOpen}
            onClose={() => setCheckInOpen(false)}
            asset={{ id: asset.id, asset_tag: asset.asset_tag, company_id: asset.company_id, active_assignment_id: asset.active_assignment_id }}
            onSuccess={() => { setCheckInOpen(false); window.location.reload(); }}
          />
        </>
      )}
    </div>
  );
};

export default AssetDetail;
