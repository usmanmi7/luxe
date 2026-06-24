/* ==========================================================================
   LUXE — product.js  (product detail page logic)
   ========================================================================== */

const SHADE_COLORS = {
  'Acid': '#D1FE17', 'Ember': '#E05C2C', 'Slate': '#6B7280', 'Nude 01': '#D4A89A',
  'Nude 02': '#C4917F', 'Black Cherry': '#3D0C0C', 'Porcelain': '#F9F0E8',
  'Ivory': '#EEE4D2', 'Sand': '#D4B896', 'Warm Beige': '#C8956C', 'Golden': '#B8763A',
  'Caramel': '#8B5E3C', 'Mahogany': '#5C3317', 'Espresso': '#2C1408',
  'Translucent': '#F0EEE8', 'Soft Matte': '#E8E0D4', 'Luminous': '#F5E8C0',
  'Charcoal Black': '#1a1a1a', 'Deep Brown': '#4A2C1A',
  'Solar Gold': '#FFD700', 'Champagne': '#F7E7CE', 'Rose Aurora': '#F4A0B0',
  'Clear': 'rgba(255,255,255,0.3)', 'Baby Pink': '#FBBFD1', 'Rose': '#E8829A',
  'Mauve': '#B77A8E', 'Berry': '#7B3F5E', 'Nude': '#C9947A', 'Peach': '#FFAA80', 'Red': '#CC2200'
};

let currentProduct = null;
let selectedShade = null;
let selectedSize = null;

function getProductIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '½';
  for (let i = full + (half ? 1 : 0); i < 5; i++) s += '☆';
  return s;
}

function renderGallery(product) {
  const mainImg = document.getElementById('gallery-main-img');
  mainImg.src = product.gallery[0];
  mainImg.alt = product.name;

  const thumbsEl = document.getElementById('gallery-thumbs');
  thumbsEl.innerHTML = product.gallery.map((src, i) => `
    <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Image ${i+1}">
      <img src="${src.replace('w=900','w=200')}" alt="${product.name} view ${i+1}" loading="lazy">
    </button>
  `).join('');

  thumbsEl.querySelectorAll('.gallery-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.idx;
      mainImg.src = product.gallery[idx];
      thumbsEl.querySelectorAll('.gallery-thumb').forEach((b, i) => b.classList.toggle('active', i === idx));
    });
  });
}

function renderBadge(tag) {
  const el = document.getElementById('pd-badge');
  if (!tag) { el.style.display = 'none'; return; }
  const cls = tag === 'Sale' ? 'badge-sale' : tag === 'New' ? 'badge-new' : 'badge-bestseller';
  el.className = 'product-badge ' + cls;
  el.textContent = tag;
  el.style.display = '';
}

function renderPricing(product) {
  document.getElementById('pd-price').textContent = luxeFormatPrice(product.price);
  const origEl = document.getElementById('pd-original-price');
  const savEl = document.getElementById('pd-savings');
  if (product.originalPrice) {
    origEl.textContent = luxeFormatPrice(product.originalPrice);
    origEl.style.display = '';
    const pct = Math.round((1 - product.price / product.originalPrice) * 100);
    savEl.textContent = `Save ${pct}%`;
    savEl.style.display = '';
  } else {
    origEl.style.display = 'none';
    savEl.style.display = 'none';
  }
}

function renderShadePicker(product) {
  const wrap = document.getElementById('shade-picker');
  if (!product.shades || product.shades.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  selectedShade = product.shades[0];
  document.getElementById('selected-shade-label').textContent = selectedShade;

  const opts = document.getElementById('shade-options');
  opts.innerHTML = product.shades.map(shade => {
    const hex = SHADE_COLORS[shade] || '#ccc';
    return `<button class="shade-swatch ${shade === selectedShade ? 'active' : ''}" 
      data-shade="${shade}" title="${shade}" 
      style="background:${hex}; border-color: ${hex === '#F9F0E8' || hex === 'rgba(255,255,255,0.3)' ? '#ccc' : hex}"
      aria-label="${shade}"></button>`;
  }).join('');

  opts.querySelectorAll('.shade-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedShade = btn.dataset.shade;
      document.getElementById('selected-shade-label').textContent = selectedShade;
      opts.querySelectorAll('.shade-swatch').forEach(b => b.classList.toggle('active', b.dataset.shade === selectedShade));
    });
  });
}

