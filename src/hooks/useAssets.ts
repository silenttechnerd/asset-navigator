import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Asset {
  id: string;
  asset_tag: string;
  serial_number: string | null;
  category: string;
  make: string | null;
  model: string | null;
  status: string;
  condition: string;
  current_location_id: string | null;
  assigned_to_employee_id: string | null;
  warranty_end_date: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  notes: string | null;
  imei1: string | null;
  phone_number: string | null;
  attachment_count: number;
  created_at: string;
  last_event_at: string | null;
  employees: { first_name: string; last_name: string; email: string } | null;
  locations: { name: string } | null;
}

export interface AssetFilters {
  search: string;
  status: string;
  category: string;
  assigned: string;
}

export function useAssets(companyId: string | undefined, filters: AssetFilters) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      const db = supabase as any;
      let query = db
        .from("assets")
        .select(`
          id, asset_tag, serial_number, category, make, model,
          status, condition, current_location_id, assigned_to_employee_id,
          warranty_end_date, purchase_date, purchase_price, notes,
          imei1, phone_number, attachment_count, created_at, last_event_at,
          employees(first_name, last_name, email),
          locations:current_location_id(name)
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (filters.status && filters.status !== "all")
        query = query.eq("status", filters.status);
      if (filters.category && filters.category !== "all")
        query = query.eq("category", filters.category);
      if (filters.assigned === "assigned")
        query = query.not("assigned_to_employee_id", "is", null);
      if (filters.assigned === "unassigned")
        query = query.is("assigned_to_employee_id", null);
      if (filters.search) {
        query = query.or(
          `asset_tag.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%,imei1.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (!error && data) {
        setAssets(data as unknown as Asset[]);
        setTotal(data.length);
      }
      setLoading(false);
    };

    load();
  }, [companyId, filters.status, filters.category, filters.assigned, filters.search]);

  return { assets, loading, total };
}
