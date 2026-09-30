# AI.MAGED — ملف التسليم الشامل (HANDOVER)

> تاريخ التسليم: 2026-09-28 · مُعَدّ لماجد ليكون المالك الكامل تقنيًا وتشغيليًا.
> الهدف: أن تشغّل/تبني/تنشر/تطوّر/تنقل المشروع بالكامل **بدون الرجوع لأي مطوّر أو أداة**.
> **لا يوجد أي قفل أو اعتماد مخفي**: كل الكود والأصول وقاعدة البيانات والإعدادات ملكك ومكشوفة هنا.

---

## 0) النشر الإنتاجي الحالي (مباشر على الإنترنت) — مُحدَّث 2026-09-30

**الموقع حيّ الآن:** `https://aimaged.com` (عربي) و `https://aimaged.com/en` (إنجليزي) — لوحة التحكم: `https://aimaged.com/admin/login`
(Redirect تلقائي من `http://` ومن IP القديم `51.21.195.43` ما زال يعمل أيضًا.)

| البند | القيمة |
|---|---|
| الدومين | **`aimaged.com`** — مسجَّل باسمك عبر AWS Route 53 في 2026-09-30 (16$/سنة، التجديد التلقائي mفعّل، ينتهي 2027-09-30، حماية الخصوصية mفعّلة). بيانات المسجِّل: Majed Mokpel / magedmokpel87@gmail.com / ‎+20 1228951330 / القاهرة |
| DNS | Hosted Zone في Route 53 برمز `Z05744112LZTBRD2FCPC` — سجلّا A: `aimaged.com` و `www.aimaged.com` → `51.21.195.43` |
| HTTPS | شهادة Let's Encrypt حيّة (تنتهي 2026-12-29 وتُجدَّد تلقائيًا عبر cron على الخادم). الشهادة داخل volume `aimaged_certbot_conf`، والمسار `/etc/letsencrypt/live/aimaged.com/` |
| الخادم | AWS EC2 `i-03f969bb3690b8df4` (m7i-flex.large) — منطقة ستوكهولم eu-north-1 — Ubuntu 26.04 |
| IP عام | `51.21.195.43` |
| SSH | `ssh -i "C:\Users\shams\Desktop\amazon server\1OpenClaw-Key.pem" ubuntu@51.21.195.43` |
| كود الإنتاج | على الخادم في `~/aimaged` (نفس كود هذا المجلد) |
| ملف أسرار الإنتاج | `~/aimaged/.env` على الخادم (تم إنشاؤه بأسرار جديدة قوية — ليس نسخة الـenv القديمة). `PUBLIC_URL=https://aimaged.com` |
| تشغيل | `cd ~/aimaged && docker compose -f docker-compose.prod.yml up -d` (Postgres + Backend + Frontend + nginx) |
| nginx | `deploy/nginx.conf` (نسخة HTTPS في هذا المجلد = نفس الملف على الخادم): 80 يحوّل لـ443، و443 يوزّع `/api/` و`/uploads/` على الـbackend و الباقي على الـfrontend |
| البيانات | داخل Docker volumes: `aimaged_pgdata` (قاعدة البيانات) و `aimaged_uploads` (الملفات المرفوعة) — تبقى حتى بعد إعادة البناء |
| المنافذ | 80 و 443 مفتوحان في Security Group (`launch-wizard-1`) — إضافة فقط — لم يُمسّ أي قاعدة قديمة |
| مشاريع أخرى على نفس السرفر | n8n (:5678) و ollama (:11434) و OpenClaw gateway (:18789) — لم تُمس، والمنصة الجديدة لا تتعارض معها |
| GitHub | فرع `release/ec2-cms` فيه الكود الكامل بدون أسرار؛ فرع `main` أُزيلت منه ملفات `.env` من التتبع (لكن الأسرار القديمة ما زالت في التاريخ — **يجب تغييرها**، قسم 5) |
| SEO | robots.txt + sitemap.xml ديناميكي + Meta/OG/hreflang + JSON-LD (WebSite/Book) — كلها تعمل على `https://aimaged.com` |

