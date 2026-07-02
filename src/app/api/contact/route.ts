import { NextResponse } from "next/server";
import { fireEvent } from "@/lib/luxe/n8n-webhook";

export const dynamic = "force-dynamic";

// POST /api/contact
// Receives contact form submissions, validates, and fires webhook to n8n
// n8n handles: admin notification email, auto-reply to customer, Slack/Discord, etc.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    // Validation
    const errors: string[] = [];
    if (!name || name.trim().length < 2) errors.push("Name is required (min 2 characters)");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
    if (!subject || subject.trim().length < 3) errors.push("Subject is required (min 3 characters)");
    if (!message || message.trim().length < 5) errors.push("Message is required (min 5 characters)");

    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    // Fire "contact_form" event to n8n
    await fireEvent("contact_form", {
      name: name!.trim(),
      email: email!.trim().toLowerCase(),
      subject: subject!.trim(),
      message: message!.trim(),
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Message sent! We'll get back to you within 24 hours.",
    });
  } catch (err) {
    console.error("[POST /api/contact] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}