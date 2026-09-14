# 🔍 AI.Maged — Discovery Agent v0.1

أول وكيل في نظام **AI.Maged**: يكتشف فرص كتب رقمية مربحة بناءً على مشاكل حقيقية مدعومة بأدلة قابلة للتحقق.

> **الفكرة الجوهرية:** مش "آلة كتابة كتب" — ده **آلة اكتشاف فرص** (يقرر أين توجد فلوس قبل صناعة المنتج).

## المعمارية
```
INPUT → collect_signals → cluster_problems → assess_rights → SCORE (deterministic) → BUILD/REVIEW/REJECT → JSON → runs/
```
- **Strands = طبقة القرار** (العقل): تستدعي الأدوات وتقرأ الأدلة.
- **محرك التقييم (scoring.py) = deterministic**: القرار النهائي مش من الـ LLM لوحده — لازم Score + أدلة + حقوق.

## الملفات
| الملف | الدور |
|---|---|
| `agent.py` | الوكيل: Golden Path كامل + Strands wrapper |
| `scoring.py` | محرك تقييم الفرصة (7 أبعاد، عتبات، بوابات القرار) |
| `tools/discovery_tools.py` | أدوات: جمع الإشارات، التجميع، تقييم الحقوق |
| `data/demo_signals.json` | بيانات ديمو مصرّح بها (fallback — موسومة demo) |
| `golden_run.py` | أول Regression Test — يشغّل سيناريو كامل ويحفظ JSON |
| `runs/` | سجلات التشغيل (قابلة لإعادة الاختبار) |

## التشغيل
```bash
# الوضع الأساسي (بدون أي تثبيت — يثبت أن المنطق يعمل):
python golden_run.py

# لتفعيل الوكيل الحقيقي بـ Strands:
pip install -r requirements.txt
python golden_run.py     # يكتشف Strands تلقائياً
```

## وضعا التشغيل
- **DETERMINISTIC** (افتراضي، بدون تثبيت): يشغّل الأدوات بالتسلسل ويحسب Score. يطلّع نفس الـ JSON.
- **STRANDS** (بعد `pip install`): الـ LLM يقرر أي أداة يستدعي. نفس عقد الإخراج.

> صُمم كده عمداً عشان الـ Golden Run يشتغل ويطلّع سجل من أول يوم، قبل تثبيت Strands.

## قواعد صارمة (من المواصفة v0.1)
- ممنوع اختراع أدلة أو أرقام.
- BUILD يتطلب: `Score>=70 AND أدلة>=3 AND مصادر مستقلة>=2 AND حقوق آمنة AND لا تعارض`.
- عدم يقين → REVIEW · نقص أدلة → REJECT · حقوق غير واضحة → عقوبة/REJECT.
- ممنوع infinite loop — حد أقصى 2 retries لكل عملية.

## الإفصاح (لمتطلبات المسابقة)
- هذا مشروع **جديد** مبني للمسابقة. الموقع القديم (aimaged-site) يُستخدم كأساس تقني منفصل ويُفصح عنه.
- بيانات الديمو `synthetic_demo` **لا تُستخدم كدليل حقيقي وحدها** — للاختبار فقط.

## الخطوة التالية
1. تشغيل `python golden_run.py` والتأكد من سجل runs/.
2. توصيل **YouTube Data API** كأول Adapter حقيقي (يستبدل بيانات الديمو).
3. بناء **Verification Agent** بعد ثبات Discovery.

**النسخة:** v0.1 · **التاريخ:** 9 سبتمبر 2026 · 🐸 AI.Maged