**معادلة إعادة النشر بعد أي تعديل (من جهازك، من داخل مجلد `aimaged/`):**
```bash
tar czf /tmp/aimaged-src.tgz --exclude=node_modules --exclude=.next --exclude=backend/uploads --exclude=backend/.env --exclude=frontend/.env.local .
cat /tmp/aimaged-src.tgz | ssh -i "C:\Users\shams\Desktop\amazon server\1OpenClaw-Key.pem" ubuntu@51.21.195.43 'tar xzf - -C ~/aimaged && cd ~/aimaged && docker compose -f docker-compose.prod.yml build && docker compose -f docker-compose.prod.yml up -d'
# لو أضفت migration جديدًا:
# ssh ... 'cd ~/aimaged && docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy'
```

**نسخة احتياطية يومية مقترحة (على الخادم):**
```bash
docker exec aimaged-postgres-1 pg_dump -U aimaged aimaged > ~/backup-$(date +%F).sql
```

**لدخول لوحة التحكم حاليًا:** `Majed@domain.com` / `u9JV9KALVSbUjeY26d` — غيّرها من داخل اللوحة فورًا واطلب استبدال البريد ببريدك الحقيقي (عن طريق إعادة تشغيل الـseed أو تعديل جدول User).

**جوجل — تم ✅ (2026-09-30):** الموقع مُسجَّل في Google Search Console كـ"Domain property" لـ `aimaged.com` تحت حسابك magedmokpel87@gmail.com، والتحقق تم تلقائيًا عبر DNS (سجل TXT `google-site-verification=...` مضاف في Route 53 — **لا تحذفه** وإلا يفقد التحقق)، و`sitemap.xml` أُرسل واستُقبل بنجاح. جوجل يبدأ الفهرسة تدريجيًا (أيام إلى أسابيع). ستصلك التقارير على Search Console.

---

موقع + قاعدة بيانات + **لوحة تحكم كاملة** لإدارة المحتوى والكتب والإعلانات، والتغييرات من اللوحة تظهر **مباشرة** على الموقع بدون تعديل كود.

- إضافة نماذج بيانات جديدة: `Ad` (إعلانات)، `PageContent` (نصوص الصفحات)، وتوسيع `Product` (حقول `kind`, `featured`، وجعل `affiliateUrl` اختياريًا).
- رفع الصور/الملفات من اللوحة (multer) وتقديمها كملفات ثابتة عبر `/uploads/...`.
- واجهات `/admin`: تسجيل دخول المدير، إدارة الكتب (CRUD + غلاف مرفوع)، إدارة الإعلانات (حسب الموضع)، محرّر محتوى الصفحات.
- الصفحة العامة الرئيسية تقرأ من قاعدة البيانات عبر SSR (`getServerSideProps`) فتظهر التعديلات فورًا، ثنائية اللغة (عربي/إنجليزي).
- حساب مدير + بيانات أولية جاهزة عبر Seed.
- migration مُصدَّر ومختبَر: يبنى مخطط قاعدة البيانات كاملًا من الصفر (تم التحقق على قاعدة فارغة).

---

## 2) ما تملكه بالضبط (Inventory)

| العنصر | المكان / القيمة | ملاحظات |
|---|---|---|
| كود الموقع كاملًا (Source) | مجلّد `aimaged/` في هذا الريبو | backend + frontend + n8n |
| الريبو / Git | `github.com/magedmokpel87-pixel/ai.maged` (فرع `main`) | **حسابك أنت** على GitHub |
| قاعدة البيانات | PostgreSQL 16 | عبر `docker-compose`، البيانات في volume `pgdata` |
| Schema + Migration | `backend/prisma/schema.prisma` + `backend/prisma/migrations/0_init_cms_admin_features/` | قابل لإعادة البناء من الصفر ✓ |
| البيئة/الأسرار | `backend/.env` و `frontend/.env.local` (على جهازك) + قوالب `.env.example` | انظر القسم 5 |
| ملفات أُرفعت من اللوحة | `backend/uploads/` | مجلَّد كـvolume في compose |
| الأصول/الصور | داخل الريبو + `backend/uploads/` | — |
| البناء والنشر | `docker-compose.yml` + `backend/Dockerfile` + `frontend/Dockerfile` | أوامر في القسم 6 |
| التوثيق | `README.md` + هذا الملف | — |

