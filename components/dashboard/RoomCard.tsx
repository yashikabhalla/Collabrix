"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, ArrowRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  language: string;
  createdAt: string;
}

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  typescript: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  python: "bg-green-400/10 text-green-400 border-green-400/20",
  java: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  cpp: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  c: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  go: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  rust: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 group">

      {/* Icon + Language */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center">
          <Code2 className="w-5 h-5 text-violet-400" />
        </div>
        <Badge className={`${languageColors[room.language] || languageColors.javascript} border text-xs`}>
          {room.language}
        </Badge>
      </div>

      {/* Room Name */}
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-violet-300 transition-colors">
        {room.name}
      </h3>

      {/* Date */}
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
        <Calendar className="w-3 h-3" />
        {formatDate(room.createdAt)}
      </div>

      {/* Join Button */}
      <Button
        onClick={() => router.push(`/room/${room.id}`)}
        className="w-full bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 transition-all duration-300 group/btn"
      >
        Join Room
        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}