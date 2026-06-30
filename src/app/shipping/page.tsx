import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "How LUXE Cosmetics ships orders, delivery times, and shipping costs.",
};

export default function ShippingPage() {
  return (
    <div className="luxe-wrap py-16 max-w-3xl">
      <span className="luxe-eyebrow mb-3">Legal</span>
      <h1 className="font-display text-5xl font-medium tracking-tight mb-10">Shipping Policy</h1>

      <div className="prose-luxe space-y-8 text-[#2b2b28] leading-relaxed">
        <section>
          <h2>Where we ship</h2>
          <p>We currently ship to all 25 districts of Sri Lanka and to most international destinations. If your country is not available at checkout, contact us at <a href="mailto:shipping@luxe.local" className="underline">shipping@luxe.local</a> for a custom quote.</p>
        </section>

        <section>
          <h2>Processing time</h2>
          <p>Orders are processed within 1-2 business days (Monday-Friday, excluding Sri Lankan public holidays). Orders placed after 12pm on Friday or on weekends ship the following Monday.</p>
        </section>

        <section>
          <h2>Delivery times</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-[#0a0a0a]">
                <th className="text-left py-2 luxe-mono text-[11px]">REGION</th>
                <th className="text-left py-2 luxe-mono text-[11px]">DELIVERY TIME</th>
                <th className="text-left py-2 luxe-mono text-[11px]">COST</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e4e1d6]"><td className="py-3">Colombo & suburbs</td><td className="py-3">1-2 business days</td><td className="py-3">Free over $60 · $4 otherwise</td></tr>
              <tr className="border-b border-[#e4e1d6]"><td className="py-3">Rest of Sri Lanka</td><td className="py-3">2-4 business days</td><td className="py-3">Free over $60 · $5 otherwise</td></tr>
              <tr className="border-b border-[#e4e1d6]"><td className="py-3">South Asia (India, BD, Maldives)</td><td className="py-3">5-8 business days</td><td className="py-3">$12 flat</td></tr>
              <tr className="border-b border-[#e4e1d6]"><td className="py-3">Rest of world</td><td className="py-3">7-14 business days</td><td className="py-3">$18 flat (duties may apply)</td></tr>
              <tr><td className="py-3">Cash on Delivery</td><td className="py-3">+1 business day</td><td className="py-3">+$5 fee</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Order tracking</h2>
          <p>Once your order ships, you'll receive an email with a tracking number. You can also view tracking info in your <a href="/account" className="underline">account dashboard</a>. Click "View details" on any shipped order.</p>
        </section>

        <section>
          <h2>Shipping delays</h2>
          <p>Delivery times are estimates, not guarantees. We're not responsible for delays caused by the carrier, weather, customs, public holidays, or other events outside our control. If your order is more than 5 days late, contact us.</p>
        </section>

        <section>
          <h2>Incorrect address</h2>
          <p>Please double-check your shipping address at checkout. If your package is returned to us due to an incorrect address, we'll contact you to arrange re-shipping. Additional shipping fees may apply.</p>
        </section>

        <section>
          <h2>Damaged or lost packages</h2>
          <p>If your package arrives damaged, contact us within 48 hours with photos. If your package is marked as delivered but you can't find it, check with neighbors and your building manager first, then contact us. We'll work with the carrier to resolve.</p>
        </section>

        <section>
          <h2>Cash on Delivery (COD)</h2>
          <p>Available island-wide in Sri Lanka for orders under $200. Please have the exact cash amount ready when your order arrives. Our delivery partner will call you to confirm the delivery window. If you're not available, they'll attempt redelivery up to 2 more times before returning the order to us.</p>
        </section>

        <section>
          <h2>Bank transfer orders</h2>
          <p>If you choose bank transfer, your order is held for 3 business days pending payment. Email your transfer receipt to <a href="mailto:orders@luxe.local" className="underline">orders@luxe.local</a> with your order number. Once we confirm payment, we'll ship within 1-2 business days.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Shipping questions? Email <a href="mailto:shipping@luxe.local" className="underline">shipping@luxe.local</a>.</p>
        </section>
      </div>

      <style>{`
        .prose-luxe h2 { font-family: 'Fraunces', Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #0a0a0a; margin-bottom: 0.75rem; }
        .prose-luxe p { margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
