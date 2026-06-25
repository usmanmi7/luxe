// ==========================================================================
// LUXE — Newsletter email templates
// All emails include: branded LUXE header, content, unsubscribe link,
// physical mailing address (CAN-SPAM requirement)
// ==========================================================================

const LUXE_FOOTER = `
  <hr style="border:none;border-top:1px solid #e4e1d6;margin:32px 0;">
  <p style="font-size:11px;color:#2b2b28;margin:0 0 8px;">
    You're receiving this email because you subscribed to LUXE Cosmetics.
  </p>
  <p style="font-size:11px;color:#2b2b28;margin:0 0 8px;">
    <a href="{UNSUBSCRIBE_URL}" style="color:#0a0a0a;text-decoration:underline;">Unsubscribe</a>
    &nbsp;·&nbsp;
    <a href="https://luxe-ruby-delta.vercel.app/privacy" style="color:#0a0a0a;text-decoration:underline;">Privacy Policy</a>
    &nbsp;·&nbsp;
    <a href="https://luxe-ruby-delta.vercel.app" style="color:#0a0a0a;text-decoration:underline;">Visit our store</a>
  </p>
  <p style="font-size:11px;color:#2b2b28;margin:0;">
    LUXE Cosmetics<br>
    42 Galle Face Road, Colombo 03, Sri Lanka
  </p>
`;

const LUXE_HEADER = `
  <div style="font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:600;margin-bottom:24px;">
    LUXE<span style="color:#b9e30f;">.</span>
  </div>
`;

function wrapContent(content: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafaf8;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#0a0a0a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    ${LUXE_HEADER}
    ${content}
    ${LUXE_FOOTER}
  </div>
</body></html>`;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxe-ruby-delta.vercel.app";

// ----- Confirmation email (sent on signup, double opt-in) -----------------
export function renderConfirmationEmail(confirmToken: string): { subject: string; html: string } {
  const confirmUrl = `${BASE_URL}/api/newsletter/confirm?token=${confirmToken}`;
  const html = wrapContent(`
    <h1 style="font-family:'Fraunces',Georgia,serif;font-size:32px;font-weight:500;margin:0 0 16px;">Confirm your subscription</h1>
    <p style="margin:0 0 16px;color:#2b2b28;font-size:15px;">
      You're one click away from joining the LUXE insider list. Confirm your email to get:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#2b2b28;font-size:14px;line-height:1.8;">
      <li>15% off your first order (code sent after confirmation)</li>
      <li>Early access to new product launches</li>
      <li>Formula deep-dives and skincare tips</li>
      <li>Restock alerts and exclusive sales</li>
    </ul>
    <a href="${confirmUrl}" style="display:inline-block;background:#D1FE17;color:#0a0a0a;font-family:'Space Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.04em;padding:16px 28px;border-radius:100px;text-decoration:none;font-weight:700;">
      Confirm my subscription →
    </a>
    <p style="margin:24px 0 0;font-size:12px;color:#2b2b28;">
      If you didn't subscribe, you can safely ignore this email. We'll never email you again until you confirm.
    </p>
  `);
  return { subject: "Confirm your LUXE subscription ✓", html };
}

// ----- Welcome email (sent after confirmation) ----------------------------
export function renderWelcomeEmail(email: string): { subject: string; html: string } {
  const html = wrapContent(`
    <h1 style="font-family:'Fraunces',Georgia,serif;font-size:32px;font-weight:500;margin:0 0 16px;">Welcome to LUXE ✨</h1>
    <p style="margin:0 0 16px;color:#2b2b28;font-size:15px;">
      You're officially on the list. As promised, here's your 15% off code for your first order:
    </p>
    <div style="background:#f3f1ea;padding:20px;text-align:center;border-radius:8px;margin:0 0 24px;">
      <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#2b2b28;margin-bottom:8px;">YOUR CODE</div>
      <div style="font-family:'Space Mono',monospace;font-size:28px;font-weight:700;color:#0a0a0a;letter-spacing:0.1em;">WELCOME15</div>
    </div>
    <a href="${BASE_URL}/shop" style="display:inline-block;background:#0a0a0a;color:#fafaf8;font-family:'Space Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.04em;padding:16px 28px;border-radius:100px;text-decoration:none;">
      Start shopping →
    </a>
    <p style="margin:24px 0 0;font-size:13px;color:#2b2b28;">
      Thanks for joining us, ${email.split("@")[0]}. We'll only email you when we have something genuinely worth your time.
    </p>
  `);
  return { subject: "Welcome to LUXE — here's your 15% off 🎉", html };
}

// ----- New product launch email (sent to all confirmed subscribers) -------
export function renderProductLaunchEmail(product: {
  name: string;
  desc: string;
  img: string;
  price: number;
  slug: string;
  tag: string | null;
}, unsubscribeToken: string): { subject: string; html: string } {
  const productUrl = `${BASE_URL}/product/${product.slug}`;
  const unsubscribeUrl = `${BASE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const tagLabel = product.tag === "Sale" ? "ON SALE" : product.tag === "New" ? "NEW ARRIVAL" : "NEW ARRIVAL";

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafaf8;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#0a0a0a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    ${LUXE_HEADER}
    <p style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#b9e30f;background:#0a0a0a;display:inline-block;padding:5px 10px;border-radius:4px;margin:0 0 16px;">${tagLabel}</p>
    <h1 style="font-family:'Fraunces',Georgia,serif;font-size:36px;font-weight:500;margin:0 0 16px;line-height:1.1;">${product.name}</h1>
    <p style="margin:0 0 24px;color:#2b2b28;font-size:15px;line-height:1.6;">${product.desc}</p>
    <a href="${productUrl}" style="display:block;margin:0 0 24px;">
      <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:8px;display:block;">
    </a>
    <div style="display:flex;align-items:center;justify-content:space-between;margin:0 0 24px;">
      <span style="font-family:monospace;font-size:24px;font-weight:700;">$${product.price.toFixed(2)}</span>
      <a href="${productUrl}" style="display:inline-block;background:#D1FE17;color:#0a0a0a;font-family:'Space Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.04em;padding:16px 28px;border-radius:100px;text-decoration:none;font-weight:700;">
        Shop now →
      </a>
    </div>
    <hr style="border:none;border-top:1px solid #e4e1d6;margin:32px 0;">
    <p style="font-size:11px;color:#2b2b28;margin:0 0 8px;">
      You're receiving this email because you subscribed to LUXE Cosmetics.
    </p>
    <p style="font-size:11px;color:#2b2b28;margin:0 0 8px;">
      <a href="${unsubscribeUrl}" style="color:#0a0a0a;text-decoration:underline;">Unsubscribe</a>
      &nbsp;·&nbsp;
      <a href="${BASE_URL}/privacy" style="color:#0a0a0a;text-decoration:underline;">Privacy Policy</a>
    </p>
    <p style="font-size:11px;color:#2b2b28;margin:0;">
      LUXE Cosmetics<br>42 Galle Face Road, Colombo 03, Sri Lanka
    </p>
  </div>
</body></html>`;

  return { subject: `New at LUXE: ${product.name}`, html };
}
