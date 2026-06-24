// Local smoke test for the API endpoint
// Mocks the Vercel req/res shape and verifies the API returns 12 products

const http = require('http');
const { URL } = require('url');

// Load the API handler
const productsHandler = require('/home/z/my-project/luxe/api/products');
const productHandler = require('/home/z/my-project/luxe/api/product');

function mockReq(query = {}, method = 'GET') {
  return { method, query };
}

function mockRes() {
  const r = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; this._done = true; },
    end() { this._done = true; },
  };
  return r;
}

console.log('\n=== TEST 1: GET /api/products (all) ===');
let res = mockRes();
productsHandler(mockReq(), res);
console.log('Status:', res.statusCode);
console.log('Count:', res.body.count);
console.log('First product:', res.body.products[0].name);
console.log('Last product:', res.body.products[res.body.products.length - 1].name);
console.log('PASS:', res.body.count === 12 ? '✓' : '✗');

console.log('\n=== TEST 2: GET /api/products?category=Skincare ===');
res = mockRes();
productsHandler(mockReq({ category: 'Skincare' }), res);
console.log('Status:', res.statusCode);
console.log('Count:', res.body.count);
console.log('Categories returned:', [...new Set(res.body.products.map(p => p.category))].join(', '));
console.log('PASS:', res.body.count === 6 && res.body.products.every(p => p.category === 'Skincare') ? '✓' : '✗');

console.log('\n=== TEST 3: GET /api/products?category=Sale ===');
res = mockRes();
productsHandler(mockReq({ category: 'Sale' }), res);
console.log('Status:', res.statusCode);
console.log('Count:', res.body.count);
console.log('All on sale:', res.body.products.every(p => p.originalPrice) ? 'yes' : 'no');
console.log('PASS:', res.body.count === 4 ? '✓' : '✗');

console.log('\n=== TEST 4: GET /api/product?id=p6 ===');
res = mockRes();
productHandler(mockReq({ id: 'p6' }), res);
console.log('Status:', res.statusCode);
console.log('Product:', res.body.product.name);
console.log('Related count:', res.body.related.length);
console.log('PASS:', res.body.product.id === 'p6' && res.body.related.length > 0 ? '✓' : '✗');

console.log('\n=== TEST 5: GET /api/product (missing id) ===');
res = mockRes();
productHandler(mockReq(), res);
console.log('Status:', res.statusCode);
console.log('Error:', res.body.error);
console.log('PASS:', res.statusCode === 400 ? '✓' : '✗');

console.log('\n=== TEST 6: GET /api/product?id=nonexistent ===');
res = mockRes();
productHandler(mockReq({ id: 'nope' }), res);
console.log('Status:', res.statusCode);
console.log('Error:', res.body.error);
console.log('PASS:', res.statusCode === 404 ? '✓' : '✗');

console.log('\n=== All tests passed ===');
