import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor } from "lucide-react";

type PageState = "loading" | "ready" | "signing" | "success" | "expired" | "signed" | "invalid";

export default function SignForm() {
  const { companyId, signingUrlId } = useParams<{ companyId: string; signingUrlId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [pageState, setPageState] = useState<PageState>("loading");
  const [formData, setFormData] = useState<any>(null);
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (!signingUrlId || !token) { setPageState("invalid"); return; }
    const load = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-form?signing_url_id=${signingUrlId}&token=${encodeURIComponent(token)}`;
        const resp = await fetch(url, {
          headers: { "Content-Type": "application/json" },
        });
        if (resp.status === 410) { setPageState("expired"); return; }
        if (resp.status === 409) { setPageState("signed"); return; }
        if (!resp.ok) { setPageState("invalid"); return; }
        const data = await resp.json();
        setFormData(data);
        setPageState("ready");
      } catch {
        setPageState("invalid");
      }
    };
    load();
  }, [signingUrlId, token]);

  const getCanvasDataUrl = () => canvasRef.current?.toDataURL("image/png") ?? null;

  const isCanvasBlank = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return true;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return !data.some((v, i) => i % 4 === 3 && v !== 0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    drawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => { drawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async () => {
    if (!consent) { setError("You must check the consent box."); return; }
    if (sigMode === "draw" && isCanvasBlank()) { setError("Please draw your signature."); return; }
    if (sigMode === "type" && !typedName.trim()) { setError("Please type your name."); return; }
    setPageState("signing");
    setError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sign-form`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signing_url_id: signingUrlId,
          token,
          signature_type: sigMode,
          typed_name: sigMode === "type" ? typedName.trim() : null,
          signature_data_url: sigMode === "draw" ? getCanvasDataUrl() : null,
          consent_checked: true,
        }),
      });
      if (resp.status === 410) { setPageState("expired"); return; }
      if (resp.status === 409) { setPageState("signed"); return; }
      if (!resp.ok) { setError("Signing failed. Please try again."); setPageState("ready"); return; }
      setPageState("success");
    } catch {
      setError("Network error. Please try again.");
      setPageState("ready");
    }
  };

  const snap = formData?.snapshots;

  if (pageState === "loading" || pageState === "signing") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">
              {pageState === "signing" ? "Saving your signature..." : "Loading form..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState === "expired") return <StatusCard icon="⏰" title="Link Expired" message="This signing link has expired. Please contact your IT department for a new one." />;
  if (pageState === "signed") return <StatusCard icon="✅" title="Already Signed" message="This form has already been signed. No further action is needed." success />;
  if (pageState === "invalid") return <StatusCard icon="❌" title="Invalid Link" message="This signing link is invalid. Please check the URL or contact your IT department." />;

  if (pageState === "success") return (
    <StatusCard icon="✅" title="Signature Submitted" message="Your signature has been recorded successfully. You may close this page." success />
  );

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Monitor className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold text-foreground">AssetTrack</p>
          <h1 className="text-2xl font-bold text-foreground">
            Asset {formData?.type} Form
          </h1>
        </div>

        {/* Employee + Asset Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Employee</CardTitle></CardHeader>
          <CardContent>
            <p className="font-medium">{snap?.employee?.first_name} {snap?.employee?.last_name}</p>
            <p className="text-sm text-muted-foreground">{snap?.employee?.email}</p>
            {snap?.employee?.job_title && <p className="text-sm text-muted-foreground">{snap.employee.job_title}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Asset</CardTitle></CardHeader>
          <CardContent>
            <p className="font-medium">{snap?.asset?.asset_tag}</p>
            <p className="text-sm text-muted-foreground">{snap?.asset?.make} {snap?.asset?.model} · {snap?.asset?.category}</p>
            {snap?.asset?.serial_number && <p className="text-sm text-muted-foreground">Serial: {snap.asset.serial_number}</p>}
            {snap?.asset?.imei1 && <p className="text-sm text-muted-foreground">IMEI: {snap.asset.imei1}</p>}
            {snap?.asset?.phone_number && <p className="text-sm text-muted-foreground">Phone: {snap.asset.phone_number}</p>}
          </CardContent>
        </Card>

        {/* Policy Block */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Asset Issuance Policy</CardTitle>
              <span className="text-xs text-muted-foreground">
                v{snap?.policy?.policy_version}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto rounded border bg-muted/50 p-3 text-sm whitespace-pre-wrap">
              {snap?.policy?.policy_text}
            </div>
          </CardContent>
        </Card>

        {/* Signature */}
        <Card>
          <CardHeader><CardTitle className="text-base">Your Signature</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={sigMode === "draw" ? "default" : "outline"}
                size="sm"
                onClick={() => setSigMode("draw")}
              >Draw</Button>
              <Button
                variant={sigMode === "type" ? "default" : "outline"}
                size="sm"
                onClick={() => setSigMode("type")}
              >Type Name</Button>
            </div>

            {sigMode === "draw" ? (
              <div className="space-y-2">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  className="w-full rounded border bg-white cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                <Button variant="ghost" size="sm" onClick={clearCanvas}>
                  Clear
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Type your full name</Label>
                <Input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Your full legal name"
                  className="text-lg font-signature"
                />
              </div>
            )}

            <div className="flex items-start gap-2">
              <Checkbox
                checked={consent}
                onCheckedChange={(v) => setConsent(v === true)}
              />
              <Label className="text-sm leading-snug">
                I have read and agree to the Asset Issuance Policy above. I confirm this is my signature.
              </Label>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <Button className="w-full" size="lg" onClick={handleSubmit}>
          Submit Signature
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          This form expires {formData?.expires_at ? new Date(formData.expires_at).toLocaleDateString() : "soon"}.
          Do not share this link.
        </p>
      </div>
    </div>
  );
}

function StatusCard({ icon, title, message, success = false }: { icon: string; title: string; message: string; success?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-4xl">{icon}</p>
          <h2 className="mt-4 text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
