// ==========================================================================
// LUXE — n8n Webhook Integration
// Centralized module for firing events to n8n Cloud webhooks.
//
// ENV VARS (set in Vercel):
//   N8N_WEBHOOK_NEW_ORDER    = https://your-n8n.app/webhook/new-order
//   N8N_WEBHOOK_STATUS_CHANGE = https://your-n8n.app/webhook/status-change
//   N8N_WEBHOOK_CONTACT      = https://your-n8n.app/webhook/contact
//   N8N_WEBHOOK_LOW_STOCK    = https://your-n8n.app/webhook/low-stock
//   N8N_WEBHOOK_SECRET       = (optional) shared secret for auth
// ==========================================================================

type EventName =
  | "new_order"
  | "status_change"
  | "contact_form"
  | "low_stock";

const WEBHOOK_URLS: Record<EventName, string | undefined> = {
  new_order: process.env.N8N_WEBHOOK_NEW_ORDER,
  status_change: process.env.N8N_WEBHOOK_STATUS_CHANGE,
  contact_form: process.env.N8N_WEBHOOK_CONTACT,
  low_stock: process.env.N8N_WEBHOOK_LOW_STOCK,
};

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

/**
 * Fire an event to n8n. Fire-and-forget (non-blocking).
 * Returns true if the webhook was attempted, false if no URL configured.
 */
export async function fireEvent(
  event: EventName,
  data: Record<string, unknown>
): Promise<boolean> {
  const url = WEBHOOK_URLS[event];
  if (!url) {
    console.log(`[n8n] No webhook URL configured for "${event}" — skipping`);
    return false;
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Optional: shared secret for authentication
    if (WEBHOOK_SECRET) {
      headers["x-n8n-secret"] = WEBHOOK_SECRET;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
    });

    if (!response.ok) {
      console.error(`[n8n] Webhook "${event}" returned ${response.status}`);
    } else {
      console.log(`[n8n] Event "${event}" fired successfully`);
    }

    return true;
  } catch (err) {
    console.error(`[n8n] Failed to fire event "${event}":`, err);
    return false;
  }
}