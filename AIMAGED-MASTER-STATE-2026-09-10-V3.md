# AIMAGED-MASTER-STATE-2026-09-10-V3

## المرجع الحاكم لاستئناف مشروع AI.MAGED

**قاعدة عليا:**
> NO EVIDENCE = NO SUCCESS

**منهج التنفيذ:** خطوة واحدة → دليل من الجهاز/المصدر → قرار → توقف → موافقة على الخطوة التالية.

**هدفنا:** تعظيم فرصة الفوز في Agents for Humans Hackathon عبر مشروع يعمل فعلًا من البداية للنهاية، وليس مجرد موقع جميل أو كود ناقص.

> لا يوجد ضمان للفوز؛ ما نستطيع التحكم فيه هو جودة التنفيذ، مطابقة القواعد، قوة الدليل، وجودة العرض.

---

# 1. ما هو المشروع؟

**اسم المشروع الحالي/المقترح في الـRoadmap:**
AI.Maged — Autonomous Book Publishing Agent

**الفكرة:** وكيل مهني مستقل يحوّل فرصة كتاب إلى نتيجة قابلة للنشر عبر:
Discover → Verify → Decide → Create → Orchestrate → Publish → Verify → Evidence

**Winning Thesis من الـMaster Roadmap:**
- الموقع = واجهة المنتج.
- Strands = طبقة الوكيل واتخاذ القرار واختيار الأدوات.
- n8n = طبقة التنفيذ/التنسيق الحتمي.
- Worker = العمليات الثقيلة على الملفات.
- Publishing adapters = قنوات النشر.
- Evidence/Status = إثبات ما حدث فعليًا.

---

# 2. الأدوار

## ChatGPT — المايسترو
- يخطط.
- يرتب الأولويات.
- يراجع الأدلة.
- يمنع القفزات.
- يقرر متى نصلح ومتى نشغّل.
- لا يعتبر أي نجاح مؤكدًا دون دليل.

## Claude Code — المنفذ
- يعمل فعليًا داخل Windows على المشروع.
- يقرأ الملفات ويعدلها ويشغّل الأوامر عند تكليفه.
- لا يعيد تصميم المشروع من نفسه.
- لا يثبت package أو يغيّر architecture خارج المهمة المحددة والموافقة.

## Claude المستشار — المراقب
- يراجع القرارات.
- يكشف التناقضات والمعلقات التي تم إسقاطها بالخطأ.
- لا يُعامل كمنفذ للجهاز.

## Amazon Quick — منفذ مهام لاحقة محددة
- لا يستبدل Claude Code في تصحيح/تشغيل المشروع.
- مهام محفوظة له في موضعها داخل الخطة: **الفيديو + الصور + الملف الخارجي**، وأي مهام أخرى يحددها الـRoadmap في وقتها.

---

# 3. المسار الفعلي المؤكد

المشروع الذي نعمل عليه الآن:

`C:\Users\shams\Desktop\AI07B4~1.MAG\discovery-agent`

المجلد الأب الظاهر:
`AI.Maged — Autonomous Book Publishing Agent`

الاسم المختصر 8.3 للأب:
`AI07B4~1.MAG`

**قاعدة المسار:** عند وجود شرطات خاصة/مسافات/رموز غير مؤكدة، استخدم `dir /x` أولًا، وأي `cd` يجب أن يصل للمجلد النهائي كاملًا من أول مرة.

---

# 4. ما ثبت فعليًا على الجهاز

داخل `discovery-agent` ثبت وجود:
- `agent.py`
- `golden_run.py`
- `requirements.txt`
- `scoring.py`
- `runs/`

**لم نثبت بعد من هذا المسار وحده حالة النظام الكامل** (Backend / Dashboard / n8n integration / publishing).

---

# 5. حالة Claude Code

آخر نسخة مؤكدة بعد إعادة التشغيل:
`Claude Code v2.1.267`

وظهر:
`Updated to latest.`

هذا تحديث للأداة نفسها، وليس دليلًا على نجاح المشروع.

---

# 6. حالة Strands والحزمة

## تصحيح أمر سابق
الأمر السابق الخطأ:
`pip install strands`

