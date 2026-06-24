// ==========================================================================
// LUXE — /api/product
// Vercel serverless function: returns a single product by id
// Usage: /api/product?id=p6
// ==========================================================================

const products = require('../data/products.json');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const id = req.query && req.query.id;
  if (!id) {
    res.status(400).json({ error: 'Missing product id. Usage: /api/product?id=p1' });
    return;
  }

  const product = products.products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: `Product '${id}' not found` });
    return;
  }

  // Also return up to 4 related products (same category or has a tag)
  const related = products.products
    .filter(p => p.id !== product.id && (p.category === product.category || p.tag))
    .slice(0, 4);

  res.status(200).json({ product, related });
};
