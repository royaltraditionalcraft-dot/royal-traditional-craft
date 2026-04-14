import { NextRequest } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, receipt } = body;

    if (!amount || amount < 100) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: "INR",
      receipt: receipt ?? `rcpt_${Date.now()}`,
    });

    return Response.json({ orderId: order.id, amount: order.amount });
  } catch (err: any) {
    console.error("[create-order]", err);
    return Response.json(
      { error: err.message ?? "Failed to create payment order" },
      { status: 500 }
    );
  }
}
