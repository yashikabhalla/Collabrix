import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD",
  "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1",
  "#4DB6AC", "#81C784", "#AED581", "#FFD54F",
  "#FFB74D", "#FF8A65",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { room } = body;

    const { userId } = await auth();
    const user = await currentUser();

    // Allow unauthenticated guests into the demo room
    const isDemo = room === "demo-room-collabrix";
    if (!userId || !user) {
      if (!isDemo) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const guestId = `guest-${Math.random().toString(36).slice(2)}`;
    const sessionId = userId || guestId;
    const userName = userId
      ? `${user!.firstName || ""} ${user!.lastName || ""}`.trim() || "Anonymous"
      : "Guest User";
    const userAvatar = userId
      ? user!.imageUrl || ""
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestId}`;
    const userColor = getRandomColor();

    const session = liveblocks.prepareSession(sessionId, {
      userInfo: {
        name: userName,
        avatar: userAvatar,
        color: userColor,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body: responseBody, status } = await session.authorize();
    return new Response(responseBody, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}