import { Code2, Users, Zap, Video, Bot, Shield } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Monaco editor",
    description: "The same editor that powers VS Code. Full syntax highlighting, autocomplete, and multiple languages.",
    accent: "#6366f1",
    bg: "#1e1b4b",
  },
  {
    icon: Users,
    title: "Live collaboration",
    description: "See live cursors, colored presence indicators, and real-time code sync with zero lag.",
    accent: "#06b6d4",
    bg: "#0c4a6e",
  },
  {
    icon: Zap,
    title: "Instant execution",
    description: "Run code in 10+ languages directly in the browser. See output instantly without any setup.",
    accent: "#f59e0b",
    bg: "#451a03",
  },
  {
    icon: Video,
    title: "Video calling",
    description: "Face-to-face mock interviews with built-in video calling inside every room.",
    accent: "#22c55e",
    bg: "#052e16",
  },
  {
    icon: Bot,
    title: "AI interviewer",
    description: "An AI that asks DSA problems, gives hints, and evaluates your approach in real time.",
    accent: "#e879f9",
    bg: "#2e1065",
  },
  {
    icon: Shield,
    title: "Secure & private",
    description: "Every room is private. Only people with the link can join your session.",
    accent: "#fb923c",
    bg: "#431407",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-[#0e0e10]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs text-[#52525b] uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#fafafa] mb-4 tracking-tight">
            Everything you need to ace your interviews
          </h2>
          <p className="text-[#71717a] text-base max-w-xl mx-auto leading-relaxed">
            Built for students preparing for product company placements.
            Every feature designed to make mock interviews feel real.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-[#18181b] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: feature.bg }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
              </div>
              <h3 className="text-[#fafafa] font-medium text-[15px] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#71717a] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}