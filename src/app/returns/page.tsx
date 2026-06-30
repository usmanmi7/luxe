import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "LUXE Cosmetics return and refund policy.",
};

export default function ReturnsPage() {
  return (
    <div className="luxe-wrap py-16 max-w-3xl">
      <span className="luxe-eyebrow mb-3">Legal</span>
      <h1 className="font-display text-5xl font-medium tracking-tight mb-10">Returns & Refunds</h1>

      <div className="prose-luxe space-y-8 text-[#2b2b28] leading-relaxed">
        <section>
          <h2>Our promise</h2>
          <p>If you're not happy with your LUXE purchase, we want to make it right. We accept returns within 30 days of delivery, no questions asked. If you've had an allergic reaction or your product is defective, contact us within 14 days for a full refund - even if the product has been used.</p>
        </section>

        <section>
          <h2>What can be returned</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Unopened products:</strong> Full refund within 30 days of delivery.</li>
            <li><strong>Opened but unused:</strong> Store credit within 30 days of delivery.</li>
            <li><strong>Allergic reaction or defect:</strong> Full refund within 14 days of delivery, even if used.</li>
            <li><strong>Wrong item received:</strong> Full refund or replacement. We'll cover return shipping.</li>
          </ul>
        </section>

        <section>
          <h2>What can't be returned</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Products purchased more than 30 days ago (except for defects covered by warranty)</li>
            <li>Gift cards</li>
            <li>Items marked "final sale" or "clearance"</li>
            <li>Products damaged by misuse, improper storage, or normal wear</li>
          </ul>
        </section>

        <section>
          <h2>How to start a return</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Email <a href="mailto:returns@luxe.local" className="underline">returns@luxe.local</a> with your order number and the reason for return.</li>
            <li>We'll send you a return authorization and the return shipping address within 1 business day.</li>
            <li>Pack the items securely with their original packaging and any included accessories.</li>
            <li>Ship the package using a trackable service. Keep your tracking number.</li>
            <li>We'll process your refund within 3 business days of receiving the return.</li>
          </ol>
        </section>

        <section>
          <h2>Refund timing</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Card payments:</strong> Refunded to your original payment method. Appears in 5-10 business days.</li>
            <li><strong>COD:</strong> Refunded via bank transfer to your account. Provide your bank details when requesting the return.</li>
            <li><strong>Bank transfer:</strong> Refunded to the originating bank account within 3 business days.</li>
            <li><strong>Store credit:</strong> Issued immediately as a discount code, valid for 12 months.</li>
          </ul>
        </section>

        <section>
          <h2>Return shipping costs</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>We pay:</strong> Wrong item, defective product, allergic reaction, or our error.</li>
            <li><strong>You pay:</strong> Changed your mind, no longer want the item, ordered the wrong shade/size.</li>
          </ul>
          <p>For Sri Lanka returns, expect $4-8 for shipping. International return costs vary.</p>
        </section>

        <section>
          <h2>Exchanges</h2>
          <p>We don't do direct exchanges. Instead, return the original item for a refund and place a new order for what you want. This is faster than waiting for us to receive and reship.</p>
        </section>

        <section>
          <h2>Damaged on arrival</h2>
          <p>If your package arrives damaged, contact us within 48 hours with photos of the product, packaging, and shipping label. We'll send a replacement or issue a full refund - your choice.</p>
        </section>

        <section>
          <h2>Allergic reactions</h2>
          <p>Skincare is personal. If you have a reaction, stop using the product immediately and contact us. We'll issue a full refund (no return required for safety reasons) and may ask for product details to help us improve. Always patch-test new products on your inner forearm for 24 hours before applying to your face.</p>
        </section>

        <section>
          <h2>Order cancellations</h2>
          <p>You can cancel an order for free within 1 hour of placing it (as long as it hasn't shipped). After that, the order is in fulfillment and we can't cancel - you'll need to return it once received.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Returns questions? Email <a href="mailto:returns@luxe.local" className="underline">returns@luxe.local</a> with your order number.</p>
        </section>
      </div>

      <style>{`
        .prose-luxe h2 { font-family: 'Fraunces', Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #0a0a0a; margin-bottom: 0.75rem; }
        .prose-luxe p { margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
