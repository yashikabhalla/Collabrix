import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all rooms for current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user in database
    let user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ rooms: [] });
    }

    const rooms = await db.room.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("GET /api/rooms error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST - Create a new room
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, language } = await req.json();

    if (!name || !language) {
      return NextResponse.json(
        { error: "Name and language are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check plan limits
    if (user.plan === "free") {
      const roomCount = await db.room.count({
        where: { createdBy: userId },
      });

      if (roomCount >= 3) {
        return NextResponse.json(
          { error: "LIMIT_REACHED" },
          { status: 403 }
        );
      }
    }

    const room = await db.room.create({
      data: {
        name,
        language,
        createdBy: userId,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("POST /api/rooms error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}