---

## 3) خريطة الملفات

```
aimaged/
├── HANDOVER.md              ← هذا الملف
├── docker-compose.yml       ← تشغيل كل الخدمات معًا
├── README.md                ← وصف API ولوحة التحكم
├── backend/                 ← Express + Prisma + PostgreSQL (منفذ 4000)
│   ├── .env                 ← إعداداتك الفعلية (لا تُرفع لـGit)
│   ├── .env.example         ← قالب بالمتغيرات المطلوبة
│   ├── Dockerfile           ← node:20-bookworm-slim
│   ├── uploads/             ← الصور/الملفات المرفوعة من اللوحة
│   ├── prisma/
│   │   ├── schema.prisma     ← كل النماذج
│   │   ├── seed.js           ← حساب المدير + بيانات أولية
│   │   └── migrations/       ← الـmigration المُصدَّر (قابل لإعادة البناء)
│   └── src/
│       ├── index.js          ← ربط كل المسارات + تقديم /uploads
│       ├── routes/           ← auth, products, orders, ads, pages, uploads, n8n
│       ├── middleware/auth.js← requireAuth / requireRole(admin)
│       └── config/db.js       ← عميل Prisma
└── frontend/                ← Next.js 14 صفحات راوتر (منفذ 3000)
    ├── .env.local           ← إعداداتك الفعلية
    ├── .env.example         ← قالب
    ├── Dockerfile           ← node:20-bookworm-slim (ARG للنسخة العامة)
    ├── lib/api.js           ← عنوان الـAPI + إدارة التوكن
    ├── components/          ← Header, AdBanner, AdminLayout
    └── pages/
        ├── index.js         ← الرئيسية (تقرأ من DB عبر SSR)
        ├── product/[id].js
        ├── checkout.js
        └── admin/           ← login, index, books, ads, pages
```

---

## 4) بيانات الدخول الحالية (مهمة — اقرأها)

- **لوحة التحكم:** http://localhost:3000/admin/login
  - البريد: `Majed@domain.com`
  - كلمة المرور: `iPpZyz-fvrAmqWHE`  *(وُلّدت عشائيًا لهذه الجلسة — غيّرها الآن، القسم 4.1)*
  - الدور: `admin`
- **قاعدة البيانات (افتراضيات docker-compose، ليست أسرارًا مخفية):**
  - user `aimaged` / password `aimaged_password` / db `aimaged` / منفذ `5432`

### 4.1 تغيير كلمة مرور المدير
الطريقة الأسهل: سجّل دخولك، أو أنشئ توكنًا واحذف الحساب القديم وأضف جديدًا. للتحديث المباشر من سطر الأوامر:
```bash
# ولّد hash جديد وابدله في جدول User
docker compose run --rm -T -e DATABASE_URL="postgresql://aimaged:aimaged_password@postgres:5432/aimaged?schema=public" backend node -e '
const b=require("bcryptjs"),{PrismaClient}=require("@prisma/client"),p=new PrismaClient();
(async()=>{const h=await b.hash(process.env.NEWPW,10);
await p.user.update({where:{email:process.env.AEMAIL},data:{passwordHash:h}});
console.log("updated");await p.$disconnect();})();'
# ثم مرّر NEWPW=A and AEMAIL=Majed@domain.com عبر -e
```
أو استبدل القيم في `.env` (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) وأعد تشغيل `node prisma/seed.js` (يحدّث الدور ولا يغيّر كلمة مرور موجودة؛ الأفضل حذف الصف ثم الـseed).

---

## 5) المتغيّرات البيئية (Environment Variables)