الاسم الرسمي لحزمة Python الأساسية:
`strands-agents`

والـimports المستخدمة داخل SDK تكون مثل:
`from strands import Agent, tool`

التوثيق الرسمي المستخدم للتحقق:
`https://strandsagents.com/docs/user-guide/quickstart/python/`

**ممنوع التثبيت لمجرد أن الحزمة موجودة في الخطة.** يجب أولًا إثبات أن المسار التنفيذي المختار يحتاجها، ثم التثبيت، ثم اختبار حقيقي.

## الحالة الفعلية
الأمر:
`pip show strands-agents`

أعطى:
`WARNING: Package(s) not found: strands-agents`

إذن:
**strands-agents غير مثبتة حاليًا.**

---

# 7. Audit سابق للتعديلات

فحص timestamps داخل المشروع بتاريخ 2026-09-10 أعطى:
**ZERO files modified today.**

أمثلة من آخر تعديل مؤكد:
- README.md — 2026-09-09 00:10:40.472752700 +0300
- agent.py — 2026-09-09 20:26:36.966729400 +0300
- golden_run.py — 2026-09-09 20:26:56.686538900 +0300
- requirements.txt — 2026-09-09 00:10:09.919337800 +0300
- scoring.py — 2026-09-09 20:25:48.498212800 +0300
- runs/ — 2026-09-09 20:30:28.876449100 +0300

### ما يثبت وما لا يثبت
يثبت أن الفحص لم يجد ملفات مشروع معدلة اليوم.
ولا يثبت وحده عدم وجود cache/temp/log artifacts تاريخية خارج المشروع.

في جلسة سابقة ظهر نص فعلي في Claude Code عن `Installing packages` و`Running code` ثم `ModuleNotFoundError: No module named 'strands'`. لاحقًا، في الـAudit، أكد Claude Code أنه لم ينفّذ أمر `pip install` مباشرًا، وأن فحص `pip show strands-agents` أعطى أن الحزمة غير مثبتة. **هذا لا يحسم ما إذا كان Claude Code استخدم آلية تثبيت داخلية أخرى أو ترك أثرًا في cache/temp/logs**؛ لذلك تبقى طريقة/آلية محاولة التثبيت السابقة نفسها **UNVERIFIED**. المؤكد حاليًا فقط: لا توجد حزمة `strands-agents` مثبتة الآن، وفحص timestamps لم يجد ملفات مشروع معدلة في 2026-09-10.

---

### تصحيح حوكمي مهم
- **لا يوجد دليل حالي على تثبيت ناجح لـ`strands-agents`.**
- **لا يوجد دليل حالي على تعديل ملفات المشروع بتاريخ 2026-09-10.**
- **لا يوجد دليل كامل يثبت ما إذا كانت محاولة التثبيت السابقة استخدمت آلية داخلية غير `pip install` أو تركت آثارًا خارج مجلد المشروع.** هذه نقطة UNVERIFIED ولا تُسقط.

# 8. الحالة المثبتة من الكود — `agent.py`

## `strands_available()`
مبلغ عنها في الأسطر 241-246:

```python
def strands_available() -> bool:
    try:
        import strands  # noqa
        return True
    except Exception:
        return False
```

هذا يختبر إمكانية `import strands` فقط.

## `build_strands_agent()`
مبلغ عنها في الأسطر 218-238.

من الجزء المؤكد:
```python
from strands import Agent, tool
```

وتوجد أدوات مرتبطة بـStrands مثل:
- `collect_signals`
- `cluster_problems`
- `assess_rights`

ويُعاد `Agent(...)` بأدواته.

### معلّق raw source / encoding
أحد مخرجات العرض السابقة لم يكن مجرد قلب بصري للـRTL؛ ففحص `repr()` أظهر رموز تلف فعلية `����` داخل التعليقات العربية في `agent.py`. هذا يعني أن هناك **احتمال مشكلة encoding/ترميز حقيقية في الملف أو أثناء القراءة**، وليس من المسموح افتراض أنها مشكلة عرض فقط.

