import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for students",
    features: [
      "3 rooms per month",
      "2 participants per room",
      "10+ programming languages",
      "AI hints (5 per session)",
      "Code execution",
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹299",
    description: "For serious interview prep",
    features: [
      "Unlimited rooms",
      "5 participants per room",
      "10+ programming languages",
      "Unlimited AI hints",
      "Video calling",
      "Session recordings",
      "Performance analytics",
    ],
    cta: "Start Pro",
    href: "/sign-up",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? "bg-violet-600/20 border-violet-500/50"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.highlighted && (
                <span className="bg-violet-600 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                  Most Popular
                </span>
              )}
              <h3 className="text-white font-bold text-2xl mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
              <div className="text-4xl font-bold text-white mb-6">
                {plan.price}
                <span className="text-lg text-gray-400 font-normal">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}