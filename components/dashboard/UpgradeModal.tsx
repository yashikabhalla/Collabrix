"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, X } from "lucide-react";

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

export default function UpgradeModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Upgrade to Pro
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Limit Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-2">
          <p className="text-red-400 text-sm font-medium">
            🚫 You've reached the Free plan limit
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Free plan allows 3 rooms per month. Upgrade to create unlimited rooms.
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
            onClick={() => {
              // Razorpay will go here on Day 7
              alert("Payment coming soon! We are setting up Razorpay.");
              onClose();
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade Now — ₹299/month
          </Button>
        </div>

        {/* Continue Free */}
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