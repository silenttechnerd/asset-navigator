import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PendingForm {
  id: string;
  type: string;
  created_at: string;
  assets: { asset_tag: string; make: string; model: string } | null;
  assignments: {
    employees: { first_name: string; last_name: string } | null;
  } | null;
}

export interface RecentEvent {
  id: string;
  event_type: string;
  created_at: string;
  new_value: any;
  assets: { asset_tag: string } | null;
  profiles: { full_name: string } | null;
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
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function formatEventType(eventType: string): string {
  return eventType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function useDashboardStats(companyId: string | undefined): DashboardStats {
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
      setStats((s) => ({ ...s, loading: false }));
      return;
    }

    const load = async () => {
      setStats((s) => ({ ...s, loading: true }));

      const db = supabase as any;

      const [assetsRes, formsRes, eventsRes] = await Promise.all([
        db
          .from("assets")
          .select("status")
          .eq("company_id", companyId),
        db
          .from("form_requests")
          .select(`
            id, type, created_at,
            assets(asset_tag, make, model),
            assignments(employees(first_name, last_name))
          `)
          .eq("company_id", companyId)
          .eq("status", "sent")
          .order("created_at", { ascending: false })
          .limit(10),
        db
          .from("asset_events")
          .select(`
            id, event_type, created_at, new_value,
            assets(asset_tag),
            profiles(full_name)
          `)
          .eq("company_id", companyId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      const assets = assetsRes.data ?? [];
      const totalAssets = assets.length;
      const assigned = assets.filter((a) =>
        a.status === "assigned" || a.status === "assigned_pending_signature"
      ).length;
      const inStock = assets.filter((a) => a.status === "in_stock").length;
      const inRepair = assets.filter((a) => a.status === "in_repair").length;
      const pendingSignatures = assets.filter(
        (a) => a.status === "assigned_pending_signature"
      ).length;

      setStats({
        totalAssets,
        assigned,
        inStock,
        inRepair,
        pendingSignatures,
        pendingForms: (formsRes.data ?? []) as unknown as PendingForm[],
        recentEvents: (eventsRes.data ?? []) as unknown as RecentEvent[],
        loading: false,
      });
    };

    load();
  }, [companyId]);

  return stats;
}
