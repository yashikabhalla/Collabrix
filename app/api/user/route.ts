import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        avatar: user.imageUrl,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}