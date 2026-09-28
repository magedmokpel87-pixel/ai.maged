# AI.MAGED — منصة أتمتة مدعومة بالذكاء الاصطناعي

نظام كامل: Frontend (Next.js ثنائي اللغة AR/EN) + Backend (Node/Express + PostgreSQL) + n8n (منسق العمليات) + تكامل AI.

## المعمارية المعتمدة (بعد تصحيح التداخل)

```
Frontend (Next.js)
       │
       ▼
Backend (Auth + Business Logic + API)
       │
   ┌───┴────┐
   ▼        ▼
PostgreSQL   n8n (Orchestrator)
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
       AI   Affiliate   SEO
             APIs     Workflows
                │
                ▼
      Backend API (/api/n8n/callback)
                │
                ▼
           PostgreSQL
```

**القاعدة الذهبية:** n8n لا يكتب في قاعدة البيانات مباشرة أبدًا. أي نتيجة يرجعها workflow
تمر عبر `POST /api/n8n/callback` في الـBackend، حتى تبقى الصلاحيات والتحقق من البيانات
مركزية في مكان واحد.

`AIService` (في `backend/src/services/aiService.js`) هو استثناء فقط لعمليات AI
مباشرة لا تمر عبر n8n — وليس مكونًا إلزاميًا.

## هيكل المشروع

```
aimaged/
├── frontend/          Next.js — الهيدر، الصفحة الرئيسية، صفحة المنتج، صفحة الشراء
├── backend/           Express API — Auth, Products, Orders, n8n trigger/callback
│   └── prisma/schema.prisma   نموذج البيانات (User, Product, Order, WorkflowRun)
├── n8n-workflows/     ملف analyze-product.json جاهز للاستيراد في n8n
└── docker-compose.yml تشغيل كل الخدمات معًا (Postgres + Backend + Frontend + n8n)
```

## التشغيل محليًا (Docker)

```bash
cp backend/.env.example backend/.env      # عدّل القيم (JWT_SECRET, DATABASE_URL, ...)
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- n8n: http://localhost:5678 (admin / change_me — غيّرها فورًا)

بعد أول تشغيل:

```bash
docker compose exec backend npx prisma migrate dev --name init
```

ثم من واجهة n8n: Import → اختر `n8n-workflows/analyze-product.json`، وأضف الـCredentials
الخاصة بـAnthropic API ومفتاح الـAffiliate API.

## نقاط الدخول الأساسية في الـAPI

| Method | Endpoint | الوصف |
|---|---|---|
| POST | `/api/auth/register` | تسجيل مستخدم جديد |
| POST | `/api/auth/login` | دخول بريد/كلمة مرور (يرجع `role`) |
| POST | `/api/auth/oauth` | دخول جوجل/فيسبوك (بعد التحقق من idToken في الواجهة) |
| GET | `/api/products` | قائمة المنتجات النشطة + بحث + فلتر `kind` |
| GET | `/api/products/all` | كل المنتجات (بما فيها المتوقفة) — Admin |
| GET | `/api/products/:id` | صفحة منتج |
| POST | `/api/orders` | إتمام الشراء |
| GET | `/api/ads?placement=` | إعلانات نشطة حسب الموضع (عام) |
| GET/POST/PUT/DELETE | `/api/ads[/:id]` | إدارة الإعلانات — Admin (`/api/ads/all` يشمل المتوقفة) |
| GET | `/api/pages/:key?locale=` | نص صفحة قابل للتعديل (عام) |
| GET/PUT | `/api/pages[/:key]` | إدارة محتوى الصفحات — Admin |
| POST | `/api/uploads` | رفع صورة/ملف (multipart `file`) — Admin، يرجع `{url}` |
| DELETE | `/api/uploads/:filename` | حذف ملف مرفوع — Admin |
| GET | `/uploads/:file` | تقديم الملفات المرفوعة statically |
| POST | `/api/n8n/trigger` | تشغيل Workflow (Admin) |
| POST | `/api/n8n/callback` | استقبال نتيجة الـWorkflow من n8n |

## لوحة التحكم (Admin Dashboard)

المسار `/admin` في الـFrontend. الدخول عبر `/admin/login` بحساب `role=admin`.
كل البيانات تُقرأ من قاعدة البيانات عبر الـAPI، فأي تعديل من اللوحة يظهر مباشرة
على الموقع بدون إعادة بناء الكود (الصفحة الرئيسية تستخدم `getServerSideProps`).

الإدارة المتاحة:
- **الكتب / المنتجات** (`/admin/books`): إنشاء/تعديل/إيقاف/حذف، رفع الغلاف، سعر، عربي/إنجليزي.
- **الإعلانات** (`/admin/ads`): وضع الإعلان (أعلى/أسفل الرئيسية أو صفحة المنتج)، ترتيب، تفعيل/إيقاف.
- **محتوى الصفحات** (`/admin/pages`): تعديل نصوص الرئيسية (hero/footer...) لكل لغة بدون لمس الكود.

نماذج البيانات المضافة في Prisma: `Ad`، `PageContent`، وتوسيع `Product`
(`kind`, `featured`, `affiliateUrl` أصبح اختياريًا). الملفات المرفوعة تُخزَّن في
`backend/uploads/` (مجَلَّد كـvolume في docker-compose).

لإنشاء حساب المدير لأول مرة:
```bash
docker compose exec backend node prisma/seed.js      # يستخدم ADMIN_EMAIL/ADMIN_PASSWORD من .env
```

## قبل الإنتاج (Production Checklist)

- [ ] تفعيل HTTPS وربط الدومين www.AiMaged.com
- [ ] التحقق الفعلي من Google/Facebook idToken في `routes/auth.js` (السطر به ملاحظة NOTE)
- [ ] نقل الأسرار (JWT_SECRET, N8N_API_KEY, ANTHROPIC_API_KEY) إلى Secret Manager وليس ملفات .env
- [ ] ضبط نسخ احتياطي دوري لقاعدة postgres
- [ ] مراجعة حقوق الاستخدام لكل Affiliate API قبل عرض صورها/بياناتها
- [ ] اختبار كامل لتدفق n8n (trigger → AI → SEO → callback) قبل تفعيله على منتجات حقيقية

## ما هو غير مكتمل عمدًا

لوحة التحكم (Admin Dashboard) وإدارة الكتب والإعلانات ومحتوى الصفحات أصبحت
موجودة وتعمل. الذي ما زال ناقصًا عمليًا للنسخة الإنتاجية: بوابة دفع فعلية
(Stripe/Paymob/Fawry حسب السوق المستهدف)، اختبارات آلية (tests)، وربط
Google/Facebook idToken بالتحقق الفعلي في `routes/auth.js`.
