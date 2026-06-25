import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <span className="luxe-eyebrow mb-2">Catalog</span>
        <h1 className="font-display text-4xl font-medium tracking-tight">New product</h1>
        <p className="mt-1 text-sm text-[#2b2b28]">Add a new product to the catalog.</p>
      </div>
      <ProductForm />
    </div>
  );
}
