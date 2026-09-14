"""
AI.Maged — Discovery Agent | Tools (الأدوات)
أدوات جمع الإشارات + تحليلها. مطابقة للمواصفة v0.2 (القسم 2 المصادر، 3 الأدلة، 4 الحقوق).

فلسفة التصميم:
- كل أداة ترجّع أدلة (evidence) قابلة لإعادة الفحص، مش استنتاجات.
- في MVP: مصدر Synthetic/Demo مسموح كـ fallback (موسوم source_type="*_demo") — للاختبار فقط.
- بنية جاهزة لتوصيل YouTube Data API (أول Adapter حقيقي) لاحقاً بدون تغيير الواجهة.

هذه الدوال تُغلّف كـ Strands @tool في agent.py.
"""
from __future__ import annotations
import json
import os
from datetime import datetime, timezone

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

# v0.2 — وسوم المصادر الاصطناعية (Synthetic/Demo)
_DEMO_MARKERS = ("synthetic_demo",)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _is_synthetic(source_type: str) -> bool:
    """v0.2 — يحدد إن كان المصدر اصطناعياً (demo). أي source_type ينتهي بـ _demo أو synthetic."""
    st = (source_type or "").lower()
    return st.endswith("_demo") or st in _DEMO_MARKERS or "synthetic" in st


def _grade_evidence(source_type: str, relevance: float) -> str:
    """
    v0.2 — evidence_grade: تمييز قوة الدليل.
    A = دليل قوي حي قابل للتحقق (API رسمي + relevance عالية)
    B = دليل جيد حي (web/marketplace)
    C = دليل ضعيف/غير مباشر
    D = Synthetic/Demo (لا يُحتسب كإثبات طلب حقيقي)
    """
    if _is_synthetic(source_type):
        return "D"
    st = (source_type or "").lower()
    official_api = st in ("youtube", "reddit")
    if official_api and relevance >= 0.8:
        return "A"
    if st in ("youtube", "reddit", "web", "public_web", "kobo", "marketplace"):
        return "B"
    return "C"


def _load_demo_dataset(topic: str) -> list[dict]:
    """
    يحمّل بيانات الديمو المصرّح بها من data/demo_signals.json (fallback للاختبار).

    v0.2 — إصلاح منطق الـ fallback:
    عدم وجود تطابق مع الـ topic => يرجع [] (empty result).
    ممنوع الرجوع لكل بيانات الديمو عند عدم التطابق (كان خطأ في v0.1).
    """
    path = os.path.join(DATA_DIR, "demo_signals.json")
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    # فلترة حسب الموضوع (تطابق كلمات مفتاحية بسيط)
    topic_words = {w.lower() for w in topic.split() if len(w) > 2}
    matched = []
    for item in data.get("signals", []):
        hay = (item.get("excerpt", "") + " " + item.get("topic", "")).lower()
        if topic_words and any(w in hay for w in topic_words):
            matched.append(item)
    # v0.2: لا fallback لكل البيانات — عدم التطابق = نتيجة فارغة
    return matched


def collect_signals(topic: str, market: list[str] | None = None,
                    time_window_days: int = 90, max_items: int = 30) -> dict:
    """
    الأداة 1 — جمع إشارات الألم/الطلب حول موضوع.
    المواصفة v0.2 القسم 2 (المصادر) + 3 (الأدلة + evidence_grade).

    في v0.2: يقرأ من demo dataset مصرّح به مع تطابق الموضوع فقط.
    عند توصيل YouTube API لاحقاً، استبدل محتوى هذه الدالة مع الحفاظ على شكل الـ return.

    Returns: {"topic","retrieved_at","evidence":[...],"counts":{...},"data_mode":...}
    """
    raw = _load_demo_dataset(topic)[:max_items]
    evidence = []
    for it in raw:
        st = it.get("source_type", "synthetic_demo")
        rel = float(it.get("relevance", 0.5))
        evidence.append({
            "source_type": st,
            "source_url": it.get("source_url", ""),
            "source_id": it.get("source_id", ""),
            "retrieved_at": _now_iso(),
            "signal_type": it.get("signal_type", "pain"),
            "excerpt": it.get("excerpt", "")[:280],
            "relevance": rel,
            "confidence": float(it.get("confidence", 0.5)),
            "evidence_grade": _grade_evidence(st, rel),   # v0.2
        })
    # عدّ المصادر المستقلة (distinct source_type أو domain)
    distinct_sources = {e["source_type"] for e in evidence}
    return {
        "topic": topic,
        "market": market or ["global"],
        "retrieved_at": _now_iso(),
        "evidence": evidence,
        "counts": {
            "evidence_items": len(evidence),
            "independent_sources": len(distinct_sources),
            "by_signal": _count_by(evidence, "signal_type"),
            "by_grade": _count_by(evidence, "evidence_grade"),   # v0.2
        },
        "data_mode": detect_data_mode(evidence),                 # v0.2
    }


