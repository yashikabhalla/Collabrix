"use client";

import { Button } from "@/components/ui/button";
import { Code2, ArrowRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  language: string;
  createdAt: string;
}

const languageAccents: Record<string, { color: string; bg: string }> = {
  javascript: { color: "#f59e0b", bg: "#451a03" },
  typescript: { color: "#06b6d4", bg: "#0c4a6e" },
  python:     { color: "#22c55e", bg: "#052e16" },
  java:       { color: "#fb923c", bg: "#431407" },
  cpp:        { color: "#6366f1", bg: "#1e1b4b" },
  c:          { color: "#a1a1aa", bg: "#27272a" },
  go:         { color: "#22d3ee", bg: "#0c4a6e" },
  rust:       { color: "#f87171", bg: "#450a0a" },
};

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const accent = languageAccents[room.language] || languageAccents.javascript;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 hover:border-[#3f3f46] transition-all duration-200 group flex flex-col gap-4">

      {/* Top row — icon + language badge */}
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: accent.bg }}
        >
          <Code2 className="w-4 h-4" style={{ color: accent.color }} />
        </div>
        <span
          className="text-xs px-2.5 py-0.5 rounded-full border font-medium"
          style={{
            color: accent.color,
            background: accent.bg,
            borderColor: accent.color + "33",
          }}
        >
          {room.language}
        </span>
      </div>

      {/* Room name */}
      <div>
        <h3 className="text-[#fafafa] font-medium text-[15px] mb-1 group-hover:text-indigo-300 transition-colors duration-150">
          {room.name}
        </h3>
        <div className="flex items-center gap-1.5 text-[#52525b] text-xs">
          <Calendar className="w-3 h-3" />
          {formatDate(room.createdAt)}
        </div>
      </div>

      {/* Join button */}
      <Button
        onClick={() => router.push(`/room/${room.id}`)}
        className="w-full h-9 text-sm rounded-lg bg-[#27272a] hover:bg-indigo-600 text-[#a1a1aa] hover:text-white border border-[#3f3f46] hover:border-indigo-500 transition-all duration-200 gap-2 group/btn mt-auto"
      >
        Join room
        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-150" />
      </Button>

    </div>
  );
}
