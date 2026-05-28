const steps = [
  {
    number: "01",
    title: "Create a room",
    description: "Sign up and create a new coding room in seconds. Choose your programming language and you're ready.",
    accent: "#6366f1",
    bg: "#1e1b4b",
  },
  {
    number: "02",
    title: "Share the link",
    description: "Send the room link to your friend. They join instantly — no signup needed on their end.",
    accent: "#06b6d4",
    bg: "#0c4a6e",
  },
  {
    number: "03",
    title: "Code together",
    description: "See each other's cursors, type simultaneously, run code, and get AI feedback in real time.",
    accent: "#22c55e",
    bg: "#052e16",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs text-[#52525b] uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#fafafa] tracking-tight mb-3">
            Up and running in 60 seconds
          </h2>
          <p className="text-[#71717a] text-base">
            No installs, no config — just open and code.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px bg-[#27272a]" />

          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">

              {/* Number badge */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative z-10 border border-[#27272a]"
                style={{ background: step.bg }}
              >
                <span
                  className="text-lg font-medium"
                  style={{ color: step.accent }}
                >
                  {step.number}
                </span>
              </div>

              <h3 className="text-[#fafafa] font-medium text-[15px] mb-2">
                {step.title}
              </h3>
              <p className="text-[#71717a] text-sm leading-relaxed max-w-[220px]">
                {step.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