في آخر محاولة، طبع Claude Code بالـ`repr()` الأسطر 218-227 فقط، ثم انقطع الناتج قبل الأسطر 228-238. لذلك **النص الخام الكامل لـ`build_strands_agent()` ما زال غير مغلق بالدليل**، وكذلك لا نملك بعد تحققًا مستقلًا من أن تلف النص العربي لا يؤثر على الملف نفسه.

## `run_discovery()`
مبلغ عنها في `agent.py` بالأسطر 86-191.

ثبت من الفحص:
- لا تستدعي `build_strands_agent()`.
- لا تستدعي ولا تعتمد على `strands_available()`.

---

# 9. الحالة المثبتة من `golden_run.py`

## السطر 33
```python
mode = "STRANDS (real agent)" if agent.strands_available() else "DETERMINISTIC (no Strands yet)"
```

## السطر 41
```python
result = agent.run_discovery(VALIDATION_REQUEST, run_type="logic_validation")
```

### المشكلة المعمارية الحالية
`golden_run.py` يحدد اسم الـmode عبر `strands_available()`، ثم يشغّل `run_discovery()` مباشرة.

وبما أن `run_discovery()` لا تستخدم `build_strands_agent()` ولا `strands_available()`، **يوجد عدم اتساق يحتاج حسمًا**:

1. قد يكون هذا مقصودًا لمسار deterministic/logic validation.
2. أو أن Strands agent موجود لكن غير موصول بمسار التنفيذ الفعلي.

**لم نثبت بعد أي الاحتمالين هو المقصود.**

---

# 10. Golden Path الرسمي المطلوب للمسابقة

الـMaster Roadmap يحدد المسار الذهبي الذي يجب أن يكون مثاليًا:

1. User request.
2. Discover — أدوات حقيقية تجمع المرشحين.
3. Verify — تحقق من مصادر متعددة ورفض التعارض/الضعف.
4. Decide — score/recommendation منظم.
5. Prepare — توليد حزمة المحتوى/الأصول.
6. Orchestrate — تسليم التنفيذ إلى n8n.
7. Publish — قناة نشر موثوقة واحدة على الأقل.
8. Verify result — إثبات publication status.
9. Show evidence — Dashboard يعرض السلسلة كاملة.

**القاعدة:** لا نحتاج عشرات التكاملات؛ نحتاج مسارًا واحدًا موثوقًا end-to-end.

---

# 11. Architecture Contract — المعمارية المستهدفة

```text
AI.MAGED UI
   ↓
STRANDS AGENT
(decision + tools)
   ↓
Discovery Tool / Verification Tool / Content Tool
   ↓
n8n
(orchestration / execution)
   ↓
Worker / Website / Publishers
   ↓
Evidence Store
```

### ملكية كل طبقة

**Strands Agent:**
- reasoning
- tool selection
- decision flow
- structured outputs
- mission/user-facing intent

**n8n:**
- scheduling
- webhooks
- external API chaining
- waiting
- retries
- notifications
- handoff

**Worker:**
- file-heavy operations
- validation
- extraction
- OCR عند الحاجة
- rendering
- asset preparation
- packaging

**Website:**
- product surface
- result/evidence presentation
- ليس هو الوكيل نفسه

**Publishing Layer:**
- channel-specific outputs
- نبدأ بأبسط قناة موثوقة ثم نضيف غيرها بعد استقرار الأولى

---

# 12. MVP الذي لا يجب تجاوزه

### نبني الآن
- Strands agent حقيقي بأدوات حقيقية.
- Discovery tool.
- Verification tool.
- Content generation tool.
- n8n orchestration.
- One processing worker path.
- One publishing path + secondary/simulated adapters عند الحاجة.
- Simple evidence dashboard.
- Public GitHub + README + license.

### لا نبني الآن
- SaaS billing/multi-tenant.
- عشرات التكاملات.
- قاعدة بيانات معقدة.
- تطبيقات هاتف أصلية.
- Kubernetes/microservices everywhere.
- Model training/fine-tuning.
- catalog ضخم.
- personalization متقدم.
- ادعاءات self-learning/self-healing دون تنفيذ مثبت.

---

# 13. عقود الأدوات

