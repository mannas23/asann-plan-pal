import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/YOUR_LINK_HERE";

interface PaywallProps {
  onUnlocked?: boolean;
}

const Paywall = ({ onUnlocked }: PaywallProps) => {
  if (onUnlocked) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center rounded-full bg-green-500/10 p-4 mb-4">
          <Sparkles className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Unlocked!</h2>
        <p className="text-muted-foreground">You now have unlimited uploads. Enjoy!</p>
      </div>
    );
  }

  const handleUnlock = () => {
    window.open(STRIPE_PAYMENT_LINK, "_blank");
  };

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center rounded-full bg-destructive/10 p-4 mb-4">
        <Lock className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        You've reached your free limit
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        You've used all 3 free uploads. Unlock unlimited access to keep planning your assignments.
      </p>
      <Button size="lg" onClick={handleUnlock} className="text-base px-8">
        Unlock Unlimited Access ($5)
      </Button>
    </div>
  );
};

export default Paywall;
