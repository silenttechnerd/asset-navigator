import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Company {
  id: string;
  name: string;
  domain: string;
  role: "system_admin" | "company_admin" | "it_staff" | "read_only";
}

interface CompanyContextType {
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
  setCompanies: (companies: Company[]) => void;
  userRole: Company["role"] | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Spraggins Inc", domain: "spragginsinc.com", role: "company_admin" },
    { id: "2", name: "Contractor Source", domain: "contractorsource.com", role: "it_staff" },
  ]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companies[0]);

  const userRole = selectedCompany?.role ?? null;

  return (
    <CompanyContext.Provider value={{ companies, selectedCompany, setSelectedCompany, setCompanies, userRole }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useCompany must be used within CompanyProvider");
  return context;
};