**Discovery:**
Input: query/title/topic
Output: candidate list + source URLs + timestamps
Failure: empty result، ولا اختراع candidates.

**Verification:**
Input: candidate + sources
Output: verified/unverified + evidence + confidence
Failure: conflict => reject/escalate.

**Content:**
Input: verified candidate + facts
Output: title + description + SEO metadata + social copy + script
Failure: لا اختلاق حقائق.

**Publish:**
Input: content package
Output: channel status + URL/ID + timestamp
Failure: bounded retries ثم failure مع evidence.

**Status/Evidence:**
Input: task/event
Output: task_id + stage + result + proof
Rule: لا success بدون proof.

---

# 14. Evidence / Observability Contract

كل run يجب أن ينتج task record واحد على الأقل، مع:
- `task_id`
- `request`
- `agent_version`
- `stage`
- `tool_calls`
- `sources`
- `decision`
- `content_outputs`
- `publish_results`
- `errors`
- `retries`
- `cost_estimate`
- `started_at`
- `completed_at`
- `evidence[]`

أمثلة evidence:
- verified source URL
- generated file path/checksum
- publish URL
- external object ID
- timestamp
- API response reference

---

# 15. Dashboard — المطلوب

الـMaster Roadmap يحدد Dashboard مهني بسيط، وليس analytics vanity:

### Sidebar
- Overview
- Discovery
- Jobs
- Content
- Publishing
- System

### Main
- Current Job
- Discover → Verify → Create → Publish → Verified
- Opportunity score
- Sources verified
- Assets generated
- Published links
- System Health
  - Strands
  - n8n
  - Worker
  - Publisher

### القاعدة
يعرض live task state + evidence، ولا يكشف secrets.

---

# 16. قواعد المحتوى والحقوق والأمان

- لا نستخدم/نعرض كتابًا محميًا دون حقوق.
- Demo الأفضل: public-domain / user-owned / synthetic authorized content.
- نسجل provenance للمصدر.
- نستخدم APIs/SDKs مصرحًا بها فقط.
- لا مفاتيح API أو AWS secrets أو publishing credentials أو cookies أو tokens أو passwords في GitHub أو README أو screenshots أو video.
- لو live social integration خطر/بطيء، نستخدم publisher adapter آمنًا/محاكيًا مع التصريح بذلك.

---

# 17. Devpost — متطلبات يجب ألا تضيع

وفق الـMaster Roadmap الذي تم التحقق من قواعد Devpost في 8 سبتمبر 2026:

- المسابقة: Agents for Humans Hackathon — Devpost / AWS.
- المسار المقترح: Professional Agents.
- المشروع يجب أن يكون جديدًا ضمن فترة التقديم، مع الإفصاح عن أي code/work سابق تم دمجه حيث تطلب القواعد.
- Strands Agents SDK يجب أن يكون جزءًا حقيقيًا من implementation.
- يجب أن يعمل المشروع فعليًا ومتسقًا، وأن يطابق ما يقوله الفيديو والوصف.
- Golden path واحد كامل مطلوب.
- Public repository مطلوب.
- MIT أو Apache license مطلوبة وفق الـRoadmap/القواعد المتحققة.
- README يجب أن يشرح المشكلة، المستخدم، architecture، setup، run commands، agent flow، tools، demo path، safety/rights، limitations، والإفصاح عن المكونات السابقة.
- Architecture diagram مطلوب.
- فيديو عام لا يتجاوز 5 دقائق، يوضح المشكلة والجمهور ولماذا تهم، ويُظهر المشروع يعمل end-to-end.
- Strands يجب أن يكون ظاهرًا وجوهريًا.
- يجب اختبار clone/install نظيف أو توثيق fresh-install procedure.
- لا secrets.
- الإنجليزية مطلوبة للنصوص/المواد حيث يلزم.
- الـsubmission يجب أن يكون قبل الموعد المحدد في القواعد الحالية.

### Critical dates المتسجلة من Roadmap (تحتاج إعادة تحقق رسمي عند التنفيذ النهائي)
- AWS credits request cutoff: 11 Sep 2026, 10:00 PM Cairo.
- Final submission: 15 Sep 2026, 3:00 AM Cairo.

