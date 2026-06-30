import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/luxe/email";
import { renderConfirmationEmail } from "@/lib/luxe/newsletter-emails";

export const dynamic = "force-dynamic";

// POST /api/newsletter/subscribe
// Public endpoint - called from footer newsletter form
// Creates a "pending" subscriber + sends confirmation email (double opt-in)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source = "footer" } = body as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      if (existing.status === "confirmed") {
        return NextResponse.json({
          message: "You're already subscribed! Check your inbox for our latest.",
          alreadySubscribed: true,
        });
      }
      if (existing.status === "unsubscribed") {
        // Re-subscribe: reset to pending + new confirm token
        await db.subscriber.update({
          where: { id: existing.id },
          data: {
            status: "pending",
            confirmToken: undefined, // Prisma will regenerate via @default
            unsubscribedAt: null,
          },
        });
        // Send new confirmation email
        if (resend) {
          const { subject, html } = renderConfirmationEmail(existing.confirmToken);
          await resend.emails.send({
            from: `LUXE <${FROM_EMAIL}>`,
            to: normalizedEmail,
            subject,
            html,
          });
        }
        return NextResponse.json({
          message: "We sent you a new confirmation email. Check your inbox (and spam folder).",
        });
      }
      // Already pending - resend confirmation
      if (resend) {
        const { subject, html } = renderConfirmationEmail(existing.confirmToken);
        await resend.emails.send({
          from: `LUXE <${FROM_EMAIL}>`,
          to: normalizedEmail,
          subject,
          html,
        });
      }
      return NextResponse.json({
        message: "We re-sent your confirmation email. Check your inbox.",
      });
    }

    // New subscriber - create as pending
    const subscriber = await db.subscriber.create({
      data: { email: normalizedEmail, status: "pending", source },
    });

    // Send confirmation email
    if (resend) {
      const { subject, html } = renderConfirmationEmail(subscriber.confirmToken);
      await resend.emails.send({
        from: `LUXE <${FROM_EMAIL}>`,
        to: normalizedEmail,
        subject,
        html,
      });
    } else {
      console.log("[newsletter] RESEND_API_KEY not set - confirmation email not sent");
      console.log("[newsletter] Confirm URL would be: /api/newsletter/confirm?token=" + subscriber.confirmToken);
    }

    return NextResponse.json({
      message: "Thanks! Check your inbox for a confirmation email to complete your subscription.",
      requiresConfirmation: true,
    });
  } catch (err) {
    console.error("[POST /api/newsletter/subscribe] Error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
