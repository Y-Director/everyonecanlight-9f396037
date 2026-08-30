import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PRIVACY_POLICY, PRIVACY_POLICY_UPDATED } from "@/lib/privacyPolicy";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PrivacyPolicyDialog = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Privacy &amp; Data Protection Policy</DialogTitle>
        <DialogDescription>
          Everyone Can Light Technologies Ltd. — last updated {PRIVACY_POLICY_UPDATED}.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {PRIVACY_POLICY.map((s) => (
          <div key={s.title}>
            <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default PrivacyPolicyDialog;
