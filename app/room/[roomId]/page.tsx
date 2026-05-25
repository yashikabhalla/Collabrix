"use client";

import { useParams } from "next/navigation";
import { Code2 } from "lucide-react";
import Link from "next/link";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md h-16 flex items-center px-4 justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">CodeSync</span>
        </Link>
        <div className="text-gray-400 text-sm">
          Room: {roomId}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Room Ready! 🚀
          </h2>
          <p className="text-gray-400">
            Code editor coming on Day 3!
          </p>
        </div>
      </div>
    </div>
  );
}