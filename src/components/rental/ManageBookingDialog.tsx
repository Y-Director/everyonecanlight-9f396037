import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { BookingLookup } from "@/components/rental/BookingStatusCard";

const ManageBookingDialog = ({
  open,
  onOpenChange,
  onLoaded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLoaded: (booking: BookingLookup) => void;
}) => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("rental-lookup", {
        body: { bookingCode: code, email },
      });
      if (error && !data) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      onLoaded(data as BookingLookup);
      onOpenChange(false);
      toast.success("Booking found", { duration: 1800 });
    } catch {
      toast.error("We couldn't find a booking with those details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Manage your booking
          </DialogTitle>
          <DialogDescription>
            Enter the booking reference from your confirmation and the email you booked with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 pt-2">
          <div>
            <Label htmlFor="mb-code">Booking reference</Label>
            <Input
              id="mb-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. K7RQ4TZP"
              className="mt-2 font-mono tracking-[0.2em] uppercase"
              maxLength={12}
              required
            />
          </div>
          <div>
            <Label htmlFor="mb-email">Email address</Label>
            <Input
              id="mb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Find my booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageBookingDialog;
