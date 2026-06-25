import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const initial: ProductFormData = {
    name: product.name,
    category: product.category,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    img: product.img,
    gallery: product.gallery.join("\n"),
    desc: product.desc,
    longDesc: product.longDesc,
    ingredients: product.ingredients,
    tag: product.tag || "",
    shades: product.shades.join(", "),
    sizes: product.sizes.join(", "),
    stock: String(product.stock),
    active: product.active,
  };

  return (
    <div>
      <div className="mb-8">
        <span className="luxe-eyebrow mb-2">Catalog</span>
        <h1 className="font-display text-4xl font-medium tracking-tight">Edit product</h1>
        <p className="mt-1 text-sm text-[#2b2b28]">Editing: <strong>{product.name}</strong></p>
      </div>
      <ProductForm initial={initial} productId={product.id} />
    </div>
  );
}
