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

  const authEndpoint = async (room: string) => {
    const res = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room }),
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.error === "PARTICIPANT_LIMIT") {
        setBlocked(true);
        throw new Error("PARTICIPANT_LIMIT");
      }
    }

    return res.json();
  };

  // Show blocked UI if participant limit reached
  if (blocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Room Full</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            This room already has 2 participants. Free plan allows a maximum of 2 participants per room.
            Upgrade to Pro for up to 5 participants.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/#pricing">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2">
                <Zap className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">₹299/month · Cancel anytime</p>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider
      id={roomId}
      authEndpoint={authEndpoint}
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
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Connecting to room...</p>
            </div>
          </div>
        }
      >
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}