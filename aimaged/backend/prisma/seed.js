// Seeds an admin account, one starter ad and homepage copy.
// Run: npx prisma db seed
// Override admin identity:  ADMIN_EMAIL=... ADMIN_PASSWORD=... npx prisma db seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ai.maged.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe!2026';

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'admin' },
    create: { email: ADMIN_EMAIL, passwordHash, provider: 'local', role: 'admin', fullName: 'Admin' },
  });
  console.log(`admin user ready: ${admin.email} (role=${admin.role})`);

  await prisma.ad.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      titleAr: 'أعلن معنا على AI.MAGED',
      titleEn: 'Advertise with AI.MAGED',
      bodyAr: 'مساحة إعلانية قابلة للتخصيص فوق الصفحة الرئيسية.',
      bodyEn: 'A customizable ad slot above the homepage.',
      placement: 'home_top',
      sortOrder: 1,
    },
  });

  for (const locale of ['ar', 'en']) {
    const body =
      locale === 'ar'
        ? {
            hero_title: 'كتب ومعرفة تصنعها الذكاء الاصطناعي',
            hero_subtitle: 'اكتشف كتبًا ودورات مختارة بعناية من منصة AI.MAGED.',
            footer_text: 'AI.MAGED — جميع الحقوق محفوظة.',
          }
        : {
            hero_title: 'Books and knowledge, powered by AI',
            hero_subtitle: 'Discover curated books and courses from the AI.MAGED platform.',
            footer_text: 'AI.MAGED — All rights reserved.',
          };
    await prisma.pageContent.upsert({
      where: { key_locale: { key: 'home', locale } },
      update: { body },
      create: { key: 'home', locale, title: locale === 'ar' ? 'الرئيسية' : 'Home', body },
    });
  }
  console.log('starter ads + homepage copy ready');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