function renderSizePicker(product) {
  const wrap = document.getElementById('size-picker');
  if (!product.sizes || product.sizes.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  selectedSize = product.sizes[0];
  document.getElementById('selected-size-label').textContent = selectedSize;

  const opts = document.getElementById('size-options');
  opts.innerHTML = product.sizes.map(size => `
    <button class="picker-opt ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</button>
  `).join('');

  opts.querySelectorAll('.picker-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      document.getElementById('selected-size-label').textContent = selectedSize;
      opts.querySelectorAll('.picker-opt').forEach(b => b.classList.toggle('active', b.dataset.size === selectedSize));
    });
  });
}

function renderRating(product) {
  const el = document.getElementById('pd-rating');
  el.innerHTML = `
    <span class="stars" aria-label="${product.rating} stars">${renderStars(product.rating)}</span>
    <span class="avg-score">${product.rating}</span>
    <span class="review-count">(${product.reviewCount.toLocaleString()} reviews)</span>
  `;
}

function renderReviews(product) {
  const el = document.getElementById('pd-reviews-list');
  if (!product.reviews || product.reviews.length === 0) {
    el.innerHTML = '<p style="color:var(--ink-soft)">No reviews yet.</p>';
    return;
  }
  el.innerHTML = product.reviews.map(r => `
    <div class="review-item">
      <div class="review-header">
        <span class="review-name">${r.name}</span>
        <span class="review-stars">${renderStars(r.rating)}</span>
      </div>
      <p class="review-text">"${r.text}"</p>
    </div>
  `).join('');
}

function renderRelated(product) {
  const grid = document.getElementById('related-grid');
  if (!grid) return;
  const related = LUXE_PRODUCTS
    .filter(p => p.id !== product.id && (p.category === product.category || p.tag))
    .slice(0, 4);
  grid.innerHTML = related.map(p => luxeProductCardHTML(p, '../')).join('');
  luxeBindQuickAdd(grid, '../');
}

function renderTabs() {
  document.querySelectorAll('.pd-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
    });
  });
}

function renderATC(product) {
  const qtyInput = document.getElementById('pd-qty');
  const minusBtn = document.getElementById('pd-qty-minus');
  const plusBtn = document.getElementById('pd-qty-plus');
  const atcBtn = document.getElementById('pd-add-to-cart');
  const viewCartBtn = document.getElementById('pd-view-cart');

  minusBtn.addEventListener('click', () => { const v = parseInt(qtyInput.value); if (v > 1) qtyInput.value = v - 1; });
  plusBtn.addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) + 1; });

  atcBtn.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value) || 1;
    const variant = selectedShade || selectedSize || null;
    luxeAddToCart(product.id, qty, variant);
    atcBtn.classList.add('added');
    atcBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added to bag!`;
    viewCartBtn.style.display = 'block';
    setTimeout(() => {
      atcBtn.classList.remove('added');
      atcBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg> Add to bag`;
    }, 2500);
  });
}

function renderBreadcrumb(product) {
  document.getElementById('breadcrumb-name').textContent = product.name;
  document.title = product.name + ' — LUXE';
}

function initProductPage() {
  const id = getProductIdFromUrl();
  const product = LUXE_PRODUCTS.find(p => p.id === id);

  if (!product) {
    document.getElementById('main').innerHTML = `
      <div class="wrap" style="padding:80px 0; text-align:center">
        <h2>Product not found</h2>
        <p style="color:var(--ink-soft);margin:16px 0 28px">This product may have been removed.</p>
        <a href="shop.html" class="btn btn-atc" style="display:inline-flex">Browse products</a>
      </div>`;
    return;
  }

  currentProduct = product;

  renderBreadcrumb(product);
  renderGallery(product);
  renderBadge(product.tag);
  document.getElementById('pd-category').textContent = product.category;
  document.getElementById('pd-name').textContent = product.name;
  renderRating(product);
  renderPricing(product);
  document.getElementById('pd-desc').textContent = product.desc;
  renderShadePicker(product);
  renderSizePicker(product);
  renderATC(product);
  document.getElementById('pd-long-desc').textContent = product.longDesc;
  document.getElementById('pd-ingredients').textContent = product.ingredients;
  renderReviews(product);
  renderTabs();
  renderRelated(product);
}

document.addEventListener('DOMContentLoaded', () => {
  LUXE_PRODUCTS_READY.then(initProductPage);
});
