import { Code2, Users, Zap, Video, Bot, Shield } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Monaco Editor",
    description: "The same editor that powers VS Code. Full syntax highlighting, autocomplete, and more.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: Users,
    title: "Live Collaboration",
    description: "See live cursors, colored presence indicators, and real-time code sync with zero lag.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Zap,
    title: "Instant Code Execution",
    description: "Run code in 10+ languages directly in the browser. See output instantly.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Video,
    title: "Video Calling",
    description: "Face-to-face mock interviews with built-in video calling inside every room.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Bot,
    title: "AI Interviewer",
    description: "Gemini AI generates problems, gives hints, and scores your solution automatically.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Every room is private. Only people with the link can join your session.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              ace your interviews
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built for students preparing for product company placements.
            Every feature designed to make mock interviews feel real.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-violet-500/30"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}