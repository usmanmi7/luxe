import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/luxe/email";
import { renderWelcomeEmail } from "@/lib/luxe/newsletter-emails";

export const dynamic = "force-dynamic";

// GET /api/newsletter/confirm?token=xxx
// User clicks the confirmation link in the email → confirms subscription + sends welcome
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/newsletter/confirm?status=invalid", req.url));
    }

    const subscriber = await db.subscriber.findUnique({ where: { confirmToken: token } });
    if (!subscriber) {
      return NextResponse.redirect(new URL("/newsletter/confirm?status=invalid", req.url));
    }

    if (subscriber.status === "confirmed") {
      return NextResponse.redirect(new URL("/newsletter/confirm?status=already", req.url));
    }

    if (subscriber.status === "unsubscribed") {
      return NextResponse.redirect(new URL("/newsletter/confirm?status=unsubscribed", req.url));
    }

    // Confirm the subscription
    await db.subscriber.update({
      where: { id: subscriber.id },
      data: { status: "confirmed", confirmedAt: new Date() },
    });

    // Send welcome email with discount code
    if (resend) {
      const { subject, html } = renderWelcomeEmail(subscriber.email);
      await resend.emails.send({
        from: `LUXE <${FROM_EMAIL}>`,
        to: subscriber.email,
        subject,
        html,
      });
    }

    return NextResponse.redirect(new URL("/newsletter/confirm?status=success", req.url));
  } catch (err) {
    console.error("[GET /api/newsletter/confirm] Error:", err);
    return NextResponse.redirect(new URL("/newsletter/confirm?status=error", req.url));
  }
}
