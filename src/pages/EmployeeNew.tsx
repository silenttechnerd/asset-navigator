import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/context/CompanyContext";

export default function EmployeeNew() {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const [locations, setLocations] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    department: "",
    location_id: "",
  });
  const db = supabase as any;

  useEffect(() => {
    if (!selectedCompany) return;
    db.from("locations")
      .select("id, name")
      .eq("company_id", selectedCompany.company_id)
      .order("name")
      .then(({ data }: any) => setLocations(data ?? []));
  }, [selectedCompany]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) {
      setError("First name, last name, and email are required.");
      return;
    }
    if (!selectedCompany) return;
    setSaving(true);
    setError(null);

    const { error: insertErr } = await db.from("employees").insert({
      company_id: selectedCompany.company_id,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      job_title: form.job_title || null,
      department: form.department || null,
      location_id: form.location_id || null,
    });

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    navigate("/employees");
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <Button variant="ghost" onClick={() => navigate("/employees")} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Employees
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={form.job_title} onChange={(e) => set("job_title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={form.department} onChange={(e) => set("department", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={form.location_id} onValueChange={(v) => set("location_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate("/employees")}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add Employee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
