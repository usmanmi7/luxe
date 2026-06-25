import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using the LUXE Cosmetics website and services.",
};

const LAST_UPDATED = "June 24, 2026";

export default function TermsPage() {
  return (
    <div className="luxe-wrap py-16 max-w-3xl">
      <span className="luxe-eyebrow mb-3">Legal</span>
      <h1 className="font-display text-5xl font-medium tracking-tight mb-2">Terms of Service</h1>
      <p className="luxe-mono text-[11px] text-[#2b2b28] mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="prose-luxe space-y-8 text-[#2b2b28] leading-relaxed">
        <section>
          <h2>1. Agreement to terms</h2>
          <p>By accessing or using the LUXE Cosmetics website at luxe.store (the "Site"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2>2. Who can use the site</h2>
          <p>You must be at least 16 years old to create an account, or 18 to place an order. By using the Site, you represent that you meet these requirements and have the legal capacity to enter into a binding agreement.</p>
        </section>

        <section>
          <h2>3. Your account</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You're responsible for keeping your password confidential.</li>
            <li>You must provide accurate, current information when creating an account and placing orders.</li>
            <li>You're responsible for all activity under your account.</li>
            <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>We may suspend or terminate your account if you violate these Terms.</li>
          </ul>
        </section>

        <section>
          <h2>4. Orders and pricing</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All orders are subject to acceptance and availability. We may refuse or cancel any order at our discretion.</li>
            <li>Prices are listed in USD and include applicable taxes where required. Additional duties may apply for international shipments.</li>
            <li>If we can't fulfill your order, we'll refund the full amount within 5 business days.</li>
            <li>Promotional pricing and discount codes are subject to specific terms displayed at the time of offer.</li>
          </ul>
        </section>

        <section>
          <h2>5. Payment</h2>
          <p>We accept payment via card (Visa, Mastercard, Amex), mobile wallets (eZ Cash, mCash), Cash on Delivery (COD), and bank transfer. Card payments are processed by our payment partner PayHere. By submitting payment, you authorize us to charge your selected payment method for the full order amount.</p>
        </section>

        <section>
          <h2>6. Shipping</h2>
          <p>We ship to most countries. Delivery times are estimates and not guaranteed. Risk of loss passes to you when the order is delivered to the carrier. See our <a href="/shipping" className="underline">Shipping Policy</a> for details.</p>
        </section>

        <section>
          <h2>7. Returns and refunds</h2>
          <p>We accept returns within 30 days of delivery on unopened products. If you've had an allergic reaction, contact us within 14 days for a full refund. See our <a href="/returns" className="underline">Returns Policy</a> for full details.</p>
        </section>

        <section>
          <h2>8. Product information</h2>
          <p>We do our best to display product colors and ingredients accurately, but we can't guarantee your device's display matches the actual product. Product reviews reflect individual experiences and are not endorsed by us. If you have sensitive skin or allergies, review the ingredients list before purchase.</p>
        </section>

        <section>
          <h2>9. Intellectual property</h2>
          <p>All content on the Site — including text, graphics, logos, images, and software — is owned by LUXE Cosmetics or licensed to us. You may not copy, modify, distribute, or republish any content without our written permission.</p>
        </section>

        <section>
          <h2>10. User conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Site for any unlawful purpose</li>
            <li>Submit false or misleading information</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use bots, scrapers, or automated tools without our consent</li>
            <li>Interfere with other users' use of the Site</li>
            <li>Post abusive, defamatory, or infringing content in reviews</li>
          </ul>
        </section>

        <section>
          <h2>11. Reviews and user content</h2>
          <p>If you submit a product review, you grant us a non-exclusive, royalty-free license to display, reproduce, and adapt that content. You represent that you own the rights to the content you submit and that it doesn't infringe anyone else's rights.</p>
        </section>

        <section>
          <h2>12. Disclaimer of warranties</h2>
          <p>The Site and products are provided "as is" without warranty of any kind. We don't guarantee that products will work for your specific skin type or condition. Always patch-test new products and consult a dermatologist if you have concerns.</p>
        </section>

        <section>
          <h2>13. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, LUXE Cosmetics shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or products. Our total liability for any claim shall not exceed the amount you paid us in the last 12 months.</p>
        </section>

        <section>
          <h2>14. Indemnification</h2>
          <p>You agree to indemnify and hold LUXE Cosmetics harmless from any claims, damages, or expenses arising from your use of the Site, your violation of these Terms, or your infringement of any third-party rights.</p>
        </section>

        <section>
          <h2>15. Governing law</h2>
          <p>These Terms are governed by the laws of Sri Lanka. Any disputes will be resolved in the courts of Colombo, Sri Lanka. We may bring claims in any jurisdiction where you reside or do business.</p>
        </section>

        <section>
          <h2>16. Changes to terms</h2>
          <p>We may update these Terms from time to time. Changes are effective when posted. Continued use of the Site after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2>17. Contact</h2>
          <p>Questions? Email <a href="mailto:legal@luxe.local" className="underline">legal@luxe.local</a> or write to:<br />LUXE Cosmetics, 42 Galle Face Road, Colombo 03, Sri Lanka.</p>
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
