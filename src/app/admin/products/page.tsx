import Link from "next/link";
import { db } from "@/lib/db";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, slug: true, category: true, price: true, originalPrice: true, stock: true, tag: true, active: true, img: true },
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="luxe-eyebrow mb-2">Catalog</span>
          <h1 className="font-display text-4xl font-medium tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-[#2b2b28]">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="luxe-btn-primary"><span>+ New product</span></Link>
      </div>

      <div className="bg-white border border-[#e4e1d6] rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f3f1ea]">
            <tr className="luxe-mono text-[10px] text-[#2b2b28] text-left">
              <th className="px-4 py-3">PRODUCT</th>
              <th className="px-4 py-3">CATEGORY</th>
              <th className="px-4 py-3">PRICE</th>
              <th className="px-4 py-3">STOCK</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e1d6]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#fafaf8]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt={p.name} className="w-10 h-12 object-cover rounded" />
                    <div>
                      <div className="font-display font-medium">{p.name}</div>
                      <div className="luxe-mono text-[10px] text-[#2b2b28]">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 luxe-mono text-xs">{p.category}</td>
                <td className="px-4 py-3 font-mono text-sm">
                  ${p.price.toFixed(2)}
                  {p.originalPrice && <div className="text-[10px] text-[#2b2b28]/60 line-through">${p.originalPrice.toFixed(2)}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`luxe-mono text-xs px-2 py-1 rounded ${p.stock === 0 ? "bg-red-100 text-red-800" : p.stock <= 10 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  {p.active ? <span className="luxe-mono text-[10px] text-green-700">● Active</span> : <span className="luxe-mono text-[10px] text-gray-500">○ Inactive</span>}
                  {p.tag && <div className="luxe-mono text-[10px] text-[#2b2b28]">{p.tag}</div>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}/edit`} className="luxe-mono text-[11px] underline hover:text-[#0a0a0a] mr-3">Edit</Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
