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
| POST | `/api/auth/login` | دخول بريد/كلمة مرور |
| POST | `/api/auth/oauth` | دخول جوجل/فيسبوك (بعد التحقق من idToken في الواجهة) |
| GET | `/api/products` | قائمة المنتجات + بحث |
| GET | `/api/products/:id` | صفحة منتج |
| POST | `/api/orders` | إتمام الشراء |
| POST | `/api/n8n/trigger` | تشغيل Workflow (Admin) |
| POST | `/api/n8n/callback` | استقبال نتيجة الـWorkflow من n8n |

## قبل الإنتاج (Production Checklist)

- [ ] تفعيل HTTPS وربط الدومين www.AiMaged.com
- [ ] التحقق الفعلي من Google/Facebook idToken في `routes/auth.js` (السطر به ملاحظة NOTE)
- [ ] نقل الأسرار (JWT_SECRET, N8N_API_KEY, ANTHROPIC_API_KEY) إلى Secret Manager وليس ملفات .env
- [ ] ضبط نسخ احتياطي دوري لقاعدة postgres
- [ ] مراجعة حقوق الاستخدام لكل Affiliate API قبل عرض صورها/بياناتها
- [ ] اختبار كامل لتدفق n8n (trigger → AI → SEO → callback) قبل تفعيله على منتجات حقيقية

## ما هو غير مكتمل عمدًا

هذا نظام كامل وقابل للتشغيل الفعلي (End-to-End)، لكنه أساس إنتاجي وليس تطبيقًا
جاهزًا بمعنى "بدون أي إضافة" — تحتاج عمليًا: بوابة دفع فعلية (Stripe/Paymob/Fawry حسب
السوق المستهدف)، صفحة إدارة (Admin Dashboard) لإدارة المنتجات والإعلانات، واختبارات
آلية (tests). هذه غير موجودة في هذه النسخة ولم تُذكر صراحة في مذكرتك أو الرسم المرفق،
فلو حبيت أضيفها قولّي.
