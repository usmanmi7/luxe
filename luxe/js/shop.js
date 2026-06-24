/* ==========================================================================
   LUXE — shop.js  (catalog + filtering, links to product detail)
   ========================================================================== */

function luxeGetQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderShopGrid(filter) {
  const grid = document.getElementById('shop-grid');
  const countEl = document.getElementById('result-count');
  if (!grid) return;

  let filtered;
  if (filter === 'Sale') {
    filtered = LUXE_PRODUCTS.filter(p => p.originalPrice);
  } else if (filter === 'All') {
    filtered = LUXE_PRODUCTS;
  } else {
    filtered = LUXE_PRODUCTS.filter(p => p.category === filter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">No products in this category yet.</div>`;
  } else {
    grid.innerHTML = filtered.map(p => luxeProductCardHTML(p, '../')).join('');
    luxeBindQuickAdd(grid, '../');
  }
  if (countEl) countEl.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
}

function initShopFilters() {
  const pills = document.querySelectorAll('.pill');
  if (!pills.length) return;
  const urlCat = luxeGetQueryParam('cat');
  let active = 'All';
  if (urlCat && ['Skincare','Makeup','Sale'].includes(urlCat)) active = urlCat;

  pills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === active);
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderShopGrid(pill.dataset.filter);
    });
  });
  renderShopGrid(active);
}

document.addEventListener('DOMContentLoaded', () => {
  LUXE_PRODUCTS_READY.then(initShopFilters);
});