> ### ⚠️ إجراء أمني مطلوب الآن
> ملفّا `backend/.env` و`frontend/.env.local` **مُتتبَّعان حاليًا في Git** (أسرارك موجودة في تاريخ مستودع GitHub: `JWT_SECRET` وكلمة مرور القاعدة وأي مفاتيح). إضافة `.gitignore` الجديد تمنع تتبّعها مستقبلًا فقط، لكن النصيب القديم يبقى في التاريخ.
> Steps to close this hole:
> 1) **غيّر كل الأسرار فورًا** (JWT_SECRET جديد، كلمة مرور PostgreSQL مختلفة، أي مفتاح API مكشوف).
> 2) Untrack (without deleting from disk): `git rm --cached aimaged/backend/.env aimaged/frontend/.env.local`
> 3) Create from examples again `cp .env.example .env` and put in new values.
> 4) (اختياري متقدم) لمسح الأسرار من التاريخ بالكامل يلزم إعادة كتابة التاريخ (`git filter-repo`/BFG) — عملية تهدم السجل ويجب تنفيذها باتفاق، ثم **تدوير كل الأسرار** تبقى ضرورية على أي حال.

هذه الملفات على جهازك فعلًا: `backend/.env` و `frontend/.env.local`. (لم أُطالع محتوياتها احترامًا لسياسة حماية الأسرار — افتحها بنفسك للتأكد.) القيم المطلوبة موثّقة في `.env.example`.

### backend/.env
| المتغيّر | المعنى | قيمة افتراضية/مثال |
|---|---|---|
| `DATABASE_URL` | نص اتصال PostgreSQL | `postgresql://aimaged:aimaged_password@localhost:5432/aimaged?schema=public` (محليًا) أو `@postgres:` داخل compose |
| `JWT_SECRET` | سرّ توقيع التوكن | **ضع نصًا عشوائيًا طويلًا** |
| `PORT` | منفذ الـAPI | `4000` |
| `FRONTEND_URL` | أصل الواجهة (لـCORS) | `http://localhost:3000` |
| `UPLOAD_DIR` | مجلد المرفوعات | `./uploads` (أو `/app/uploads` داخل الحاوية) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | يُستخدمان فقط في `seed.js` | — |
| `N8N_API_KEY` | سرّ مشترك لاستدعاءات n8n | — |

### frontend/.env.local
| المتغيّر | المعنى |
|---|---|
| `NEXT_PUBLIC_API_BASE` | العنوان الذي يراه **المتصفح** للوصول للـAPI (يُخبى وقت البناء) |
| `INTERNAL_API_BASE` | العنوان الذي تستخدمه **خوادم Next** (اسم الخدمة `http://backend:4000` داخل compose) |

---

## 6) التشغيل / البناء / النشر / النسخ الاحتياطي

### 6.1 التشغيل محليًا (Docker) — الوضع الحالي
```bash
cd aimaged
cp backend/.env.example backend/.env         # املأ القيم (خصوصًا JWT_SECRET)
cp frontend/.env.example frontend/.env.local
docker compose up -d --build postgres backend frontend
docker compose exec backend npx prisma migrate deploy
docker compose exec backend node prisma/seed.js   # (اختياري) يعيد ضبط البيانات الأولية
```
- الموقع: http://localhost:3000 · لوحة التحكم: http://localhost:3000/admin
- الـAPI: http://localhost:4000 · الفحص: http://localhost:4000/health

> ملاحظة بناء: صورتا backend/frontend مبنيتان على `node:20-bookworm-slim` لأن محركات Prisma تحتاج OpenSSL (على Alpine كانت تفشل). هذا ثابت في الـDockerfiles.

### 6.2 قاعدة البيانات معزولة فقط
```bash
docker compose up -d postgres
```

### 6.3 النسخ الاحتياطي والاسترجاع
```bash
# نسخة احتياطية (SQL كامل)
docker exec aimaged-postgres-1 pg_dump -U aimaged -d aimaged -F c -f /tmp/aimaged.dump
docker cp aimaged-postgres-1:/tmp/aimaged.dump ./backup_$(date +%F).dump
# استرجاع في قاعدة جديدة
docker cp ./backup_DATE.dump aimaged-postgres-1:/tmp/r.dump
docker exec aimaged-postgres-1 pg_restore -U aimaged -d aimaged --clean /tmp/r.dump
```
ولا تنسَ نسخ `backend/uploads/` (الصور المرفوعة) — هي على الهوست وليست داخل القاعدة.

