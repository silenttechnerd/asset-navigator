import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CompanyProvider } from "@/context/CompanyContext";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import SelectCompany from "@/pages/SelectCompany";
import Dashboard from "@/pages/Dashboard";
import Assets from "@/pages/Assets";
import Employees from "@/pages/Employees";
import Locations from "@/pages/Locations";
import Reports from "@/pages/Reports";
import AdminCompanies from "@/pages/AdminCompanies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CompanyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select-company" element={<SelectCompany />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin/companies" element={<AdminCompanies />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
