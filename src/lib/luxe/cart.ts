"use client";

// ==========================================================================
// LUXE — client-side cart helpers
// localStorage-backed for now; will swap to server-side DB cart when auth lands
// ==========================================================================

export const CART_KEY = "luxe_cart_v1";

export type CartItem = {
  key: string;       // productId or productId|variant
  id: string;        // productId
  qty: number;
  variant: string | null;
};

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Notify header + other components
  window.dispatchEvent(new CustomEvent("luxe:cart-changed"));
}

export function addToCart(productId: string, qty = 1, variant: string | null = null) {
  const cart = getCart();
  const key = variant ? `${productId}|${variant}` : productId;
  const existing = cart.find((i) => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, id: productId, qty, variant });
  }
  saveCart(cart);
}

export function removeFromCart(key: string) {
  saveCart(getCart().filter((i) => i.key !== key));
}

export function setQty(key: string, qty: number) {
  const cart = getCart();
  const item = cart.find((i) => i.key === key);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

export function cartCount(): number {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

export function clearCart() {
  saveCart([]);
}
