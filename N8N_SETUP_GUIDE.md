# LUXE × n8n — Automation Setup Guide

## Overview

Your LUXE website now sends real-time events to n8n Cloud. This guide walks you through setting up 4 automations:

| # | Automation | Trigger | Action |
|---|-----------|---------|--------|
| 1 | **New Order Admin Notification** | Customer places order | Email + Discord to admin |
| 2 | **Order Status → Customer Email** | Admin changes status | Branded email to customer (shipped/delivered) |
| 3 | **Contact Form → Notifications** | Customer submits contact form | Admin email + auto-reply to customer |
| 4 | **Low Stock Alert** (bonus) | Every 6 hours | Email + Discord if products are low |

---

## Step 1: Set Up n8n Cloud

1. Go to [n8n.cloud](https://n8n.cloud) and sign in (or create an account)
2. Click **"New Workflow"** for each of the 4 workflows below

## Step 2: Import Workflows

### Option A: Import from JSON files
For each workflow file in the `n8n-workflows/` folder:

1. In n8n, click the **⋮ menu** (top right) → **Import from File**
2. Select the JSON file
3. The workflow will appear with all nodes pre-configured

### Option B: Build manually (follow the node descriptions in the JSON files)

### Workflow Files:
- `1-new-order-notification.json` — Webhook → Format Message → Email + Discord
- `2-order-status-customer-email.json` — Webhook → If/Else → Shipped or Delivered email
- `3-contact-form-notification.json` — Webhook → Build Emails → Admin + Auto-Reply
- `4-low-stock-alert.json` — Schedule (6h) → HTTP Request → If items → Email + Discord

## Step 3: Activate Each Workflow & Get Webhook URLs

For workflows 1, 2, and 3 (webhook-triggered):

1. Open the workflow in n8n
2. Click **"Active"** toggle in the top right (turns green)
3. n8n will show you the **Webhook URL** (e.g., `https://your-instance.n8n.cloud/webhook/new-order`)
4. **Copy this URL** — you'll need it in Step 4

For workflow 4 (scheduled):
- Just activate it — no webhook URL needed (it uses a schedule trigger)

## Step 4: Configure Vercel Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables** and add:

```
N8N_WEBHOOK_NEW_ORDER       = https://your-instance.n8n.cloud/webhook/new-order
N8N_WEBHOOK_STATUS_CHANGE   = https://your-instance.n8n.cloud/webhook/status-change
N8N_WEBHOOK_CONTACT         = https://your-instance.n8n.cloud/webhook/contact
N8N_WEBHOOK_SECRET          = (pick a random secret string, e.g., abc123xyz)
```

Then **redeploy** your Vercel project (or it will auto-deploy if connected to GitHub).

## Step 5: Configure n8n SMTP Credentials

All email-sending nodes in n8n need SMTP credentials. In n8n:

1. Go to **Credentials** → **Add Credential**
2. Search for **"SMTP"**
3. Fill in:
   - **Host**: `smtp.resend.com` (if using Resend) or your SMTP provider
   - **Port**: `587`
   - **User**: `resend` (for Resend) or your SMTP username
   - **Password**: Your SMTP/API password
   - **SSL/TLS**: True
4. Save and note the credential ID

Then in each workflow, click the **Email node** → **Credential to connect with** → select the SMTP credential you created.

> **Tip**: You can use the same Resend account that LUXE already uses for emails. Just generate an API key from [resend.com](https://resend.com) and use it as the SMTP password.

## Step 6: Customize & Test

### Test New Order Notification:
1. Place a test order on your website
2. Check n8n execution log — you should see the webhook received
3. Check your admin email and/or Discord for the notification

### Test Order Status Email:
1. Go to LUXE Admin → Orders → Change any order to "Shipped"
2. The customer should receive a branded "Your order has shipped" email

### Test Contact Form:
1. Go to your Contact page and submit a message
2. You should receive an admin notification email
3. The customer should receive an auto-reply

### Test Low Stock Alert:
1. In n8n, open the Low Stock workflow
2. Click **"Test workflow"** (or wait for the schedule)
3. If any products have stock ≤ 5, you'll get an alert

## Step 7: Customize for Your Needs

### Change notification channels:
- **Discord**: Add a Discord webhook URL in n8n (create one in Discord Server Settings → Integrations → Webhooks)
- **Slack**: Replace the Discord node with a Slack node
- **WhatsApp**: Add a WhatsApp Business API node (requires Meta Business account)
- **Telegram**: Add a Telegram node with your bot token

### Add more status emails:
In workflow 2, you can add branches for:
- `cancelled` — Send a "Sorry to see you go" email with refund info
- `refunded` — Send a "Refund processed" confirmation
- `paid` — Send a "Payment confirmed, preparing your order" email

### Change email addresses:
In each n8n workflow, replace `admin@luxe.local` with YOUR real email address.

## Architecture Diagram

```
LUXE Website (Vercel)                    n8n Cloud
┌─────────────────────┐              ┌─────────────────────────┐
│                     │   webhook    │                         │
│ /api/orders  POST───┼─────────────>│ WF1: New Order Alert   │
│                     │              │     → Email + Discord   │
│                     │              └─────────────────────────┘
│                     │   webhook    ┌─────────────────────────┐
│ /api/admin/orders   │─────────────>│ WF2: Status Change     │
│   PATCH (status)────┼              │     → Customer Email   │
│                     │              └─────────────────────────┘
│                     │   webhook    ┌─────────────────────────┐
│ /api/contact  POST──┼─────────────>│ WF3: Contact Form      │
│                     │              │     → Admin + Auto-Reply│
│                     │              └─────────────────────────┘
│                     │   HTTP poll  ┌─────────────────────────┐
│ /api/webhooks/      │<─────────────│ WF4: Low Stock Alert   │
│   low-stock  GET────┼  (every 6h)  │     → Email + Discord   │
│                     │              └─────────────────────────┘
└─────────────────────┘
```

## Files Modified/Created

### Modified:
- `src/app/api/orders/route.ts` — Added n8n webhook fire on new order
- `src/app/api/admin/orders/[id]/route.ts` — Added n8n webhook fire on status change
- `src/app/contact/page.tsx` — Wired contact form to real API endpoint

### Created:
- `src/lib/luxe/n8n-webhook.ts` — Centralized n8n webhook utility
- `src/app/api/contact/route.ts` — Real contact form API endpoint
- `src/app/api/webhooks/low-stock/route.ts` — Low stock check endpoint
- `n8n-workflows/1-new-order-notification.json`
- `n8n-workflows/2-order-status-customer-email.json`
- `n8n-workflows/3-contact-form-notification.json`
- `n8n-workflows/4-low-stock-alert.json`