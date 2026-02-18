import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  asset: { id: string; asset_tag: string; company_id: string };
  assignmentId: string;
  employeeEmail: string;
  onSuccess: () => void;
}

export default function SendFormModal({ open, onClose, asset, assignmentId, employeeEmail, onSuccess }: Props) {
  const [type, setType] = useState<"issuance" | "return">("issuance");
  const [expiryHours, setExpiryHours] = useState("72");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error: fnError } = await supabase.functions.invoke("send-form", {
        body: {
          assignment_id: assignmentId,
          type,
          expires_hours: parseInt(expiryHours),
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (fnError) {
        setError("Failed to send form. Please try again.");
        setSending(false);
        return;
      }
      setSent(true);
      setSending(false);
    } catch (err: any) {
      setError(err.message ?? "Failed to send form.");
      setSending(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setError(null);
    onClose();
    if (sent) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Signature Form — {asset.asset_tag}</DialogTitle>
        </DialogHeader>
        {sent ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-3xl">✅</p>
            <p className="font-semibold text-foreground">Form sent successfully</p>
            <p className="text-sm text-muted-foreground">
              An email with a signing link has been sent to {employeeEmail}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">Sending to: <span className="font-medium text-foreground">{employeeEmail}</span></p>
            </div>
            <div className="space-y-1">
              <Label>Form Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "issuance" | "return")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issuance">Issuance — Employee confirms receipt</SelectItem>
                  <SelectItem value="return">Return — Employee confirms return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Link Expires After</Label>
              <Select value={expiryHours} onValueChange={setExpiryHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours (default)</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter>
          {sent ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={sending}>Cancel</Button>
              <Button onClick={handleSend} disabled={sending}>
                {sending ? "Sending..." : "Send Form"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
