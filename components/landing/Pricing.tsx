"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import UpgradeModal from "@/components/dashboard/UpgradeModal";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for students getting started",
    features: [
      { text: "3 rooms per month", included: true },
      { text: "2 participants per room", included: true },
      { text: "8 programming languages", included: true },
      { text: "Code execution", included: true },
      { text: "AI Interviewer", included: true },
      { text: "Video calling", included: false },
      { text: "Session recordings", included: false },
    ],
    cta: "Get started free",
    href: "/sign-up",
    highlighted: false,
    planKey: "free",
  },
  {
    name: "Pro",
    price: "₹299",
    description: "For serious interview preparation",
    features: [
      { text: "Unlimited rooms", included: true },
      { text: "5 participants per room", included: true },
      { text: "10+ programming languages", included: true },
      { text: "Code execution", included: true },
      { text: "AI Interviewer", included: true },
      { text: "Video calling", included: true },
      { text: "Session recordings", included: true },
    ],
    cta: "Start Pro",
    href: "/sign-up",
    highlighted: true,
    planKey: "pro",
  },
];

interface Props {
  userPlan?: string;
}

export default function Pricing({ userPlan }: Props) {
  const { isSignedIn } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4 bg-[#0e0e10]">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs text-[#52525b] uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#fafafa] tracking-tight mb-3">
            Simple, honest pricing
          </h2>
          <p className="text-[#71717a] text-base">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isCurrentPlan = isSignedIn && userPlan === plan.planKey;
            const isProAndUserIsFree = plan.planKey === "pro" && isSignedIn && userPlan === "free";
            const isProAndUserIsPro = plan.planKey === "pro" && isSignedIn && userPlan === "pro";
            const isFreeAndUserIsPro = plan.planKey === "free" && isSignedIn && userPlan === "pro";

            return (
              <div
                key={plan.name}
                className={`rounded-xl p-7 border relative flex flex-col transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-[#18181b] border-indigo-500/50"
                    : "bg-[#18181b] border-[#27272a]"
                } ${isCurrentPlan ? "ring-1 ring-indigo-500" : ""}`}
              >
                {/* Most popular badge */}
                {plan.highlighted && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most popular
                    </span>
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#052e16] text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full">
                      Your current plan
                    </span>
                  </div>
                )}

                {/* Plan name & price */}
                <div className="mb-6">
                  <h3 className="text-[#fafafa] font-medium text-lg mb-1">{plan.name}</h3>
                  <p className="text-[#52525b] text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium text-[#fafafa]">{plan.price}</span>
                    <span className="text-[#52525b] text-sm">/month</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#27272a] mb-6" />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? "text-[#a1a1aa]" : "text-[#3f3f46]"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-[#3f3f46] flex-shrink-0" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {!isSignedIn && (
                  <Link href={plan.href}>
                    <Button
                      className={`w-full h-10 text-sm rounded-lg transition-all duration-150 ${
                        plan.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                          : "bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa]"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}

                {isProAndUserIsPro && (
                  <Button disabled className="w-full h-10 text-sm rounded-lg bg-[#052e16] text-green-400 border border-green-500/30 cursor-default">
                    Active plan
                  </Button>
                )}

                {isFreeAndUserIsPro && (
                  <Link href="/dashboard">
                    <Button className="w-full h-10 text-sm rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa]">
                      Go to dashboard
                    </Button>
                  </Link>
                )}

                {isProAndUserIsFree && (
                  <Button
                    onClick={() => setShowUpgrade(true)}
                    className="w-full h-10 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-150"
                  >
                    Upgrade to Pro
                  </Button>
                )}

                {isSignedIn && userPlan === "free" && plan.planKey === "free" && (
                  <Link href="/dashboard">
                    <Button className="w-full h-10 text-sm rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa]">
                      Go to dashboard
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}