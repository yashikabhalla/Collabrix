"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const proFeatures = [
  "Unlimited rooms",
  "5 participants per room",
  "12+ programming languages",
  "Unlimited AI hints",
  "Video calling",
  "Session recordings",
  "Performance analytics",
  "Priority support",
];

// This loads Razorpay script into browser
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function UpgradeModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1 — Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment. Check your internet connection.");
        setLoading(false);
        return;
      }

      // Step 2 — Create order on our server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
      });
      const orderData = await orderRes.json();

      if (!orderData.orderId) {
        alert("Could not create payment order. Please try again.");
        setLoading(false);
        return;
      }

      // Step 3 — Open Razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Collabrix",
        description: "Pro Plan — Monthly Subscription",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Step 4 — Verify payment on our server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            onClose();
            // Refresh page to show Pro plan
            router.refresh();
            alert("🎉 Welcome to Pro! You now have unlimited rooms.");
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        {/* Limit Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-2">
          <p className="text-red-400 text-sm font-medium">
            🚫 You have reached the Free plan limit
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Free plan allows 3 rooms. Upgrade to create unlimited rooms.
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-6 mt-2">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-bold text-white">₹299</span>
            <span className="text-gray-400">/month</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Everything you need for placement prep
          </p>

          <ul className="space-y-2 mb-6">
            {proFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-gray-300 text-sm"
              >
                <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-5"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading payment...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Now — ₹299/month
              </>
            )}
          </Button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-gray-500 hover:text-gray-400 text-sm transition-colors py-1"
        >
          Continue with Free plan
        </button>
      </DialogContent>
    </Dialog>
  );
}