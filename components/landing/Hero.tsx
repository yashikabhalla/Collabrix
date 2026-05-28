"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[#0e0e10] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Indigo glow — top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyan glow — bottom right */}
      <div className="absolute bottom-20 right-0 w-[400px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">

        {/* Announcement badge */}
        <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          <span className="text-[#71717a] text-xs tracking-wide">Real-time collaboration powered by Liveblocks</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-[68px] font-medium text-[#fafafa] mb-6 leading-[1.1] tracking-tight">
          Code together,{" "}
          <br />
          <span className="text-indigo-400">get hired faster</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-[#71717a] mb-10 max-w-xl mx-auto leading-relaxed">
          The real-time collaborative editor built for mock interviews.
          Practice DSA with friends, get AI feedback, ace your placements.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
          <Link href="/sign-up">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 h-11 text-sm rounded-lg transition-all duration-150 gap-2">
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button className="bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] px-6 h-11 text-sm rounded-lg transition-all duration-150">
              Launch demo
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost" className="text-[#71717a] hover:text-white hover:bg-[#18181b] px-6 h-11 text-sm rounded-lg transition-all duration-150">
              See how it works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12">
          {[
            { icon: Users, label: "Active users", value: "500+" },
            { icon: Code2, label: "Languages", value: "10+" },
            { icon: Zap, label: "Sync latency", value: "<50ms" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="w-4 h-4 text-indigo-400 mb-1" />
              <div className="text-xl font-medium text-[#fafafa]">{stat.value}</div>
              <div className="text-xs text-[#52525b]">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
