import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { AddressForm } from "@/components/site/address-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditAddressPage({ params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");

  const { id } = await params;
  const address = await db.address.findFirst({ where: { id, userId: session.user.id } });
  if (!address) notFound();

  return (
    <div className="luxe-wrap py-12 max-w-2xl">
      <div className="mb-6">
        <a href="/account/addresses" className="luxe-btn-ghost">← Back to addresses</a>
      </div>
      <span className="luxe-eyebrow mb-2">Settings</span>
      <h1 className="font-display text-4xl font-medium tracking-tight mb-8">Edit address</h1>
      <AddressForm
        addressId={address.id}
        initial={{
          label: address.label,
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          city: address.city,
          postal: address.postal,
          country: address.country,
          phone: address.phone || "",
          isDefault: address.isDefault,
        }}
      />
    </div>
  );
}
