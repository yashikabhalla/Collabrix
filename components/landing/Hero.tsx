"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-blue-900/20" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">

        {/* Badge */}
        <Badge className="mb-6 bg-violet-600/20 text-violet-400 border-violet-600/30 px-4 py-1">
          ✨ Real-time collaboration powered by Liveblocks
        </Badge>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Code Together,{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Interview Together
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The real-time collaborative code editor built for mock interviews.
          Code with friends, get AI feedback, ace your placements.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/sign-up">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-xl">
              Start Coding Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { icon: Users, label: "Active Users", value: "500+" },
            { icon: Code2, label: "Languages", value: "10+" },
            { icon: Zap, label: "Sync Latency", value: "<50ms" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}