**هذه التواريخ مأخوذة من Roadmap متحققة في 8 Sep 2026، ويجب إعادة التحقق من Devpost الرسمي عند الاقتراب من الإرسال.**

---

# 18. معايير التحكيم

المعايير الخمسة متساوية الوزن:
- Technical Implementation
- Design
- Potential Impact
- Creativity & Originality
- Presentation

### أهم ما يرفع النتيجة
- Strands فعلي وغير سطحي.
- أدوات حقيقية.
- structured decisions.
- execution حقيقي.
- evidence حقيقي.
- منتج متماسك، وليس technical demo فقط.
- one reliable end-to-end workflow.
- 5-minute proof-based video.

### ما قد يقتل المشاركة
- موقع جميل مع agent ضعيف/وهمي.
- استخدام n8n كأنه agent مع Strands هامشي.
- claims عن self-learning/self-healing بلا تنفيذ.
- تكاملات كثيرة ناقصة.
- محتوى copyrighted بلا حقوق.
- عدم الإفصاح عن reused code.
- private/broken GitHub.
- فيديو لا يثبت البرنامج.
- عدم وجود دليل على publishing/result.
- تغيير المعمارية باستمرار في آخر 48 ساعة.

---

# 19. الجدول التنفيذي الأصلي في الـMaster Roadmap

### 8 Sep
Freeze concept + audit current assets.

### 9 Sep
Build Strands core.
Mandatory: local agent + at least 2 real tools + structured result.
Kill switch: لا polish إذا Strands ليس genuinely executing.

### 10 Sep
Discovery + verification.
Mandatory: one real candidate + source evidence.
Fallback: deterministic safe dataset إذا verification live غير موثوق.

### 11 Sep
n8n + worker + content pipeline.
Mandatory: Agent → n8n → worker/content result.
Also request AWS credits before cutoff.

### 12 Sep
Publishing + dashboard + deployment.
Mandatory: one complete run creates output + evidence visible + public URL works.

### 13 Sep
README + diagram + 5-minute video + Devpost draft.
Mandatory: submission package ~90% + fresh clone/install test.

### 14 Sep
Final audit + submit.
No risky architecture changes.

**هذه الخطة التاريخية لا تلغي الحالة الفعلية. التنفيذ الحالي متأخر عن بعض البنود، لذلك الأولوية العملية تعاد ترتيبها حسب ما هو مثبت على الجهاز والوقت المتبقي، وليس حسب التاريخ وحده.**

---

# 20. الحالة الحالية الفعلية — لون الإشارة

## GREEN — مثبت
- مسار `discovery-agent`.
- وجود `agent.py`.
- وجود `golden_run.py`.
- وجود `requirements.txt`.
- وجود `scoring.py` و`runs/`.
- `strands_available()` موجود.
- `build_strands_agent()` موجود.
- `run_discovery()` لا يستدعي Strands helpers.
- `golden_run.py` يفحص availability ويشغّل `run_discovery()`.
- `strands-agents` غير مثبتة حاليًا.
- Claude Code v2.1.267.

## YELLOW — يحتاج تحقق/قرار
- raw source الكامل لـ`build_strands_agent()`.
- المقصود المعماري لمسار Strands مقابل deterministic.
- هل الإصلاح المطلوب هو ربط `run_discovery()` بـStrands أم الحفاظ على deterministic validation path مع golden path آخر.
- الحالة الفعلية لـBackend.
- الحالة الفعلية لـDashboard.
- اتصال n8n الفعلي بالمشروع.
- Worker/publisher الفعلي.
- حالة publishing end-to-end.
- حالة evidence store/records.
- حالة public GitHub / license / architecture diagram / clean clone.
- محتوى Devpost الحالي 1/5 والـDraft ما لم يُعاد التحقق منه مباشرة.

## RED — غير مثبت ويمنع ادعاء اكتمال المشروع
- Golden Run end-to-end حقيقي على الجهاز.
- Strands genuinely executing في المسار الذي سيُعرض للمحكم.
- Golden Path من Discovery حتى verified published output.
- Dashboard يعرض evidence حيًا.
- Public deployment + working demo path النهائي.

