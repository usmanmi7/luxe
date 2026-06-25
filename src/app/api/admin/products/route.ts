import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { resend, FROM_EMAIL } from "@/lib/luxe/email";
import { renderProductLaunchEmail } from "@/lib/luxe/newsletter-emails";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, slug, category, price, originalPrice, img, gallery, desc, longDesc, ingredients, tag, shades, sizes, stock, active, notifySubscribers } = body;

    if (!name || !img || !desc || typeof price !== "number" || price <= 0) {
      return NextResponse.json({ error: "Missing required fields: name, img, desc, price" }, { status: 400 });
    }

    let finalSlug = slug;
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) finalSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

    const product = await db.product.create({
      data: {
        name, slug: finalSlug, category: category || "Skincare", price,
        originalPrice: originalPrice || null, img,
        gallery: Array.isArray(gallery) ? gallery : [img],
        desc, longDesc: longDesc || desc, ingredients: ingredients || "",
        tag: tag || null, shades: Array.isArray(shades) ? shades : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        stock: typeof stock === "number" ? stock : 0,
        active: active !== false,
      },
    });

    // Fire-and-forget: notify subscribers if checkbox was checked
    if (notifySubscribers) {
      notifySubscribersAboutNewProduct(product).catch((err) =>
        console.error("[newsletter] Background send failed:", err)
      );
    }

    return NextResponse.json({ product, notifiedSubscribers: Boolean(notifySubscribers) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to create product" }, { status: 500 });
  }
}

// Send a "new product launched" email to every confirmed subscriber
// Uses Resend batch API (up to 100 per call) to avoid rate limits
async function notifySubscribersAboutNewProduct(product: {
  name: string; desc: string; img: string; price: number; slug: string; tag: string | null;
}) {
  if (!resend) {
    console.log("[newsletter] RESEND_API_KEY not set — skipping product launch email");
    return { sent: 0, skipped: true };
  }

  const subscribers = await db.subscriber.findMany({
    where: { status: "confirmed" },
    select: { email: true, unsubscribeToken: true },
  });

  if (subscribers.length === 0) {
    console.log("[newsletter] No confirmed subscribers — skipping product launch email");
    return { sent: 0, reason: "no_subscribers" };
  }

  console.log(`[newsletter] Sending product launch email to ${subscribers.length} subscribers...`);

  // Resend batch API: max 100 emails per call
  const BATCH_SIZE = 100;
  let totalSent = 0;
  let totalFailed = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const { subject, html } = renderProductLaunchEmail(
      {
        name: product.name, desc: product.desc, img: product.img,
        price: product.price, slug: product.slug, tag: product.tag,
      },
      batch[0].unsubscribeToken // token for the first recipient in batch (each batch needs at least one)
    );

    try {
      // Send individually so each email has the correct unsubscribe token
      // (Resend batch doesn't support per-recipient dynamic content natively)
      const sendPromises = batch.map((sub) => {
        const { html: personalizedHtml } = renderProductLaunchEmail(
          {
            name: product.name, desc: product.desc, img: product.img,
            price: product.price, slug: product.slug, tag: product.tag,
          },
          sub.unsubscribeToken
        );
        return resend.emails.send({
          from: `LUXE <${FROM_EMAIL}>`,
          to: sub.email,
          subject,
          html: personalizedHtml,
        });
      });

      const results = await Promise.allSettled(sendPromises);
      for (const result of results) {
        if (result.status === "fulfilled" && !result.value.error) {
          totalSent++;
        } else {
          totalFailed++;
          const err = result.status === "rejected" ? result.reason : result.value?.error;
          console.error("[newsletter] Send failed for one recipient:", err);
        }
      }
    } catch (err) {
      console.error(`[newsletter] Batch ${i / BATCH_SIZE + 1} failed:`, err);
      totalFailed += batch.length;
    }

    // Small delay between batches to be nice to the API
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`[newsletter] Product launch email complete: ${totalSent} sent, ${totalFailed} failed`);
  return { sent: totalSent, failed: totalFailed };
}
