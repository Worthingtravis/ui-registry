"use client";

import { StepFlow } from "@/registry/step-flow";
import { Workflow } from "lucide-react";

export default function StepFlowDemo() {
  return (
    <div className="space-y-8">
      <StepFlow
        icon={<Workflow className="size-4" />}
        title="Checkout Flow"
        steps={[
          { label: "Cart", description: "Review items in your shopping cart." },
          { label: "Shipping", description: "Enter your delivery address and select a shipping method." },
          { label: "Payment", description: "Add a payment method and review the total." },
          { label: "Confirm", description: "Review your order and place it." },
          { label: "Done", description: "Your order has been placed successfully!" },
        ]}
      />

      <StepFlow
        title="Onboarding"
        initialStep={2}
        steps={[
          { label: "Sign Up", description: "Create your account." },
          { label: "Profile", description: "Set up your profile." },
          { label: "Connect", description: "Link your external accounts." },
          { label: "Go", description: "You're all set!" },
        ]}
      />
    </div>
  );
}
