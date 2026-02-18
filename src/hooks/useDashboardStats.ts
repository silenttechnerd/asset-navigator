import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";

export interface PendingForm {
  id: string;
  type: string;
  created_at: string;
  employee_name: string;
  asset_tag: string;
  asset_description: string;
}

export interface RecentEvent {
  id: string;
  event_type: string;
  created_at: string;
  new_value: string | null;
  asset_tag: string;
  performed_by: string;
}

export interface DashboardStats {
  totalAssets: number;
  assigned: number;
  inStock: number;
  inRepair: number;
  pendingSignatures: number;
  pendingForms: PendingForm[];
  recentEvents: RecentEvent[];
  loading: boolean;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function useDashboardStats(): DashboardStats {
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.company_id;

  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    assigned: 0,
    inStock: 0,
    inRepair: 0,
    pendingSignatures: 0,
    pendingForms: [],
    recentEvents: [],
    loading: true,
  });

  useEffect(() => {
    if (!companyId) {
      setStats((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchData = async () => {
      setStats((prev) => ({ ...prev, loading: true }));

      const db = supabase as any;

      const [assetsRes, formsRes, eventsRes] = await Promise.all([
        db
          .from("assets")
          .select("status")
          .eq("company_id", companyId),
        db
          .from("form_requests")
          .select(
            "id,type,created_at,assignments(employees(first_name,last_name)),assets(asset_tag,make,model)"
          )
          .eq("company_id", companyId)
          .eq("status", "sent")
          .order("created_at", { ascending: false })
          .limit(10),
        db
          .from("asset_events")
          .select(
            "id,event_type,created_at,new_value,assets(asset_tag),profiles(full_name)"
          )
          .eq("company_id", companyId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      const assets: { status: string }[] = assetsRes.data ?? [];
      const totalAssets = assets.length;
      const assigned = assets.filter((a) => a.status === "assigned").length;
      const inStock = assets.filter((a) => a.status === "in_stock").length;
      const inRepair = assets.filter((a) => a.status === "in_repair").length;

      const rawForms: any[] = formsRes.data ?? [];
      const pendingForms: PendingForm[] = rawForms.map((f: any) => {
        const emp = f.assignments?.employees;
        const employeeName = emp
          ? `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim()
          : "Unknown";
        const asset = f.assets;
        return {
          id: f.id,
          type: f.type,
          created_at: f.created_at,
          employee_name: employeeName,
          asset_tag: asset?.asset_tag ?? "",
          asset_description: asset
            ? `${asset.make ?? ""} ${asset.model ?? ""}`.trim()
            : "",
        };
      });

      const rawEvents: any[] = eventsRes.data ?? [];
      const recentEvents: RecentEvent[] = rawEvents.map((e: any) => ({
        id: e.id,
        event_type: e.event_type,
        created_at: e.created_at,
        new_value: e.new_value,
        asset_tag: e.assets?.asset_tag ?? "",
        performed_by: e.profiles?.full_name ?? "System",
      }));

      setStats({
        totalAssets,
        assigned,
        inStock,
        inRepair,
        pendingSignatures: pendingForms.length,
        pendingForms,
        recentEvents,
        loading: false,
      });
    };

    fetchData();
  }, [companyId]);

  return stats;
}
