import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Membership {
  id: string;
  company_id: string;
  role: "system_admin" | "company_admin" | "it_staff" | "read_only";
  companies: {
    id: string;
    name: string;
  };
}

interface CompanyContextType {
  memberships: Membership[];
  selectedCompany: Membership | null;
  setSelectedCompany: (m: Membership) => void;
  userRole: Membership["role"] | null;
  loading: boolean;
  loadMemberships: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMemberships = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMemberships([]);
      setSelectedCompany(null);
      setLoading(false);
      return;
    }

    const { data, error } = await (supabase as any)
      .from("memberships")
      .select("id, company_id, role, companies(id, name)");

    if (!error && data) {
      // Cast the data since the generated types may not match our interface exactly
      const typed = data as unknown as Membership[];
      setMemberships(typed);

      // Restore previously selected company or pick first
      const stored = localStorage.getItem("active_company_id");
      const match = typed.find((m) => m.company_id === stored);
      if (match) {
        setSelectedCompany(match);
      } else if (typed.length === 1) {
        setSelectedCompany(typed[0]);
        localStorage.setItem("active_company_id", typed[0].company_id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMemberships();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadMemberships();
      } else {
        setMemberships([]);
        setSelectedCompany(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSetSelected = (m: Membership) => {
    setSelectedCompany(m);
    localStorage.setItem("active_company_id", m.company_id);
  };

  const userRole = selectedCompany?.role ?? null;

  return (
    <CompanyContext.Provider
      value={{
        memberships,
        selectedCompany,
        setSelectedCompany: handleSetSelected,
        userRole,
        loading,
        loadMemberships,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useCompany must be used within CompanyProvider");
  return context;
};
