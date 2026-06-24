/* ==========================================================================
   LUXE — checkout.js (cart view + checkout view + confirmation, all client-side)
   ========================================================================== */

const TAX_RATE = 0.0; // demo store, no real tax engine

function luxeCartItemsWithProducts() {
  const cart = luxeGetCart();
  return cart
    .map(item => {
      const product = LUXE_PRODUCTS.find(p => p.id === item.id);
      const key = item.key || item.id;
      return product ? { ...product, qty: item.qty, key, variant: item.variant || null } : null;
    })
    .filter(Boolean);
}

function luxeRenderCartView() {
  const container = document.getElementById('cart-items');
  const cartView = document.getElementById('cart-view');
  const emptyView = document.getElementById('empty-cart');
  const layout = document.querySelector('#cart-view .cart-layout');
  if (!container) return;

  const items = luxeCartItemsWithProducts();

  if (items.length === 0) {
    if (layout) layout.hidden = true;
    if (emptyView) emptyView.hidden = false;
    luxeUpdateSummary('sum');
    return;
  }

  if (layout) layout.hidden = false;
  if (emptyView) emptyView.hidden = true;

  container.innerHTML = items.map((p) => `
    <div class="cart-item" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <div>
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-cat">${p.category}${p.variant ? ' · ' + p.variant : ''}</div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button type="button" data-decr="${p.key}" aria-label="Decrease quantity">−</button>
            <span>${p.qty}</span>
            <button type="button" data-incr="${p.key}" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="remove-link" data-remove="${p.key}">Remove</button>
        </div>
      </div>
      <div class="cart-item-price mono">${luxeFormatPrice(p.price * p.qty)}</div>
    </div>
  `).join('');

  container.querySelectorAll('[data-incr]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.incr;
      const item = luxeGetCart().find(i => (i.key || i.id) === key);
      luxeSetQty(key, (item?.qty || 1) + 1);
      luxeRenderCartView();
    });
  });
  container.querySelectorAll('[data-decr]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.decr;
      const item = luxeGetCart().find(i => (i.key || i.id) === key);
      const newQty = (item?.qty || 1) - 1;
      if (newQty <= 0) { luxeRemoveFromCart(key); }
      else { luxeSetQty(key, newQty); }
      luxeRenderCartView();
    });
  });
  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      luxeRemoveFromCart(btn.dataset.remove);
      luxeRenderCartView();
      luxeShowToast('Removed from bag');
    });
  });

  luxeUpdateSummary('sum');
}

function luxeUpdateSummary(prefix) {
  const subtotal = luxeCartTotal();
  const shipping = 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const subEl = document.getElementById(`${prefix}-subtotal`);
  const taxEl = document.getElementById(`${prefix}-tax`);
  const totalEl = document.getElementById(`${prefix}-total`);
  if (subEl) subEl.textContent = luxeFormatPrice(subtotal);
  if (taxEl) taxEl.textContent = luxeFormatPrice(tax);
  if (totalEl) totalEl.textContent = luxeFormatPrice(total);

  return { subtotal, shipping, tax, total };
}

function luxeRenderCheckoutItems() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  const items = luxeCartItemsWithProducts();
  container.innerHTML = items.map((p) => `
    <div class="summary-row">
      <span>${p.name} × ${p.qty}</span>
      <span class="mono">${luxeFormatPrice(p.price * p.qty)}</span>
    </div>
  `).join('');
}

function luxeShowCheckoutView() {
  const cartView = document.getElementById('cart-view');
  const checkoutView = document.getElementById('checkout-view');
  const confirmView = document.getElementById('confirmation-view');
  const eyebrow = document.getElementById('step-eyebrow');
  const title = document.getElementById('page-title');

  if (luxeCartCount() === 0) {
    luxeShowToast('Your bag is empty');
    return;
  }

  cartView.hidden = true;
  checkoutView.hidden = false;
  confirmView.hidden = true;
  if (eyebrow) eyebrow.textContent = 'Step 2 of 2';
  if (title) title.textContent = 'Checkout';

  luxeRenderCheckoutItems();
  const totals = luxeUpdateSummary('co');
  const checkoutTotalEl = document.getElementById('checkout-total');
  if (checkoutTotalEl) checkoutTotalEl.textContent = luxeFormatPrice(totals.total);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function luxeShowCartView() {
  const cartView = document.getElementById('cart-view');
  const checkoutView = document.getElementById('checkout-view');
  const eyebrow = document.getElementById('step-eyebrow');
  const title = document.getElementById('page-title');

  cartView.hidden = false;
  checkoutView.hidden = true;
  if (eyebrow) eyebrow.textContent = 'Step 1 of 2';
  if (title) title.textContent = 'Your bag';

  luxeRenderCartView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function luxeShowConfirmation(email) {
  const cartView = document.getElementById('cart-view');
  const checkoutView = document.getElementById('checkout-view');
  const confirmView = document.getElementById('confirmation-view');
  const eyebrow = document.getElementById('step-eyebrow');
  const title = document.getElementById('page-title');

  cartView.hidden = true;
  checkoutView.hidden = true;
  confirmView.hidden = false;
  if (eyebrow) eyebrow.textContent = 'Order confirmed';
  if (title) title.textContent = '';

  const emailEl = document.getElementById('confirm-email');
  const orderIdEl = document.getElementById('confirm-order-id');
  if (emailEl) emailEl.textContent = email;
  if (orderIdEl) {
    const orderId = 'LUXE-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    orderIdEl.textContent = `Order #${orderId}`;
  }

  localStorage.removeItem(CART_KEY);
  luxeUpdateCartCount();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function luxeInitCheckoutFlow() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const backBtn = document.getElementById('back-to-cart');
  const form = document.getElementById('checkout-form');

  if (checkoutBtn) checkoutBtn.addEventListener('click', luxeShowCheckoutView);
  if (backBtn) backBtn.addEventListener('click', luxeShowCartView);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const email = form.elements['email'].value;
      luxeShowConfirmation(email);
    });
  }

  luxeRenderCartView();
}

document.addEventListener('DOMContentLoaded', () => {
  LUXE_PRODUCTS_READY.then(luxeInitCheckoutFlow);
});
