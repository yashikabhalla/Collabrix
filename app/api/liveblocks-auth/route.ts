import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
 
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
    const { userId } = await auth();
    const user = await currentUser();
 
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const body = await req.json();
    const { room } = body;
 
    // Get user plan from DB
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });
 
    // Check participant limit for free plan
    if (dbUser?.plan === "free") {
      // Get current active users in this room from Liveblocks
      const roomData = await liveblocks.getRoom(room).catch(() => null);
 
      if (roomData) {
        const activeUsers = await liveblocks.getActiveUsers(room).catch(() => ({ data: [] }));
        const currentCount = activeUsers.data.length;
 
        // Check if this user is already in the room (rejoining)
        const alreadyInRoom = activeUsers.data.some(
          (u: { id: string | null }) => u.id === userId
        );
 
        // Only block if it's a NEW participant and limit is reached
        if (!alreadyInRoom && currentCount >= 2) {
          return NextResponse.json(
            {
              error: "PARTICIPANT_LIMIT",
              message: "Free plan allows only 2 participants per room. Upgrade to Pro for up to 5 participants.",
            },
            { status: 403 }
          );
        }
      }
    }
 
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous";
    const userColor = getRandomColor();
    const userAvatar = user.imageUrl || "";
 
    const session = liveblocks.prepareSession(userId, {
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}