def detect_data_mode(evidence: list[dict]) -> str:
    """
    v0.2 — data_mode: LIVE / SYNTHETIC_DEMO / MIXED.
    LIVE = كل الأدلة حية · SYNTHETIC_DEMO = كلها اصطناعية · MIXED = خليط.
    """
    if not evidence:
        return "SYNTHETIC_DEMO"
    synth = [_is_synthetic(e.get("source_type", "")) for e in evidence]
    if all(synth):
        return "SYNTHETIC_DEMO"
    if not any(synth):
        return "LIVE"
    return "MIXED"


def _count_by(items: list[dict], key: str) -> dict:
    out: dict[str, int] = {}
    for it in items:
        out[it.get(key, "?")] = out.get(it.get(key, "?"), 0) + 1
    return out


def cluster_problems(evidence: list[dict]) -> dict:
    """
    الأداة 2 — تجميع الأدلة في مشاكل متكررة (clustering بسيط بالكلمات المفتاحية).
    المواصفة: CLUSTER PROBLEMS في الـ Golden Path.
    """
    clusters: dict[str, list[dict]] = {}
    for e in evidence:
        key = e.get("signal_type", "pain")
        clusters.setdefault(key, []).append(e)
    summary = [
        {"cluster": k, "size": len(v),
         "sample_excerpt": v[0].get("excerpt", "") if v else ""}
        for k, v in sorted(clusters.items(), key=lambda kv: -len(kv[1]))
    ]
    return {"clusters": summary, "cluster_count": len(summary)}


# ── v0.2 — Rights Classification Gate ─────────────────────────────────
# الحالات الخمس المعتمدة (المواصفة v0.2 القسم 4)
RIGHTS_CLASSES = ("OWNED", "AUTHORIZED", "PUBLIC_DOMAIN", "AFFILIATE", "UNKNOWN")

# الحالات التي تسمح بإنتاج المحتوى (content production)
RIGHTS_ALLOW_CONTENT = ("OWNED", "AUTHORIZED", "PUBLIC_DOMAIN")


def assess_rights(topic: str, product_type: str = "ebook") -> dict:
    """
    الأداة 3 — Rights Classification Gate (المواصفة v0.2 القسم 4).
    يرجّع تصنيفاً من RIGHTS_CLASSES + المسار المقترح (content_production | affiliate).

    محافظ: أي شيء غير واضح => UNKNOWN (ممنوع BUILD لإنتاج المحتوى).
    """
    lowered = (topic or "").lower()

    public_domain_signals = ["public domain", "ملكية عامة", "creative commons"]
    owned_signals = ["own", "ملكي", "user-owned", "original", "self-written", "مملوك"]
    authorized_signals = ["licensed", "authorized", "مرخص", "مصرح", "بإذن"]

    if any(s in lowered for s in public_domain_signals):
        return {"rights_status": "PUBLIC_DOMAIN", "product_path": "content_production",
                "note": "مادة ملكية عامة مؤكدة"}
    if any(s in lowered for s in owned_signals):
        return {"rights_status": "OWNED", "product_path": "content_production",
                "note": "مادة مملوكة لماجد"}
    if any(s in lowered for s in authorized_signals):
        return {"rights_status": "AUTHORIZED", "product_path": "content_production",
                "note": "مادة مرخّصة/بإذن موثّق"}

    # مسار الأفيليت: لا إنتاج محتوى محمي — ترويج ورابط شراء فقط
    if product_type == "affiliate":
        return {"rights_status": "AFFILIATE", "product_path": "affiliate",
                "note": "أفيليت — ترويج ورابط شراء فقط، بدون نسخ أو إعادة إنتاج محتوى محمي"}

    # الافتراضي: غير مؤكد => UNKNOWN
    return {"rights_status": "UNKNOWN", "product_path": "content_production",
            "note": "الحقوق غير مؤكدة — ممنوع BUILD لإنتاج المحتوى؛ REVIEW أو حوّل لمسار Affiliate"}


if __name__ == "__main__":
    out = collect_signals("AI automation for small businesses", ["global", "arabic"])
    print(json.dumps(out, ensure_ascii=False, indent=2)[:1500])
    print("---")
    print(json.dumps(cluster_problems(out["evidence"]), ensure_ascii=False, indent=2))
