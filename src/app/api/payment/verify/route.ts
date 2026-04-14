import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    // ── 1. Verify HMAC signature ─────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // ── 2. Create order in DB ────────────────────────────────────────
    const { items, address, totalAmount, shippingAmount } = orderData;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PROCESSING",
        totalAmount,
        shippingAmount: shippingAmount ?? 0,
        shippingAddress: address,
        paymentStatus: "PAID",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
          })),
        },
      },
      include: { items: true },
    });

    // ── 3. Update stock ──────────────────────────────────────────────
    await Promise.all(
      items.map((item: any) =>
        prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    // ── 4. Send confirmation email via Resend ────────────────────────
    try {
      await resend.emails.send({
        from: "Royaltraditionalcraft <orders@royaltraditionalcraft.in>",
        to: session.user.email!,
        subject: `Order Confirmed — #${order.id.slice(-10).toUpperCase()}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a0f0f;">
            <div style="background: #7B1E2E; padding: 32px; text-align: center;">
              <h1 style="color: #C9A84C; margin: 0; font-size: 28px;">Royaltraditionalcraft</h1>
              <p style="color: #FDF6EC; margin: 8px 0 0;">Order Confirmed 🎉</p>
            </div>
            <div style="padding: 32px; background: #FDF6EC;">
              <p>Dear ${session.user.name ?? "Valued Customer"},</p>
              <p>Thank you for your order! We're processing it now.</p>
              <p><strong>Order ID:</strong> #${order.id.slice(-10).toUpperCase()}</p>
              <p><strong>Total:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>
              <p><strong>Delivery To:</strong> ${address.name}, ${address.street}, ${address.city}, ${address.state} – ${address.pincode}</p>
              <hr style="border: 1px solid #e0d5c5; margin: 24px 0;"/>
              <p>For any queries, contact us at <a href="mailto:hello@royaltraditionalcraft.in" style="color: #7B1E2E;">hello@royaltraditionalcraft.in</a> or WhatsApp: +91 98765 43210</p>
              <p style="color: #8a7a6a; font-size: 13px;">— The Royaltraditionalcraft Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[verify] email send failed:", emailErr);
      // Don't fail the order if email fails
    }

    return Response.json({ success: true, orderId: order.id });
  } catch (err: any) {
    console.error("[verify]", err);
    return Response.json(
      { error: err.message ?? "Order creation failed" },
      { status: 500 }
    );
  }
}
