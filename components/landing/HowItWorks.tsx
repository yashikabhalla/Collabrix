const steps = [
  {
    number: "01",
    title: "Create a Room",
    description: "Sign up and create a new coding room in seconds. Choose your programming language.",
    color: "text-violet-400",
    border: "border-violet-400/30",
  },
  {
    number: "02",
    title: "Share the Link",
    description: "Send the room link to your friend on WhatsApp. They join instantly — no signup needed.",
    color: "text-blue-400",
    border: "border-blue-400/30",
  },
  {
    number: "03",
    title: "Code Together",
    description: "See each other's cursors, type simultaneously, run code, and get AI feedback in real time.",
    color: "text-green-400",
    border: "border-green-400/30",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How it{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Get started in under 60 seconds
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className={`w-16 h-16 rounded-2xl border ${step.border} flex items-center justify-center mx-auto mb-6`}>
                <span className={`text-2xl font-bold ${step.color}`}>
                  {step.number}
                </span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}