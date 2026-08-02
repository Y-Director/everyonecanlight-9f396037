import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RENTAL_TERMS, TERMS_PDF_URL } from "@/lib/rentalTerms";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, shows an accept action that reports acceptance back. */
  onAccept?: () => void;
  accepted?: boolean;
};

const RentalTermsDialog = ({ open, onOpenChange, onAccept, accepted }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Rental Terms &amp; Conditions</DialogTitle>
        <DialogDescription>
          Everyone Can Light Technologies Ltd. — please read before you pay.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {RENTAL_TERMS.map((s) => (
          <div key={s.title}>
            <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">Signed:</p>
          <p className="text-sm text-muted-foreground">
            Management of Rentals, Everyone Can Light Technologies Ltd.
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={TERMS_PDF_URL}
          download="ECL-Rental-Terms-and-Conditions.pdf"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline decoration-primary underline-offset-4"
        >
          <Download className="h-4 w-4" /> Download PDF
        </a>
        {onAccept && (
          <Button
            onClick={() => {
              onAccept();
              onOpenChange(false);
            }}
          >
            {accepted ? "Terms accepted" : "I accept the terms"}
          </Button>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default RentalTermsDialog;