---

# 21. المعلقات التي لا تُسقط

1. **M1:** raw `build_strands_agent()` لم يُثبت كاملًا؛ `repr()` وصل حتى 227 فقط، مع ظهور `����` فعليًا داخل التعليقات العربية. الأسطر 228-238 ما زالت غير مقروءة بالدليل الخام.
2. **M2:** هل التصميم الحالي intentional deterministic أم ناقص الربط مع Strands؟
3. **M3:** هل توجد آثار تاريخية خارج المشروع من محاولة تثبيت سابقة؟ غير محسوم، دون دليل أنها تؤثر على المشروع.
4. **M4:** Golden Run الحقيقي لم يُثبت.
5. **M5:** باقي النظام (Backend/Dashboard/n8n/Worker/Publishing/Evidence) لم يُثبت كل عنصر منه على حدة.
6. **M6:** الجاهزية النهائية لـDevpost (repo/license/diagram/video/copy/disclosure/fresh clone) تحتاج audit فعلي نهائي.

**قاعدة:** لا يمحى معلّق بسبب Restart أو Update أو جلسة جديدة؛ يفتح فقط بدليل جديد صريح.

---

# 22. خطة التنفيذ من هذه اللحظة

## المرحلة A — حسم Discovery
1. إغلاق M1 إذا لزم.
2. حسم M2 من **الكود + Architecture Contract + Master Roadmap**.
3. لا package install قبل القرار.

## المرحلة B — تنفيذ Strands الحقيقي
إذا أثبت القرار أن Strands يجب أن يكون مسار الوكيل:
- أقل تعديل ممكن.
- Claude Code ينفذ.
- اختبار فعلي.
- إثبات أدوات حقيقية متعددة.

## المرحلة C — Golden Run
- تشغيل فعلي.
- حفظ JSON/evidence.
- التحقق من decision/score/sources/rights path.

## المرحلة D — Golden Path الكامل
- Discovery
- Verification
- Decision
- Content
- n8n
- Worker
- Publish
- Verify result
- Evidence
- Dashboard

## المرحلة E — Public/Submission
- repo
- license
- README
- diagram
- live demo
- video ≤5 min
- disclosure
- clean clone/install
- Devpost

## المرحلة F — Amazon Quick
عندما يصل الـRoadmap للمرحلة المناسبة، Quick ينفذ مهامه المحددة، بما فيها **الفيديو + الصور + الملف الخارجي**، وليس قبل ذلك.

---

# 23. تعليمات التشغيل بين الجلسات

عند فتح جلسة جديدة:

1. استخدم هذا الملف كمرجع الحاكم.
2. استخرج آخر حالة مؤكدة والمعلقات.
3. لا تعتبر Restart/Update بداية جديدة للمشروع.
4. لا تتجاوز معلّقًا لمجرد أن جلسة جديدة بدأت.
5. ابدأ من نقطة الاستئناف الحالية.

**علامة الاستئناف:**
`AIMAGED-MASTER-STATE-2026-09-10-V3`

**نقطة الاستئناف التقنية:**
`discovery-agent` → M1/M2 → قرار Strands → تنفيذ Golden Run → Golden Path الكامل.

---

# 24. قاعدة القرار النهائية

إذا تعارضت هذه الوثيقة مع القواعد الرسمية الحالية للمسابقة:

**القواعد الرسمية الحالية لـDevpost أعلى أولوية.**

إذا تعارضت ذاكرة أي أداة مع دليل الجهاز:

**دليل الجهاز أعلى أولوية.**

إذا لم يوجد دليل:

**UNVERIFIED.**

---

## مصادر الحوكمة الأساسية

1. AI_Maged_Agents_for_Humans_Master_Roadmap.docx — المرجع الداخلي الرئيسي للتنفيذ.
2. AI_Maged_Agents_for_Humans_Master_Roadmap_AR.docx — النسخة العربية/الموازية.
3. Devpost official rules — المصدر الأعلى للقواعد عند التعارض.
4. Strands Agents official docs — للتحقق من SDK والحزم والاستخدام.

