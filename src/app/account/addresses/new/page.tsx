import { AddressForm } from "@/components/site/address-form";

export default function NewAddressPage() {
  return (
    <div className="luxe-wrap py-12 max-w-2xl">
      <div className="mb-6">
        <a href="/account/addresses" className="luxe-btn-ghost">← Back to addresses</a>
      </div>
      <span className="luxe-eyebrow mb-2">Settings</span>
      <h1 className="font-display text-4xl font-medium tracking-tight mb-8">Add address</h1>
      <AddressForm />
    </div>
  );
}