### 6.4 النشر على خادم (Deploy)
هذا **غير منفّذ بعد** (انظر القسم 8). عند وجود خادمك:
```bash
# على الخادم
git clone https://github.com/magedmokpel87-pixel/ai.maged.git && cd ai.maged/aimaged
cp backend/.env.example backend/.env   # ضع DATABASE_URL و JWT_SECRET الحقيقيين
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
docker compose exec backend node prisma/seed.js
```
للواجهة العامة على دومين حقيقي: ابنِ الـfrontend بـ`NEXT_PUBLIC_API_BASE=https://api.نطاقك` (مثلاً عبر `docker compose build --build-arg frontend`) وضع `FRONTEND_URL` في backend بنفس النطاق.

---

## 7) الصلاحيات ونماذج البيانات

- الأدوار في `User.role`: `customer | admin | affiliate_manager`. الكتابة في الكتب والإعلانات والمحتوى محميّة بـ`requireRole('admin', ...)`.
- **Product**: `kind` (book/course/product), `featured`, و`affiliateUrl` اختياري (كتب تُباع مباشرة بلا رابط عمولة). الحذف **soft** (يُعطَّل `active=false`).
- **Ad**: `placement` (`home_top|home_bottom|product_page`), ترتيب، تفعيل، ونافذة زمن اختيارية `startsAt/endsAt`. الواجهة العامة تعرض النشط فقط.
- **PageContent**: مفتاح + لغة → نص حر (`body`) لتعديل ألسن الصفحات بدون كود.

لمراجعة الـAPI كاملًا: `README.md` § نقاط الدخول.

---

## 8) الأمانة الفنية — ما هو حقيقي وما هو متبقٍّ

حتى تكون الصورة واضحة تمامًا:

- ✅ كل ما في القسم 1 يعمل **محليًا عبر Docker** وتم اختباره فعليًا (دخول، إنشاء كتاب من اللوحة، رفع صورة وعرضها، إنشاء إعلان وعرضه في موضعَيه، تعديل نص الصفحة وظهر مباشرة، عربي/إنجليزي).
- ⚠️ **لا يوجد نشر حيّ موثّق**: النطاق `ai.maged` لم يُثبت أنه يعمل، ولم أتعرّف على استضافة قيد التشغيل أثناء الفحص. كل شيء الآن على جهازك عبر Docker.
- ⚠️ **الاستضافة والدومين وقاعدة الإنتاج وGitHub**: يجب أن تكون **تحت حساباتك أنت**. GitHub موجود (`magedmokpel87-pixel`). الدومين/الخادم لم أتحقق من ملكيتهما — إن أردت النشر الفعلي أحتاج وصولاً لحساب الاستضافة والدومين الخاص بك.
- ⏳ غير مبني عمدًا: بوابة دفع حقيقية (Stripe/Paymob/Fawry)، الاختبارات الآلية، والتحقق الفعلي من Google/Facebook idToken في `routes/auth.js` (يوجد NOTE).

---

## 9) نقل المشروع لمطوّر آخر (بدونك وبدوني)

1. امنح وصولاً للريبو على GitHub (أو سلّم نسخة `zip` كاملة من `aimaged/`).
2. سلّمه `backend/.env` و`frontend/.env.local` عبر مدير أسرار آمن (لا ترسلهما في الشات/الإيميل).
3. شغّل القسم 6.1 — الـmigration يعيد بناء القاعدة من الصفر (مُختبَر).
4. غيّر `JWT_SECRET` وبيانات المدير وكلمات مرور قاعدة البيانات.

بهذا يكون أي مطوّر قادرًا على البناء والتشغيل دون الرجوع لأحد.

---

## 10) قرارات ينبغي أن تتخذها الآن

- [ ] تغيير كلمة مرور `Majed@domain.com` وكلمة مرور قاعدة البيانات الافتراضية.
- [ ] تأكيد ملكية/حالة الدومين `ai.maged` والاستضافة (أو اختيار مزوّد).
- [ ] اختيار بوابة الدفع حسب سوقك.
- [ ] تفعيل نسخ احتياطي دوري (cron لـ`pg_dump` + نسخ `uploads/`).
- [ ] نقل الأسرار من ملفات `.env` إلى Secret Manager قبل الإنتاج.
