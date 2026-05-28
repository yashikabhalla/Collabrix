import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { roomId } = await req.json();

    // Use Jitsi Meet — completely free, no API key needed
    const meetingUrl = `https://meet.jit.si/Collabrix-${roomId}`;

    return NextResponse.json({ url: meetingUrl });
  } catch (error) {
    console.error("Video room error:", error);
    return NextResponse.json(
      { error: "Failed to create video room" },
      { status: 500 }
    );
  }
}