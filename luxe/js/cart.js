/* ==========================================================================
   LUXE — shared product data + cart logic
   Products are now loaded from the /api/products endpoint (backed by
   data/products.json — the Vercel-hosted product database).
   LocalStorage cache for instant subsequent page loads.
   ========================================================================== */

const CART_KEY = 'luxe_cart_v1';
const PRODUCTS_CACHE_KEY = 'luxe_products_cache_v1';
const PRODUCTS_CACHE_TTL = 1000 * 60 * 60; // 1 hour

/* ---------- Product database (loaded async from /api/products) ---------- */
let LUXE_PRODUCTS = [];
let _productsResolved = false;

async function _loadProducts() {
  // 1. Try cache first for instant render
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.products) && (Date.now() - (parsed._ts || 0)) < PRODUCTS_CACHE_TTL) {
        LUXE_PRODUCTS = parsed.products;
      } else if (parsed && Array.isArray(parsed.products)) {
        // Expired cache — use it immediately, but refresh in background
        LUXE_PRODUCTS = parsed.products;
      }
    }
  } catch (e) { /* ignore cache read errors */ }

  // 2. Always fetch fresh data in the background to keep cache up to date
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      LUXE_PRODUCTS = data.products;
      data._ts = Date.now();
      try { localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data)); } catch (e) {}
      // Notify any page that may have already rendered with stale/empty data
      window.dispatchEvent(new CustomEvent('luxe:products-ready'));
    }
  } catch (e) {
    console.error('[LUXE] Failed to load products from /api/products:', e);
    // Last-resort fallback: keep whatever we got from cache, if anything.
    // If LUXE_PRODUCTS is still empty, UI will show a friendly error
    // message via the render functions' empty-state branches.
  }
  _productsResolved = true;
}

// A promise the rest of the codebase can await before rendering product-dependent UI.
const LUXE_PRODUCTS_READY = _loadProducts();

/* ---------- Cart (localStorage-backed) ---------- */
function luxeGetCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch(e) { return []; }
}
function luxeSaveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  luxeUpdateCartCount();
}
function luxeAddToCart(productId, qty = 1, variant = null) {
  const cart = luxeGetCart();
  const key = variant ? productId + '|' + variant : productId;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty += qty; }
  else { cart.push({ key, id: productId, qty, variant }); }
  luxeSaveCart(cart);
  luxeShowToast('Added to bag ✓');
}
function luxeRemoveFromCart(key) {
  luxeSaveCart(luxeGetCart().filter(i => i.key !== key));
}
function luxeSetQty(key, qty) {
  const cart = luxeGetCart();
  const item = cart.find(i => i.key === key);
  if (item) { item.qty = Math.max(1, qty); luxeSaveCart(cart); }
}
function luxeCartTotal() {
  return luxeGetCart().reduce((sum, item) => {
    const p = LUXE_PRODUCTS.find(p => p.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}
function luxeCartCount() {
  return luxeGetCart().reduce((s, i) => s + i.qty, 0);
}
function luxeUpdateCartCount() {
  const count = luxeCartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
function luxeShowToast(message) {
  let t = document.getElementById('luxe-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'luxe-toast';
    t.setAttribute('role','status');
    t.setAttribute('aria-live','polite');
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}
function luxeFormatPrice(n) { return '$' + n.toFixed(2); }

/* ---------- Shared UI helpers ---------- */
function luxeInitNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    nav.classList.toggle('mobile-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });
}
function luxeInitReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('in')); return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ---------- On page load ---------- */
// Cart count + nav + reveal can run immediately (don't depend on product DB).
document.addEventListener('DOMContentLoaded', () => {
  luxeUpdateCartCount();
  luxeInitNav();
  luxeInitReveal();
});
