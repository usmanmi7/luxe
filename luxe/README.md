# LUXE — Beauty & Cosmetics Ecommerce Site

A clean, editorial-styled ecommerce front-end for a beauty/cosmetics brand. Built with plain HTML, CSS, and JavaScript — no build step, no framework, no dependencies.

**Colors:** `#D1FE17` (lime accent), `#0A0A0A` (ink/black), `#FAFAF8` (white/paper)

## What's included

- **Landing page** (`index.html`) — 5 sections: hero, shop-by-category, bestsellers, brand story, testimonials + newsletter
- **Shop page** (`pages/shop.html`) — full catalog with category filtering (Skincare / Makeup / All)
- **About page** (`pages/about.html`) — brand story, values, team
- **Contact page** (`pages/contact.html`) — contact form, info, FAQ accordion
- **Cart & Checkout** (`pages/cart.html`) — cart with quantity controls, a checkout form, and an order confirmation screen. This is a **UI-only demo flow** — no real payment is processed and no backend is involved. The cart persists in the browser's `localStorage`.

## Project structure

```
luxe/
├── index.html
├── vercel.json
├── css/
│   ├── style.css      # global styles, design tokens, header/footer, product grid
│   ├── landing.css     # landing-page-only sections (hero, categories, story, testimonials)
│   └── inner.css       # shared styles for shop/about/contact/cart pages
├── js/
│   ├── cart.js         # product data + localStorage cart logic (shared everywhere)
│   ├── main.js          # landing page rendering + newsletter forms
│   ├── shop.js          # shop page filtering/rendering
│   ├── checkout.js      # cart + checkout + confirmation flow
│   └── contact.js       # contact form demo submission
├── pages/
│   ├── shop.html
│   ├── about.html
│   ├── contact.html
│   └── cart.html
└── images/
    └── manifest.md     # source list for the Unsplash images used
```

## Running locally

No build tools needed. From the project folder, run any static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

(Opening `index.html` directly by double-clicking also works for browsing, though a local server is recommended so relative paths and any future fetch calls behave correctly.)

## Deploying — GitHub + Vercel

### 1. Push to GitHub

```bash
cd luxe
git init
git add .
git commit -m "Initial commit — LUXE ecommerce site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is easiest).
2. Click **Add New → Project**.
3. Import the GitHub repo you just pushed.
4. Framework preset: choose **Other** (this is a static site, no build step).
5. Leave Build Command and Output Directory blank.
6. Click **Deploy**.

Vercel will give you a live URL (e.g. `your-repo.vercel.app`) within about a minute. Every push to `main` will auto-redeploy.

## Notes on images

Product and hero images are hotlinked from Unsplash's free CDN (`images.unsplash.com`) — see `images/manifest.md` for the full source list and photographer credits. If you'd rather use your own product photography, replace the `img` URLs in `js/cart.js` (product catalog) and the `<img src="...">` tags in the HTML files.

## Notes on the cart/checkout

This is a front-end demo: the cart is stored in `localStorage`, and "Place order" generates a fake order ID and clears the cart — no real payment is taken and no order is actually sent anywhere. To wire up real payments, you'd connect the checkout form to a payment processor (e.g. Stripe Checkout) and a backend or serverless function (Vercel supports serverless functions natively if you want to add this later).
