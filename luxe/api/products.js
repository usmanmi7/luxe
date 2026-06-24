// ==========================================================================
// LUXE — /api/products
// Vercel serverless function: returns all 12 products from the JSON database
// (data/products.json) — read-only catalog endpoint
// ==========================================================================

const products = require('../data/products.json');

module.exports = (req, res) => {
  // CORS-friendly (Vercel same-origin by default, but explicit doesn't hurt)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Optional category filter: /api/products?category=Skincare
  // Optional tag filter: /api/products?tag=Sale
  let items = products.products;
  const { category, tag } = req.query || {};
  if (category && category !== 'All') {
    if (category === 'Sale') {
      items = items.filter(p => p.originalPrice);
    } else {
      items = items.filter(p => p.category === category);
    }
  }
  if (tag) {
    items = items.filter(p => p.tag === tag);
  }

  res.status(200).json({
    version: products.version,
    updated: products.updated,
    count: items.length,
    products: items
  });
};
