import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LUXE Cosmetics collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "June 24, 2026";

export default function PrivacyPage() {
  return (
    <div className="luxe-wrap py-16 max-w-3xl">
      <span className="luxe-eyebrow mb-3">Legal</span>
      <h1 className="font-display text-5xl font-medium tracking-tight mb-2">Privacy Policy</h1>
      <p className="luxe-mono text-[11px] text-[#2b2b28] mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="prose-luxe space-y-8 text-[#2b2b28] leading-relaxed">
        <section>
          <h2>1. Who we are</h2>
          <p>LUXE Cosmetics ("we", "us", "our") operates the website at luxe.store (the "Site") and sells skincare and cosmetics products. We respect your privacy and are committed to protecting your personal data. This policy explains what we collect, why we collect it, and what your rights are.</p>
          <p>For any privacy questions, contact us at <a href="mailto:privacy@luxe.local" className="underline">privacy@luxe.local</a>.</p>
        </section>

        <section>
          <h2>2. What we collect</h2>
          <p><strong>Information you provide:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account details: name, email address, password (stored as a bcrypt hash - never in plain text).</li>
            <li>Order information: shipping address, phone number, email used at checkout.</li>
            <li>Saved addresses you add to your account for faster checkout.</li>
            <li>Messages you send via our contact form.</li>
            <li>Newsletter subscriptions (email address only).</li>
          </ul>
          <p className="mt-3"><strong>Information collected automatically:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Anonymous analytics: page views, referrer, device type, approximate location (country/city).</li>
            <li>Shopping cart contents (stored in your browser's localStorage).</li>
            <li>Session cookies for authentication.</li>
          </ul>
        </section>

        <section>
          <h2>3. How we use your information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To process and fulfill your orders, including shipping and returns.</li>
            <li>To communicate with you about your orders (confirmations, shipping updates, customer service).</li>
            <li>To create and manage your account.</li>
            <li>To send marketing emails (only if you've subscribed - you can unsubscribe anytime).</li>
            <li>To improve our products, website, and customer experience.</li>
            <li>To detect and prevent fraud, abuse, and security incidents.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2>4. Legal basis for processing (GDPR)</h2>
          <p>Under the EU General Data Protection Regulation, we process your personal data on the following legal bases:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Contract:</strong> To fulfill our obligations when you place an order.</li>
            <li><strong>Consent:</strong> For marketing emails, cookies, and other optional features. You can withdraw consent at any time.</li>
            <li><strong>Legal obligation:</strong> To comply with tax, accounting, and consumer protection laws.</li>
            <li><strong>Legitimate interest:</strong> To prevent fraud, ensure security, and improve our services.</li>
          </ul>
        </section>

        <section>
          <h2>5. Payment data</h2>
          <p>We do not store your credit card details. Payments are processed by our payment service provider (PayHere / Stripe) which is PCI-DSS compliant. We only receive a confirmation token and the last 4 digits of your card for receipt purposes.</p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>We use the following types of cookies:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential cookies:</strong> Required for login, cart, and checkout. Cannot be disabled.</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site. Anonymized.</li>
            <li><strong>Marketing cookies:</strong> Used to show relevant ads on other platforms. Opt-in only.</li>
          </ul>
          <p>You can manage cookies via the cookie banner on first visit or in your browser settings.</p>
        </section>

        <section>
          <h2>7. Data sharing</h2>
          <p>We share your data with these third parties, only as needed to operate our business:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Payment processor</strong> (PayHere): to process your payment.</li>
            <li><strong>Email service</strong> (Resend): to send you order confirmations and marketing emails.</li>
            <li><strong>Shipping carrier</strong>: to deliver your order (we share name, address, phone).</li>
            <li><strong>Analytics provider</strong> (Vercel Analytics): anonymous traffic data.</li>
          </ul>
          <p>We never sell your personal data to anyone.</p>
        </section>

        <section>
          <h2>8. Data retention</h2>
          <p>We keep your account data for as long as your account is active. Order data is retained for 7 years (to comply with tax/accounting law). Marketing data is deleted when you unsubscribe. You can request deletion of your account at any time.</p>
        </section>

        <section>
          <h2>9. Your rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data ("right to be forgotten")</li>
            <li>Export your data in a portable format</li>
            <li>Object to certain types of processing</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:privacy@luxe.local" className="underline">privacy@luxe.local</a>. We respond within 30 days.</p>
        </section>

        <section>
          <h2>10. Security</h2>
          <p>We use industry-standard measures to protect your data: HTTPS encryption in transit, bcrypt password hashing, JWT session tokens, role-based access control for admin areas, and a managed PostgreSQL database with at-rest encryption. No system is 100% secure, but we work hard to keep yours safe.</p>
        </section>

        <section>
          <h2>11. Children's privacy</h2>
          <p>Our site is not intended for children under 16. We do not knowingly collect data from children. If you believe we've collected a child's data, please contact us.</p>
        </section>

        <section>
          <h2>12. International transfers</h2>
          <p>Your data is stored on servers in the United States (Vercel) and may be processed in other countries where our service providers operate. We only transfer data to countries with adequate data protection laws or under appropriate safeguards (e.g., Standard Contractual Clauses).</p>
        </section>

        <section>
          <h2>13. Changes to this policy</h2>
          <p>We may update this policy from time to time. We'll notify you of significant changes by email or a notice on the Site. The "last updated" date at the top always reflects the current version.</p>
        </section>

        <section>
          <h2>14. Contact</h2>
          <p>Questions? Email <a href="mailto:privacy@luxe.local" className="underline">privacy@luxe.local</a> or write to us at:<br />LUXE Cosmetics, 42 Galle Face Road, Colombo 03, Sri Lanka.</p>
        </section>
      </div>

      <style>{`
        .prose-luxe h2 { font-family: 'Fraunces', Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #0a0a0a; margin-bottom: 0.75rem; }
        .prose-luxe p { margin-bottom: 0.75rem; }
        .prose-luxe ul { margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
