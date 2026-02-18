import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const STATUS_COLORS: Record<string, string> = {
  in_stock: "bg-green-100 text-green-800",
  assigned: "bg-blue-100 text-blue-800",
  assigned_pending_signature: "bg-yellow-100 text-yellow-800",
  in_repair: "bg-orange-100 text-orange-800",
};

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = supabase as any;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [locRes, assetsRes] = await Promise.all([
        db.from("locations").select("*").eq("id", id).single(),
        db.from("assets").select("id, asset_tag, category, make, model, status, employees(first_name, last_name)").eq("current_location_id", id).order("asset_tag"),
      ]);
      setLocation(locRes.data);
      setAssets(assetsRes.data ?? []);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (!location) return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Location not found.</p>
      <Button variant="ghost" onClick={() => navigate("/locations")} className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/locations")} className="mb-4 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Locations
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{location.name}</h1>
        {location.address && <p className="text-muted-foreground">{location.address}</p>}
        {location.notes && <p className="text-sm text-muted-foreground mt-1">{location.notes}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assets at this Location ({assets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Asset Tag</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">Make / Model</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Assigned To</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No assets at this location
                    </td>
                  </tr>
                ) : assets.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium text-foreground">{a.asset_tag}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{a.category}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{[a.make, a.model].filter(Boolean).join(" ") || "—"}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[a.status] ?? "bg-muted text-muted-foreground"}`}>
                        {a.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {a.employees ? `${a.employees.first_name} ${a.employees.last_name}` : "—"}
                    </td>
                    <td className="py-2">
                      <Link to={`/assets/${a.id}`} className="text-primary hover:underline text-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
