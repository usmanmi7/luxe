import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM_EMAIL = fromEmail;

type OrderEmailData = {
  orderNumber: string;
  email: string;
  customerName: string;
  total: number;
  items: Array<{ name: string; qty: number; price: number; variant?: string | null }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postal: string;
    country: string;
    phone?: string | null;
  };
  paymentMethod: string;
  status: string;
};

export function renderOrderEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e4e1d6;">${i.name}${i.variant ? ` · ${i.variant}` : ""}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e4e1d6;text-align:center;">${i.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e4e1d6;text-align:right;font-family:monospace;">$${(i.price * i.qty).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafaf8;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#0a0a0a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:600;margin-bottom:24px;">
      LUXE<span style="color:#b9e30f;">.</span>
    </div>
    <h1 style="font-family:'Fraunces',Georgia,serif;font-size:32px;font-weight:500;margin:0 0 16px;">Order confirmed</h1>
    <p style="margin:0 0 24px;color:#2b2b28;font-size:15px;">
      Hi ${data.customerName}, thanks for your order. We've received it and will start processing right away.
    </p>

    <div style="background:#f3f1ea;padding:20px;border-radius:8px;margin-bottom:24px;">
      <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#2b2b28;margin-bottom:6px;">ORDER NUMBER</div>
      <div style="font-family:monospace;font-weight:bold;font-size:16px;">${data.orderNumber}</div>
      <div style="margin-top:12px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#2b2b28;">STATUS</div>
      <div style="font-size:14px;margin-top:2px;">${data.status.replace(/_/g, " ")}</div>
    </div>

    <h2 style="font-family:'Fraunces',Georgia,serif;font-size:20px;font-weight:500;margin:0 0 12px;">Items</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
      <thead>
        <tr style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#2b2b28;">
          <th style="text-align:left;padding:8px 0;border-bottom:2px solid #0a0a0a;">Item</th>
          <th style="text-align:center;padding:8px 0;border-bottom:2px solid #0a0a0a;">Qty</th>
          <th style="text-align:right;padding:8px 0;border-bottom:2px solid #0a0a0a;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
        <tr>
          <td colspan="2" style="padding-top:16px;font-weight:bold;text-align:right;">Total</td>
          <td style="padding-top:16px;font-family:monospace;font-weight:bold;text-align:right;font-size:18px;">$${data.total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <h2 style="font-family:'Fraunces',Georgia,serif;font-size:20px;font-weight:500;margin:0 0 12px;">Shipping to</h2>
    <p style="font-size:14px;line-height:1.6;color:#2b2b28;margin:0 0 24px;">
      ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
      ${data.shippingAddress.address}<br>
      ${data.shippingAddress.city}, ${data.shippingAddress.postal}<br>
      ${data.shippingAddress.country}
      ${data.shippingAddress.phone ? `<br>Phone: ${data.shippingAddress.phone}` : ""}
    </p>

    ${
      data.paymentMethod === "bank"
        ? `<div style="background:#fff8e1;padding:16px;border-radius:8px;margin-bottom:24px;">
            <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#2b2b28;margin-bottom:6px;">BANK TRANSFER INSTRUCTIONS</div>
            <p style="margin:0;font-size:13px;line-height:1.6;">
              Please transfer <strong>$${data.total.toFixed(2)}</strong> to:<br>
              Bank: Commercial Bank of Ceylon<br>
              Account Name: LUXE Cosmetics<br>
              Account Number: 8000-123456-001<br>
              Branch: Colombo 03<br><br>
              Email the transfer receipt to orders@luxe.local with <strong>${data.orderNumber}</strong> in the subject. Your order will be held for 3 days.
            </p>
          </div>`
        : ""
    }

    ${
      data.paymentMethod === "cod"
        ? `<div style="background:#e3f2fd;padding:16px;border-radius:8px;margin-bottom:24px;">
            <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#2b2b28;margin-bottom:6px;">CASH ON DELIVERY</div>
            <p style="margin:0;font-size:13px;line-height:1.6;">
              Please have <strong>$${data.total.toFixed(2)}</strong> ready in cash. Our delivery partner will call you to confirm the delivery time. Delivery typically takes 2-4 business days.
            </p>
          </div>`
        : ""
    }

    <hr style="border:none;border-top:1px solid #e4e1d6;margin:32px 0;">
    <p style="font-size:12px;color:#2b2b28;margin:0;">
      Questions? Reply to this email or contact us at hello@luxe.local.<br>
      © ${new Date().getFullYear()} LUXE Cosmetics. All rights reserved.
    </p>
  </div>
</body></html>`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set, skipping order confirmation email");
    return;
  }
  try {
    const html = renderOrderEmailHTML(data);
    const { error } = await resend.emails.send({
      from: `LUXE <${FROM_EMAIL}>`,
      to: data.email,
      subject: `Order confirmed - ${data.orderNumber}`,
      html,
    });
    if (error) {
      console.error("[email] Resend error:", error);
    } else {
      console.log(`[email] Order confirmation sent to ${data.email} for ${data.orderNumber}`);
    }
  } catch (err) {
    console.error("[email] Failed to send order email:", err);
    // Don't fail the order if email fails
  }
}
