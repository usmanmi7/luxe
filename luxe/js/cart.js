/* ==========================================================================
   LUXE — shared product data + cart logic (localStorage-backed)
   ========================================================================== */

const LUXE_PRODUCTS = [
  {
    id: 'p1',
    name: 'Velvet Lift Serum',
    category: 'Skincare',
    price: 58,
    originalPrice: 72,
    img: 'https://images.unsplash.com/photo-1569385210018-127685230669?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1569385210018-127685230669?w=900&q=85',
      'https://images.unsplash.com/photo-1618330834871-dd22c2c226ca?w=900&q=85',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=900&q=85'
    ],
    desc: 'A weightless vitamin C serum that brightens and firms with daily use. Cold-pressed botanicals, zero filler.',
    longDesc: 'Formulated with 15% L-Ascorbic Acid at a pH of 3.5 — the clinically effective window — this serum absorbs in under 30 seconds and works while you sleep. Zero silicone, zero filler, no greasy film. After 4 weeks, 94% of testers saw measurable improvement in skin tone evenness.',
    ingredients: 'Aqua, Ascorbic Acid 15%, Niacinamide 5%, Hyaluronic Acid, Panthenol, Ferulic Acid, Tocopherol, Rosa Canina Fruit Oil, Glycerin.',
    tag: 'Sale',
    shades: null,
    sizes: ['15ml', '30ml', '50ml'],
    rating: 4.8,
    reviewCount: 312,
    reviews: [
      { name: 'Aanya R.', rating: 5, text: 'Replaced three steps in my routine. My skin has never looked this even.' },
      { name: 'Priya M.', rating: 5, text: 'I\'ve tried every vitamin C on the market. This is the only one that doesn\'t oxidize after two weeks.' },
      { name: 'Dilani K.', rating: 4, text: 'Great results, takes a few days to adjust but worth it.' }
    ]
  },
  {
    id: 'p2',
    name: 'Matte Muse Lipstick',
    category: 'Makeup',
    price: 32,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1600852306771-c963331af110?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600852306771-c963331af110?w=900&q=85',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=85',
      'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=900&q=85'
    ],
    desc: 'Long-wear matte in bold, editorial shades. Highly pigmented, low drag, zero feathering.',
    longDesc: 'Eight hours of transfer-proof wear with a weightless matte finish that never dries out or creases. Formulated with jojoba esters and vitamin E for comfort without compromise. Our shades are designed to work across all skin tones — tested on 40+ people before each color launches.',
    ingredients: 'Isononyl Isononanoate, Jojoba Esters, Synthetic Wax, Tocopheryl Acetate, Mica, Carmine.',
    tag: 'New',
    shades: ['Acid', 'Ember', 'Slate', 'Nude 01', 'Nude 02', 'Black Cherry'],
    sizes: null,
    rating: 4.7,
    reviewCount: 198,
    reviews: [
      { name: 'Ishara D.', rating: 5, text: 'The Acid shade is unlike anything else on the market. I get stopped on the street.' },
      { name: 'Nadia F.', rating: 5, text: 'Stays on through meals. Genuinely transfer-proof.' },
      { name: 'Ruwanthi J.', rating: 4, text: 'Great pigment, very comfortable for a matte.' }
    ]
  },
  {
    id: 'p3',
    name: 'Bare Glow Foundation',
    category: 'Makeup',
    price: 44,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85',
      'https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=900&q=85',
      'https://images.unsplash.com/photo-1569385210018-127685230669?w=900&q=85'
    ],
    desc: 'Buildable, skin-like coverage that never separates. 24 shades, all undertones, all day.',
    longDesc: 'Buildable from sheer to medium coverage with a natural skin-like finish. Won\'t separate, won\'t oxidize, won\'t cake into fine lines. Our 24-shade range covers cool, neutral and warm undertones across all depths. Each shade is tested for 12 hours of wear.',
    ingredients: 'Aqua, Cyclopentasiloxane, Glycerin, Dimethicone, Niacinamide, Zinc Oxide, Titanium Dioxide, Iron Oxides.',
    tag: 'Bestseller',
    shades: ['Porcelain', 'Ivory', 'Sand', 'Warm Beige', 'Golden', 'Caramel', 'Mahogany', 'Espresso'],
    sizes: ['30ml'],
    rating: 4.6,
    reviewCount: 445,
    reviews: [
      { name: 'Tara S.', rating: 5, text: 'Finally a foundation that doesn\'t oxidize by noon. 24-shade range is no joke.' },
      { name: 'Maya L.', rating: 4, text: 'Lovely finish, matched my shade on the first try.' },
      { name: 'Leila H.', rating: 5, text: 'Skin-like is not an exaggeration. Looks like my face but better.' }
    ]
  },
  {
    id: 'p4',
    name: 'Citrine Clay Mask',
    category: 'Skincare',
    price: 38,
    originalPrice: 48,
    img: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=900&q=85',
      'https://images.unsplash.com/photo-1569385210018-127685230669?w=900&q=85',
      'https://images.unsplash.com/photo-1618330834871-dd22c2c226ca?w=900&q=85'
    ],
    desc: 'A mineral-rich detox mask that draws out impurities without stripping the skin barrier.',
    longDesc: 'Kaolin and bentonite clays draw out excess oil and congestion while squalane and allantoin keep the skin barrier intact. No tightness, no redness, no irritation — just clearer pores in 15 minutes. Suitable for sensitive and acne-prone skin.',
    ingredients: 'Kaolin, Bentonite, Aqua, Glycerin, Squalane, Allantoin, Niacinamide, Zinc PCA, Panthenol.',
    tag: 'Sale',
    shades: null,
    sizes: ['50ml', '100ml'],
    rating: 4.5,
    reviewCount: 167,
    reviews: [
      { name: 'Chen W.', rating: 5, text: 'My pores are visibly smaller after two weeks of weekly use.' },
      { name: 'Asel K.', rating: 4, text: 'No irritation even on my sensitive skin. A rare find.' },
      { name: 'Fatima R.', rating: 5, text: 'Best clay mask I\'ve tried. Doesn\'t leave my skin feeling dry.' }
    ]
  },
  {
    id: 'p5',
    name: 'Silk Veil Setting Powder',
    category: 'Makeup',
    price: 29,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1581182815808-b6eb627a8798?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581182815808-b6eb627a8798?w=900&q=85',
      'https://images.unsplash.com/photo-1600852306771-c963331af110?w=900&q=85',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=85'
    ],
    desc: 'A featherweight translucent powder that blurs pores without looking powdery.',
    longDesc: 'Milled to 5 microns — finer than most prestige powders — this setting powder blurs pores and controls shine for up to 8 hours. Translucent formula works across all skin tones. Vegan, talc-free.',
    ingredients: 'Mica, Silica, Boron Nitride, Bismuth Oxychloride, Lauroyl Lysine, Tocopheryl Acetate.',
    tag: null,
    shades: ['Translucent', 'Soft Matte', 'Luminous'],
    sizes: null,
    rating: 4.4,
    reviewCount: 89,
    reviews: [
      { name: 'Sana M.', rating: 5, text: 'Makes my makeup last all day without that chalky look.' },
      { name: 'Jess T.', rating: 4, text: 'Lightweight and truly blurs. My go-to finishing step.' },
      { name: 'Kiri A.', rating: 4, text: 'Works well as a base and to set. Great value.' }
    ]
  },
  {
    id: 'p6',
    name: 'Hydra Bounce Moisturizer',
    category: 'Skincare',
    price: 52,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1618330834871-dd22c2c226ca?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618330834871-dd22c2c226ca?w=900&q=85',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=900&q=85',
      'https://images.unsplash.com/photo-1569385210018-127685230669?w=900&q=85'
    ],
    desc: 'A barrier-repairing gel-cream with hyaluronic layers for 72-hour hydration.',
    longDesc: 'Three molecular weights of hyaluronic acid work at different skin depths — surface, mid, and deep — for plumping hydration that lasts 72 hours in a single application. Ceramide complex repairs and maintains the skin barrier. Fragrance-free, suitable for all skin types.',
    ingredients: 'Aqua, Glycerin, Sodium Hyaluronate (3 MW), Ceramide NP, Ceramide AP, Ceramide EOP, Niacinamide, Panthenol, Allantoin.',
    tag: 'Bestseller',
    shades: null,
    sizes: ['30ml', '50ml'],
    rating: 4.9,
    reviewCount: 521,
    reviews: [
      { name: 'Mei L.', rating: 5, text: 'I wake up and my skin is still plump. Nothing else has done that.' },
      { name: 'Sara K.', rating: 5, text: 'My dry patches are gone after one week. Incredible.' },
      { name: 'Bea N.', rating: 5, text: 'Layered under SPF and it holds moisture all day.' }
    ]
  },
  {
    id: 'p7',
    name: 'Charcoal Precision Liner',
    category: 'Makeup',
    price: 24,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=900&q=85',
      'https://images.unsplash.com/photo-1600852306771-c963331af110?w=900&q=85',
      'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=900&q=85'
    ],
    desc: 'An ultra-fine felt tip for a crisp, waterproof line every time.',
    longDesc: 'A 0.1mm felt tip delivers control usually reserved for professional makeup artists. Waterproof, smudge-proof, and sweat-resistant. Ink lasts 12 hours without fading or transferring. Available in Charcoal Black and Deep Brown.',
    ingredients: 'Aqua, Acrylates Copolymer, Carbon Black, Phenoxyethanol, Glycerin.',
    tag: null,
    shades: ['Charcoal Black', 'Deep Brown'],
    sizes: null,
    rating: 4.6,
    reviewCount: 134,
    reviews: [
      { name: 'Kim P.', rating: 5, text: 'The finest tip I\'ve found. Perfect for tight-lining.' },
      { name: 'Ana G.', rating: 5, text: 'Waterproof means waterproof. Wore it to a wedding in the rain.' },
      { name: 'Lena V.', rating: 4, text: 'Great control. Dries fast and doesn\'t smudge.' }
    ]
  },
  {
    id: 'p8',
    name: 'Golden Hour Highlighter',
    category: 'Makeup',
    price: 36,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85',
      'https://images.unsplash.com/photo-1581182815808-b6eb627a8798?w=900&q=85'
    ],
    desc: 'A pressed duo-chrome powder that catches light without glitter fallout.',
    longDesc: 'Finely-milled mica and boron nitride give this highlighter a lit-from-within glow with zero shimmer particles or fallout. The duo-chrome shifts from gold to champagne in different lights. Buildable from subtle to statement.',
    ingredients: 'Mica, Boron Nitride, Silica, Dimethicone, Tocopheryl Acetate, Bismuth Oxychloride.',
    tag: 'New',
    shades: ['Solar Gold', 'Champagne', 'Rose Aurora'],
    sizes: null,
    rating: 4.7,
    reviewCount: 203,
    reviews: [
      { name: 'Zara P.', rating: 5, text: 'Looks like I have naturally luminous skin. No chunky glitter.' },
      { name: 'Nina T.', rating: 5, text: 'The duo-chrome shift is stunning. Everyone asks what I\'m wearing.' },
      { name: 'Hana S.', rating: 4, text: 'Buildable and blendable. Love the Solar Gold.' }
    ]
  },
  {
    id: 'p9',
    name: 'Retinol Reset Night Cream',
    category: 'Skincare',
    price: 64,
    originalPrice: 80,
    img: 'https://images.unsplash.com/photo-1648249969490-44f3052a3721?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1648249969490-44f3052a3721?w=900&q=85',
      'https://images.unsplash.com/photo-1618330834871-dd22c2c226ca?w=900&q=85',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=900&q=85'
    ],
    desc: 'A 0.5% encapsulated retinol night cream that resurfaces without irritation.',
    longDesc: 'Encapsulated retinol breaks down gradually on skin to deliver 0.5% active retinol over 8 hours — dramatically reducing the irritation, peeling, and redness of traditional retinol. Paired with ceramides and squalane for a barrier-first approach to resurfacing.',
    ingredients: 'Aqua, Encapsulated Retinol 0.5%, Squalane, Ceramide NP, Glycerin, Niacinamide, Shea Butter, Allantoin.',
    tag: 'Sale',
    shades: null,
    sizes: ['30ml', '50ml'],
    rating: 4.8,
    reviewCount: 276,
    reviews: [
      { name: 'Olivia K.', rating: 5, text: 'Zero irritation even on my reactive skin. This is the one.' },
      { name: 'Sofia R.', rating: 5, text: 'Fine lines are visibly reduced after 6 weeks. Genuinely shocked.' },
      { name: 'Aria W.', rating: 4, text: 'Gentle and effective. A rare combination for retinol.' }
    ]
  },
  {
    id: 'p10',
    name: 'Cloud Skin Eye Cream',
    category: 'Skincare',
    price: 46,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=900&q=85',
      'https://images.unsplash.com/photo-1569385210018-127685230669?w=900&q=85',
      'https://images.unsplash.com/photo-1618330834871-dd22c2c226ca?w=900&q=85'
    ],
    desc: 'A whipped peptide eye cream for dark circles, puffiness, and fine lines.',
    longDesc: 'Palmitoyl tripeptide-1 and argireline work on expression lines while caffeine and cucumber extract reduce puffiness and dark circles. A light-diffusing base makes the under-eye look brighter immediately — and gets better with use.',
    ingredients: 'Aqua, Palmitoyl Tripeptide-1, Argireline, Caffeine, Cucumis Sativus Extract, Niacinamide, Hyaluronic Acid, Glycerin.',
    tag: 'New',
    shades: null,
    sizes: ['15ml'],
    rating: 4.5,
    reviewCount: 112,
    reviews: [
      { name: 'Chloe B.', rating: 5, text: 'My dark circles are actually lighter. Didn\'t expect this to work.' },
      { name: 'Elena M.', rating: 4, text: 'The immediate brightening is real. Great for mornings.' },
      { name: 'Hana W.', rating: 5, text: 'Light texture, sinks right in. No milia, no pilling.' }
    ]
  },
  {
    id: 'p11',
    name: 'Lip Plump Gloss',
    category: 'Makeup',
    price: 22,
    originalPrice: null,
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85',
      'https://images.unsplash.com/photo-1600852306771-c963331af110?w=900&q=85',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=85'
    ],
    desc: 'A non-sticky plumping gloss with 3% peptide complex for fuller lips over time.',
    longDesc: 'Immediate plumping from capsaicin (mild, no burn) plus long-term volume from a 3% lip-peptide complex. Eight shades from bare to bold — all non-sticky, all high-shine. Squalane base keeps lips hydrated, not dry.',
    ingredients: 'Hydrogenated Polyisobutene, Squalane, Polybutene, Lip Peptide Complex 3%, Capsicum Frutescens Extract, Mica.',
    tag: null,
    shades: ['Clear', 'Baby Pink', 'Rose', 'Mauve', 'Berry', 'Nude', 'Peach', 'Red'],
    sizes: null,
    rating: 4.3,
    reviewCount: 88,
    reviews: [
      { name: 'Mia T.', rating: 5, text: 'Not sticky at all. Stays glossy for hours.' },
      { name: 'Dana S.', rating: 4, text: 'Subtle plumping but real. My lips look fuller after 2 weeks.' },
      { name: 'Rosa L.', rating: 4, text: 'Great for layering over lipstick. The Rose shade is perfect.' }
    ]
  },
  {
    id: 'p12',
    name: 'AHA Glow Toner',
    category: 'Skincare',
    price: 34,
    originalPrice: 42,
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85',
      'https://images.unsplash.com/photo-1569385210018-127685230669?w=900&q=85',
      'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=900&q=85'
    ],
    desc: '7% glycolic acid toner that exfoliates, brightens, and preps skin for actives.',
    longDesc: '7% glycolic acid at pH 3.7 dissolves dead skin cells and unclogs pores without physical scrubbing. Rose water and aloe vera balance the exfoliation so skin never feels stripped. Use 3x weekly to start, increase to daily as tolerated.',
    ingredients: 'Rosa Damascena Flower Water, Glycolic Acid 7%, Aloe Barbadensis Leaf Juice, Niacinamide, Sodium PCA, Allantoin.',
    tag: 'Sale',
    shades: null,
    sizes: ['100ml', '200ml'],
    rating: 4.6,
    reviewCount: 194,
    reviews: [
      { name: 'Petra N.', rating: 5, text: 'My texture issues are gone after a month. Skin is smooth and bright.' },
      { name: 'Layla M.', rating: 5, text: 'Gentle enough to use regularly. The rose water smell is a bonus.' },
      { name: 'Ines B.', rating: 4, text: 'Great exfoliant. No irritation, just results.' }
    ]
  }
];

const CART_KEY = 'luxe_cart_v1';

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
document.addEventListener('DOMContentLoaded', () => {
  luxeUpdateCartCount();
  luxeInitNav();
  luxeInitReveal();
});
