import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // ─── Default Settings ────────────────────────────────────────────────
  const existing = await prisma.setting.findFirst();
  if (!existing) {
    await prisma.setting.create({
      data: {
        siteName: 'One Health',
        email: 'hello@onehealth.com',
        maintenanceMode: false,
        footer: '© 2026 One Health. All rights reserved.',
      },
    });
    console.log('  ✓ Default settings created');
  } else {
    console.log('  · Settings already exist — skipping');
  }

  // ─── Default Categories ──────────────────────────────────────────────
  const categories = [
    { name: 'Health', slug: 'health', description: 'General health and wellness topics' },
    { name: 'Environment', slug: 'environment', description: 'Environmental health and sustainability' },
    { name: 'Animal Health', slug: 'animal-health', description: 'Veterinary and wildlife health' },
    { name: 'Research', slug: 'research', description: 'Latest research and scientific findings' },
    { name: 'Policy', slug: 'policy', description: 'Health policy and governance' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ✓ ${categories.length} default categories seeded`);

  // ─── Super Admin ─────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@onehealth.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail, deletedAt: null },
  });

  if (!existingAdmin) {
    const passwordHash = await argon2.hash(adminPassword);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
        isVerified: true,
      },
    });
    console.log(`  ✓ Super admin created: ${adminEmail}`);
    console.log(`    ⚠  Change the default password immediately after first login`);
  } else {
    console.log(`  · Super admin already exists (${adminEmail}) — skipping`);
  }

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    const events = [
      {
        title: 'Annual Zoonotic Pathogens Symposium',
        slug: 'annual-zoonotic-pathogens-symposium',
        description:
          'Undergraduate presentations on the architectural spillover mechanics resulting from aggressive deforestation in the Amazon basin.',
        startsAt: new Date('2026-09-14T09:00:00Z'),
        status: 'UPCOMING' as const,
        isFeatured: true,
        imageUrl:
          'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Estuary Soil Sampling Field Project',
        slug: 'estuary-soil-sampling-field-project',
        description:
          'Longitudinal data collection trip to map nitrate runoff and soil health variance across primary agricultural zones.',
        startsAt: new Date('2026-10-02T08:00:00Z'),
        status: 'UPCOMING' as const,
        isFeatured: true,
        imageUrl:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Spring Publication Defense',
        slug: 'spring-publication-defense',
        description:
          'Graduating student members successfully presented peer-reviewed marine ecosystems research to the faculty board.',
        startsAt: new Date('2026-05-21T14:00:00Z'),
        status: 'PAST' as const,
        isFeatured: true,
        imageUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Antimicrobial Resistance Workshop',
        slug: 'antimicrobial-resistance-workshop',
        description:
          'Data modeling workshop utilizing machine learning to track agricultural antibiotic overuse across regional farms.',
        startsAt: new Date('2026-04-10T10:00:00Z'),
        status: 'PAST' as const,
        isFeatured: true,
        imageUrl:
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
    ];
    await prisma.event.createMany({ data: events });
    console.log(`  ✓ ${events.length} sample events seeded`);
  }

  const excoCount = await prisma.excoMember.count();
  if (excoCount === 0) {
    const members = [
      {
        name: 'Dr. Alana Martinez',
        role: 'President & Ecologist',
        description: 'Leading global health intersection studies across multiple universities.',
        initials: 'AM',
        colorClass: 'bg-[#B3DEE2] text-slate-700',
        sortOrder: 0,
      },
      {
        name: 'Julian Harper',
        role: 'VP / Wildlife Biologist',
        description:
          'Specializing in zoonotic spillover tracking and protecting wildlife-human boundaries.',
        initials: 'JH',
        colorClass: 'bg-[#CCD5AE] text-slate-700',
        sortOrder: 1,
      },
      {
        name: 'Sanaa Kwei',
        role: 'Research Lead',
        description: 'Directing environmental impact studies and microplastic research initiatives.',
        initials: 'SK',
        colorClass: 'bg-amber-300 text-amber-900',
        sortOrder: 2,
      },
      {
        name: 'Oliver Bennett',
        role: 'Student Outreach',
        description: 'Managing collaborative society chapters across local and digital campuses.',
        initials: 'OB',
        colorClass: 'bg-[#8a9478] text-white',
        sortOrder: 3,
      },
    ];
    await prisma.excoMember.createMany({ data: members });
    console.log(`  ✓ ${members.length} executive members seeded`);
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
