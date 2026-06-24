// ==========================================================================
// LUXE — Database seed script
// Seeds 12 products + an admin user (you'll set the admin email via env)
// ==========================================================================

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

// Load the existing products.json (the "database" from the static site)
const productsPath = join(process.cwd(), 'luxe', 'data', 'products.json');
const productsData = JSON.parse(readFileSync(productsPath, 'utf8'));

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('Seeding products...');

  // Wipe existing data (safe in dev — NEVER run in prod without backup)
  await db.review.deleteMany();
  await db.cartItem.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.address.deleteMany();
  await db.product.deleteMany();
  // Don't delete users — preserve any signups. But create admin if missing.

  // Seed products
  for (const p of productsData.products) {
    await db.product.create({
      data: {
        slug: slugify(p.name),
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice || null,
        img: p.img,
        gallery: p.gallery || [p.img],
        desc: p.desc,
        longDesc: p.longDesc,
        ingredients: p.ingredients,
        tag: p.tag || null,
        shades: p.shades || [],
        sizes: p.sizes || [],
        rating: p.rating || 0,
        reviewCount: p.reviewCount || 0,
        stock: 100, // default stock for now
        active: true,
        reviews: {
          create: (p.reviews || []).map(r => ({
            name: r.name,
            rating: r.rating,
            text: r.text,
          })),
        },
      },
    });
    console.log(`  ✓ ${p.id}: ${p.name}`);
  }

  // Seed admin user — only if ADMIN_EMAIL env is set
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxe.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.user.create({
      data: {
        email: adminEmail,
        name: 'LUXE Admin',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`  ✓ Admin user: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log(`  - Admin already exists: ${adminEmail}`);
  }

  console.log('\nDone. Summary:');
  console.log('  Products:', await db.product.count());
  console.log('  Reviews:', await db.review.count());
  console.log('  Users:', await db.user.count());
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
