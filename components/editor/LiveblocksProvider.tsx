"use client";

import { ReactNode, useState } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loader2, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  roomId: string;
  initialCode: string;
  children: ReactNode;
}

export default function LiveblocksRoomProvider({
  roomId,
  initialCode,
  children,
}: Props) {
  const [blocked, setBlocked] = useState(false);

  // Pre-check participant limit before entering the room
  const checkRoom = async () => {
    const res = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: roomId }),
    });
    if (res.status === 403) {
      const data = await res.json();
      if (data.error === "PARTICIPANT_LIMIT") {
        setBlocked(true);
      }
    }
  };

  if (blocked) {
    return (
      <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-[#fafafa] text-lg font-medium mb-2">Room full</h2>
          <p className="text-[#71717a] text-sm mb-6 leading-relaxed">
            This room already has 2 participants. Free plan allows a maximum of 2 participants.
            Upgrade to Pro for up to 5 participants.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/#pricing">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2 text-sm h-9 rounded-lg">
                <Zap className="w-3.5 h-3.5" />
                Upgrade to Pro
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] text-sm h-9 rounded-lg border border-[#27272a]">
                Back to dashboard
              </Button>
            </Link>
          </div>
          <p className="text-[#3f3f46] text-xs mt-4">₹299/month · Cancel anytime</p>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        name: "",
        color: "",
        avatar: "",
      }}
      initialStorage={{
        code: initialCode,
        output: "",
        hasError: false,
        isRunning: false,
        isVideoCallActive: false,
      }}
    >
      <ClientSideSuspense
        fallback={
          <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-7 h-7 text-indigo-400 animate-spin mx-auto mb-3" />
              <p className="text-[#52525b] text-sm">Connecting to room...</p>
            </div>
          </div>
        }
      >
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
