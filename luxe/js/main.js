/* ==========================================================================
   LUXE — main.js  (shared card renderer + landing page sections)
   ========================================================================== */

/* ---------- Shared: product card HTML ---------- */
function luxeProductCardHTML(p, prefix) {
  prefix = (prefix === undefined || prefix === null) ? '' : prefix;
  const saleBadge = p.tag === 'Sale' && p.originalPrice
    ? `<span class="product-tag tag-sale">${p.tag}</span>` : '';
  const otherBadge = p.tag && p.tag !== 'Sale'
    ? `<span class="product-tag tag-${p.tag.toLowerCase()}">${p.tag}</span>` : '';
  const priceHTML = p.originalPrice
    ? `<span class="product-price-sale">${luxeFormatPrice(p.price)}</span> <span class="product-price-orig">${luxeFormatPrice(p.originalPrice)}</span>`
    : `<span class="product-price">${luxeFormatPrice(p.price)}</span>`;
  return `
    <article class="product-card">
      <a href="${prefix}pages/product.html?id=${p.id}" class="product-img-wrap">
        ${saleBadge || otherBadge}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-quickadd">
          <button type="button" data-add="${p.id}">Quick add</button>
        </div>
      </a>
      <div class="product-card-body">
        <div class="product-cat">${p.category}</div>
        <a href="${prefix}pages/product.html?id=${p.id}" class="product-name">${p.name}</a>
        <div class="product-price-row">${priceHTML}</div>
      </div>
    </article>`;
}

/* ---------- Shared: bind quick-add buttons ---------- */
function luxeBindQuickAdd(scope, prefix) {
  scope.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      luxeAddToCart(btn.dataset.add, 1);
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = 'Quick add'; }, 1800);
    });
  });
}

/* ---------- Landing: sale strip ---------- */
function renderSaleCards() {
  const grid = document.getElementById('sale-cards');
  if (!grid) return;
  const saleProducts = LUXE_PRODUCTS.filter(p => p.originalPrice).slice(0, 4);
  grid.innerHTML = saleProducts.map(p => {
    const pct = Math.round((1 - p.price / p.originalPrice) * 100);
    return `
      <a href="pages/product.html?id=${p.id}" class="sale-card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="sale-card-info">
          <span class="sale-off-badge"><span class="sale-off-pct">-${pct}%</span></span>
          <strong>${p.name}</strong>
          <span>${luxeFormatPrice(p.price)} <s>${luxeFormatPrice(p.originalPrice)}</s></span>
        </div>
      </a>`;
  }).join('');
}

/* ---------- Landing: new arrivals — all 12 products ---------- */
function renderNewArrivals() {
  const grid = document.getElementById('new-arrivals-grid');
  if (!grid) return;
  grid.innerHTML = LUXE_PRODUCTS.map(p => luxeProductCardHTML(p, '')).join('');
  luxeBindQuickAdd(grid, '');
}

/* ---------- Newsletter forms ---------- */
function initNewsletterForms() {
  document.querySelectorAll('#newsletter-form, #footer-newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      luxeShowToast("You're on the list! 🎉");
      form.reset();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSaleCards();
  renderNewArrivals();
  initNewsletterForms();
});
