import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCompany } from "@/context/CompanyContext";

const statusColors: Record<string, string> = {
  assigned: "bg-info/10 text-info border-info/20",
  in_stock: "bg-success/10 text-success border-success/20",
  assigned_pending_signature: "bg-warning/10 text-warning border-warning/20",
  in_repair: "bg-destructive/10 text-destructive border-destructive/20",
  retired: "bg-muted text-muted-foreground border-border",
};

const mockAssets = [
  { id: "1", asset_tag: "AST-001234", serial_number: "C02ZN1ABMD6M", category: "Laptop", make: "Apple", model: "MacBook Pro 16\"", status: "assigned", assigned_to: "Sarah Johnson", location: "HQ - Floor 2" },
  { id: "2", asset_tag: "AST-001235", serial_number: "F17YQHJ0GRY3", category: "Phone", make: "Apple", model: "iPhone 15 Pro", status: "assigned_pending_signature", assigned_to: "Mike Chen", location: "HQ - Floor 1" },
  { id: "3", asset_tag: "AST-001236", serial_number: "PF3NXWZ2", category: "Laptop", make: "Dell", model: "Latitude 5540", status: "in_stock", assigned_to: null, location: "IT Storage" },
  { id: "4", asset_tag: "AST-001237", serial_number: "5CD2345JKL", category: "Laptop", make: "Lenovo", model: "ThinkPad X1 Carbon", status: "in_repair", assigned_to: null, location: "Vendor - CompuFix" },
  { id: "5", asset_tag: "AST-001238", serial_number: "MXL1234ABC", category: "Monitor", make: "Dell", model: "U2723QE 27\"", status: "assigned", assigned_to: "Lisa Williams", location: "HQ - Floor 3" },
  { id: "6", asset_tag: "AST-001239", serial_number: "CN0H5TRK742", category: "Docking Station", make: "Dell", model: "WD22TB4", status: "in_stock", assigned_to: null, location: "IT Storage" },
  { id: "7", asset_tag: "AST-001240", serial_number: "F2LXKJ7HG8YQ", category: "Phone", make: "Samsung", model: "Galaxy S24", status: "assigned", assigned_to: "Tom Davis", location: "Remote" },
  { id: "8", asset_tag: "AST-001241", serial_number: "C02AB1CDEF12", category: "Laptop", make: "Apple", model: "MacBook Air M3", status: "retired", assigned_to: null, location: "Warehouse" },
];

const Assets = () => {
  const { userRole } = useCompany();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const canWrite = userRole !== "read_only";

  const filtered = mockAssets.filter((a) => {
    const matchSearch =
      a.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
      a.serial_number.toLowerCase().includes(search.toLowerCase()) ||
      a.model.toLowerCase().includes(search.toLowerCase()) ||
      (a.assigned_to?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assets</h1>
          <p className="text-sm text-muted-foreground">{mockAssets.length} total assets</p>
        </div>
        {canWrite && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link to="/assets/new">
                <Plus className="h-4 w-4" /> Add Asset
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tag, serial, model, or employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="assigned_pending_signature">Pending Signature</SelectItem>
            <SelectItem value="in_repair">In Repair</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Asset Tag</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Device</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Serial</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assigned To</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <Link to={`/assets/${asset.id}`} className="font-medium text-primary hover:underline">
                      {asset.asset_tag}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {asset.make} {asset.model}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{asset.serial_number}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[asset.status]}`}>
                      {asset.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{asset.assigned_to ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{asset.location}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No assets found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;
