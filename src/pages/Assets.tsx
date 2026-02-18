import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompany } from "@/context/CompanyContext";
import { useAssets, AssetFilters } from "@/hooks/useAssets";

const STATUS_COLORS: Record<string, string> = {
  in_stock: "bg-green-100 text-green-800",
  assigned: "bg-blue-100 text-blue-800",
  assigned_pending_signature: "bg-yellow-100 text-yellow-800",
  in_repair: "bg-orange-100 text-orange-800",
  lost: "bg-red-100 text-red-800",
  stolen: "bg-red-200 text-red-900",
  retired: "bg-gray-100 text-gray-600",
  disposed: "bg-gray-200 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  assigned: "Assigned",
  assigned_pending_signature: "Pending Sig",
  in_repair: "In Repair",
  lost: "Lost",
  stolen: "Stolen",
  retired: "Retired",
  disposed: "Disposed",
};

const CATEGORIES = [
  "Laptop", "Desktop", "Monitor", "Phone", "Tablet",
  "Printer", "Peripheral", "Network", "Tool", "Other",
];

export default function Assets() {
  const { selectedCompany, userRole } = useCompany();
  const [filters, setFilters] = useState<AssetFilters>({
    search: "", status: "all", category: "all", assigned: "all",
  });
  const [searchInput, setSearchInput] = useState("");

  const { assets, loading, total } = useAssets(selectedCompany?.company_id, filters);

  const canWrite = userRole && ["system_admin", "company_admin", "it_staff"].includes(userRole);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput }));
  };

  const setFilter = (key: keyof AssetFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-sm text-muted-foreground">
            {total} asset{total !== 1 ? "s" : ""} in {selectedCompany?.companies.name}
          </p>
        </div>
        {canWrite && (
          <Button asChild>
            <Link to="/assets/new">
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Link>
          </Button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tag, serial, IMEI, phone…"
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>

        <Select value={filters.status} onValueChange={(v) => setFilter("status", v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(v) => setFilter("category", v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.assigned} onValueChange={(v) => setFilter("assigned", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Assignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        {(filters.search || filters.status !== "all" || filters.category !== "all" || filters.assigned !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({ search: "", status: "all", category: "all", assigned: "all" });
              setSearchInput("");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Asset Tag</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Make / Model</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assigned To</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Warranty</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-5 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : assets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">No assets found</p>
                      {canWrite && (
                        <Button asChild variant="link" className="mt-1">
                          <Link to="/assets/new">Add your first asset</Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => {
                    const warrantyDate = asset.warranty_end_date
                      ? new Date(asset.warranty_end_date)
                      : null;
                    const warrantyExpiring =
                      warrantyDate &&
                      warrantyDate > new Date() &&
                      warrantyDate < new Date(Date.now() + 30 * 86400000);
                    const warrantyExpired = warrantyDate && warrantyDate < new Date();

                    return (
                      <tr key={asset.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Link to={`/assets/${asset.id}`} className="font-medium text-primary hover:underline">
                            {asset.asset_tag}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{asset.category}</td>
                        <td className="px-4 py-3">
                          {[asset.make, asset.model].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[asset.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[asset.status] ?? asset.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {asset.employees
                            ? `${asset.employees.first_name} ${asset.employees.last_name}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {asset.locations?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {warrantyDate ? (
                            <span className={warrantyExpired ? "text-destructive" : warrantyExpiring ? "text-yellow-600" : "text-muted-foreground"}>
                              {warrantyDate.toLocaleDateString()}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/assets/${asset.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
