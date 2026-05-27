import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create order — amount is in paise (₹299 = 29900 paise)
    const order = await razorpay.orders.create({
      amount: 29900,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        plan: "pro",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Create order error FULL:", JSON.stringify(error, null, 2));
    console.error("Error message:", error?.message);
    console.error("Error description:", error?.error?.description);
    return NextResponse.json(
      { error: "Failed to create order", details: error?.message },
      { status: 500 }
    );
  }
}