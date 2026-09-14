"""
AI.Maged — Discovery Agent | Opportunity Scoring Engine
محرك تقييم الفرصة — deterministic (بدون LLM)، مطابق للمواصفة v0.2 القسم 5 و 6.

كل بُعد يُقيّم 0..100، ثم يُضرب في وزنه. المجموع 0..100.
القرار النهائي (BUILD/REVIEW/REJECT) يتطلب Score + شروط الأدلة + Rights Gate معاً (القسم 6).
"""
from __future__ import annotations
from dataclasses import dataclass, asdict
from typing import Literal

# أوزان الأبعاد (القسم 5) — المجموع = 1.0
WEIGHTS = {
    "pain_intensity": 0.20,
    "demand_strength": 0.20,
    "willingness_to_pay": 0.15,
    "market_gap": 0.15,
    "trend_recency": 0.10,
    "audience_specificity": 0.10,
    "execution_feasibility": 0.10,
}

# عتبات القرار (القسم 6)
BUILD_MIN_SCORE = 70
REVIEW_MIN_SCORE = 55
MIN_EVIDENCE_ITEMS = 3
MIN_INDEPENDENT_SOURCES = 2
MIN_STRONG_EVIDENCE = 2   # v0.2: على الأقل دليلان بدرجة A/B للـ BUILD

# v0.2 — Rights: الحالات التي تسمح بإنتاج المحتوى
RIGHTS_ALLOW_CONTENT = ("OWNED", "AUTHORIZED", "PUBLIC_DOMAIN")

Decision = Literal["BUILD", "REVIEW", "REJECT"]


@dataclass
class DimensionScores:
    """درجات الأبعاد السبعة (كل واحد 0..100)."""
    pain_intensity: float = 0.0
    demand_strength: float = 0.0
    willingness_to_pay: float = 0.0
    market_gap: float = 0.0
    trend_recency: float = 0.0
    audience_specificity: float = 0.0
    execution_feasibility: float = 0.0

    def weighted_total(self) -> float:
        total = 0.0
        for dim, w in WEIGHTS.items():
            total += max(0.0, min(100.0, getattr(self, dim))) * w
        return round(total, 1)


def decide(score: float, evidence_count: int, independent_sources: int,
           rights_status: str = "UNKNOWN", verification_conflict: bool = False,
           strong_evidence: int = 0, product_path: str = "content_production") -> Decision:
    """
    القرار النهائي حسب المواصفة v0.2 القسم 6.

    مسار content_production — BUILD يتطلب الكل:
      Score>=70 AND Evidence>=3 AND مصادر مستقلة>=2
      AND Rights ∈ {OWNED, AUTHORIZED, PUBLIC_DOMAIN}
      AND أدلة قوية (A/B) >= 2 AND لا تعارض تحقّق حرج.
    Rights = UNKNOWN => ممنوع BUILD (أقصى REVIEW).

    مسار affiliate — الحقوق آمنة (لا إنتاج محتوى)، BUILD يتطلب:
      Score>=70 AND Evidence>=3 AND مصادر مستقلة>=2 AND أدلة قوية>=2 AND لا تعارض.
    """
    base_gates_ok = (
        score >= BUILD_MIN_SCORE
        and evidence_count >= MIN_EVIDENCE_ITEMS
        and independent_sources >= MIN_INDEPENDENT_SOURCES
        and strong_evidence >= MIN_STRONG_EVIDENCE
        and not verification_conflict
    )

    if product_path == "affiliate" and rights_status == "AFFILIATE":
        # مسار أفيليت: لا حاجة لتصنيف حقوق إنتاج المحتوى
        if base_gates_ok:
            return "BUILD"
    else:
        # مسار إنتاج المحتوى: يتطلب حقوقاً تسمح بالإنتاج
        if base_gates_ok and rights_status in RIGHTS_ALLOW_CONTENT:
            return "BUILD"

    # REVIEW — لا يُسمح مع UNKNOWN إلا كأقصى حد (لا BUILD)
    if score >= REVIEW_MIN_SCORE and evidence_count >= 1:
        return "REVIEW"

    return "REJECT"


def recommend_product(score: float, rights_status: str, willingness_to_pay: float) -> dict:
    """اختيار نوع المنتج: كتابك (ebook) أو أفيليت — القسم 6 recommended_product."""
    if rights_status in RIGHTS_ALLOW_CONTENT and willingness_to_pay >= 60:
        return {"type": "ebook", "alternative": "affiliate",
                "reason": "حقوق آمنة + استعداد دفع كافٍ → منتج ملكك يحقق هامش ربح أعلى"}
    return {"type": "affiliate", "alternative": "ebook",
            "reason": "حقوق غير مؤكدة أو استعداد دفع أقل → أفيليت أأمن (عمولة بدون إنتاج)"}


def score_opportunity(dims: DimensionScores, evidence_count: int,
                      independent_sources: int, rights_status: str = "UNKNOWN",
                      verification_conflict: bool = False,
                      willingness_to_pay: float | None = None,
                      strong_evidence: int = 0,
                      product_path: str = "content_production") -> dict:
    """يحسب الـ Score، القرار، والمنتج المقترح — يرجّع dict جاهز للدمج في الـ Output."""
    total = dims.weighted_total()
    decision = decide(total, evidence_count, independent_sources,
                      rights_status, verification_conflict,
                      strong_evidence, product_path)
    wtp = dims.willingness_to_pay if willingness_to_pay is None else willingness_to_pay
    product = recommend_product(total, rights_status, wtp)
    return {
        "opportunity_score": total,
        "decision": decision,
        "dimension_scores": asdict(dims),
        "recommended_product": product,
        "gates": {
            "score_ok": total >= BUILD_MIN_SCORE,
            "evidence_ok": evidence_count >= MIN_EVIDENCE_ITEMS,
            "sources_ok": independent_sources >= MIN_INDEPENDENT_SOURCES,
            "strong_evidence_ok": strong_evidence >= MIN_STRONG_EVIDENCE,   # v0.2
            "rights_ok": (rights_status in RIGHTS_ALLOW_CONTENT
                          or (product_path == "affiliate" and rights_status == "AFFILIATE")),
            "no_conflict": not verification_conflict,
        },
    }


if __name__ == "__main__":
    # اختبار سريع
    demo = DimensionScores(85, 82, 71, 79, 76, 80, 84)
    result = score_opportunity(demo, evidence_count=4, independent_sources=3,
                               rights_status="OWNED", strong_evidence=3,
                               product_path="content_production")
    import json
    print(json.dumps(result, ensure_ascii=False, indent=2))
