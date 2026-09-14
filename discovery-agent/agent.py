"""
AI.Maged — Discovery Agent v0.2 (Strands)
Discovery agent that identifies profitable digital book opportunities with verifiable evidence.

Architecture: Strands = decision layer that calls real tools then computes Score deterministically.

Usage:
    pip install strands-agents
    python golden_run.py

Operating modes:
- If Strands installed + model key available -> real agent (LLM decides which tool to call).
- Otherwise -> deterministic mode (runs same tools in sequence and computes Score).
  JSON output is the same in both cases for Logic Validation Run testing.

Note v0.2: Running on Synthetic data = Logic Validation Run (not a real Golden Run).
"""
from __future__ import annotations
import json
import os
import sys
import uuid
from datetime import datetime, timezone

_HERE = os.path.dirname(os.path.abspath(__file__))

# Import core logic (deterministic - does not depend on Strands)
import importlib.util


def _load(name, rel):
    spec = importlib.util.spec_from_file_location(name, os.path.join(_HERE, rel))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod  # Fix: Register module for Python 3.13+ dataclass compatibility
    spec.loader.exec_module(mod)
    return mod

scoring = _load("scoring", "scoring.py")
dtools = _load("discovery_tools", os.path.join("tools", "discovery_tools.py"))

AGENT_VERSION = "0.2.0"

SYSTEM_PROMPT = """أنت Discovery Agent في نظام AI.Maged.
مهمتك: اكتشاف فرص كتب رقمية مربحة بناءً على مشاكل حقيقية مدعومة بأدلة قابلة للتحقق.
القواعد الصارمة:
- لا تخترع أدلة أو أرقاماً أبداً.
- لا تقل BUILD إلا لو تحققت شروط الأدلة (>=3 أدلة، >=2 مصادر مستقلة، >=2 أدلة قوية A/B، حقوق تسمح بالإنتاج).
- الحقوق UNKNOWN → ممنوع BUILD لإنتاج المحتوى. عند عدم اليقين → REVIEW. عند نقص الأدلة → REJECT.
استخدم الأدوات المتاحة: collect_signals ثم cluster_problems ثم assess_rights، ثم سلّم الأرقام لمحرك التقييم."""


def _estimate_dimensions(signals: dict, clusters: dict) -> "scoring.DimensionScores":
    """
    Converts collected signals to seven dimension scores (0..100) deterministically.
    In real mode, the LLM may adjust these based on evidence analysis.
    """
    ev = signals["evidence"]
    by = signals["counts"]["by_signal"]
    n = max(1, len(ev))
    avg_rel = sum(e["relevance"] for e in ev) / n * 100
    avg_conf = sum(e["confidence"] for e in ev) / n * 100

    pain = min(100, by.get("pain", 0) * 45 + avg_rel * 0.4)
    demand = min(100, by.get("demand", 0) * 45 + signals["counts"]["evidence_items"] * 6)
    wtp = min(100, by.get("willingness_to_pay", 0) * 55 + 20)
    gap = min(100, (by.get("gap", 0) + by.get("competition", 0)) * 35 + 15)
    trend = min(100, by.get("trend", 0) * 50 + 30)
    audience = min(100, avg_rel)
    feasibility = min(100, avg_conf)

    return scoring.DimensionScores(
        pain_intensity=round(pain, 1),
        demand_strength=round(demand, 1),
        willingness_to_pay=round(wtp, 1),
        market_gap=round(gap, 1),
        trend_recency=round(trend, 1),
        audience_specificity=round(audience, 1),
        execution_feasibility=round(feasibility, 1),
    )


def _count_strong_evidence(evidence: list[dict]) -> int:
    """v0.2 - Counts strong evidence (grade A or B)."""
    return sum(1 for e in evidence if e.get("evidence_grade") in ("A", "B"))


def run_discovery(request: dict, run_type: str = "logic_validation") -> dict:
    """
    Executes full Golden Path: INPUT -> SEARCH -> EVIDENCE -> CLUSTER -> RIGHTS GATE -> SCORE -> DECISION -> JSON.
    Returns Output JSON matching spec v0.2 section 7.

    run_type: "logic_validation" (Synthetic data) or "golden_run" (real sources).
    """
    topic = (request or {}).get("topic", "").strip()
    market = request.get("market", ["global"])
    product_types = request.get("product_types", ["ebook", "affiliate"])
    window = request.get("time_window_days", 90)

    task = {
        "task_id": str(uuid.uuid4()),
        "agent": "discovery",
        "agent_version": AGENT_VERSION,
        "run_type": run_type,                                   # v0.2
        "created_at": datetime.now(timezone.utc).isoformat(),
        "request": request,
    }

    # 1.4 Input Rule - no guessing allowed
    if not topic or len(topic) < 3:
        task.update({"status": "failed", "error": "INPUT_INVALID",
                     "decision": "REJECT", "data_mode": "SYNTHETIC_DEMO",
                     "message": "topic فارغ أو غير مفهوم"})
        return task

    # SEARCH + COLLECT EVIDENCE
    signals = dtools.collect_signals(topic, market, window)
    ev_count = signals["counts"]["evidence_items"]
    src_count = signals["counts"]["independent_sources"]
    data_mode = signals.get("data_mode", "SYNTHETIC_DEMO")      # v0.2

    # B. Insufficient evidence (v0.2: no match = empty = REJECT)
    if ev_count == 0:
        task.update({"status": "completed", "decision": "REJECT",
                     "error": "INSUFFICIENT_EVIDENCE", "opportunity_score": 0,
                     "data_mode": data_mode, "evidence": [],
                     "evidence_summary": {"grade_A": 0, "grade_B": 0, "grade_C": 0, "grade_D": 0},
                     "message": "لا يوجد تطابق مع الموضوع — لا Evidence = لا BUILD"})
        return task

    # CLUSTER
    clusters = dtools.cluster_problems(signals["evidence"])

    # RIGHTS GATE (v0.2 - 5 cases)
    primary_product = product_types[0] if product_types else "ebook"
    rights = dtools.assess_rights(topic, primary_product)
    rights_status = rights["rights_status"]
    product_path = rights.get("product_path", "content_production")

    # SCORE + DECISION
    dims = _estimate_dimensions(signals, clusters)
    strong = _count_strong_evidence(signals["evidence"])        # v0.2
    scored = scoring.score_opportunity(
        dims, evidence_count=ev_count, independent_sources=src_count,
        rights_status=rights_status, strong_evidence=strong,
        product_path=product_path,
    )

    by_grade = signals["counts"].get("by_grade", {})
    evidence_summary = {
        "grade_A": by_grade.get("A", 0), "grade_B": by_grade.get("B", 0),
        "grade_C": by_grade.get("C", 0), "grade_D": by_grade.get("D", 0),
    }

    # OUTPUT JSON (section 7)
    task.update({
        "status": "completed",
        "data_mode": data_mode,                                 # v0.2
        "decision": scored["decision"],
        "opportunity_score": scored["opportunity_score"],
        "topic": topic,
        "market": market,
        "rights": {"classification": rights_status, "note": rights.get("note", "")},  # v0.2
        "product_path": product_path,                           # v0.2
        "problem": {
            "statement": f"جمهور {topic} يواجه مشاكل متكررة مدعومة بأدلة",
            "audience": topic,
            "pain_points": [e["excerpt"] for e in signals["evidence"]
                            if e["signal_type"] in ("pain", "gap")][:5],
        },
        "demand": {
            "signal_strength": dims.demand_strength,
            "signal_count": ev_count,
            "independent_sources": src_count,
        },
        "commercial": {
            "willingness_to_pay": dims.willingness_to_pay,
            "market_gap": dims.market_gap,
            "competition_level": signals["counts"]["by_signal"].get("competition", 0) * 30,
        },
        "trend": {"score": dims.trend_recency, "recency_window_days": window},
        "feasibility": {"score": dims.execution_feasibility,
                        "rights_status": rights_status},
        "recommended_product": scored["recommended_product"],
        "dimension_scores": scored["dimension_scores"],
        "gates": scored["gates"],
        "clusters": clusters["clusters"],
        "evidence": signals["evidence"],
        "evidence_summary": evidence_summary,                   # v0.2
        "risks": _risks(rights_status, src_count, data_mode),
        "next_action": "VERIFY" if scored["decision"] == "BUILD" else "REVIEW_MANUAL",
    })
    return task


def _risks(rights_status: str, src_count: int, data_mode: str) -> list[str]:
    r = []
    if rights_status == "UNKNOWN":
        r.append("حقوق المحتوى غير مؤكدة (UNKNOWN) — ممنوع BUILD لإنتاج المحتوى")
    if src_count < scoring.MIN_INDEPENDENT_SOURCES:
        r.append("عدد المصادر المستقلة أقل من الحد الأدنى")
    if data_mode != "LIVE":
        r.append(f"data_mode={data_mode} — النتيجة لا تثبت طلب سوق حقيقي (اختبار منطق فقط)")
    return r


def save_run(result: dict) -> str:
    """Saves run result in runs/ as a retestable record."""
    runs_dir = os.path.join(_HERE, "runs")
    os.makedirs(runs_dir, exist_ok=True)
    prefix = result.get("run_type", "run")
    fname = f"{prefix}_{result['task_id'][:8]}.json"
    path = os.path.join(runs_dir, fname)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return path


# Strands wrapper (activates automatically if library is available)
def build_strands_agent():
    """Builds real Strands Agent with tools. Called only if strands is installed."""
    from strands import Agent, tool  # type: ignore

    @tool
    def collect_signals(topic: str, market: list = None) -> dict:
        """Collect pain and demand signals about a topic from allowed sources."""
        return dtools.collect_signals(topic, market or ["global"])

    @tool
    def cluster_problems(evidence: list) -> dict:
        """Cluster evidence into recurring problems."""
        return dtools.cluster_problems(evidence)

    @tool
    def assess_rights(topic: str, product_type: str = "ebook") -> dict:
        """Assess content rights for topic (Rights Gate: 5 cases)."""
        return dtools.assess_rights(topic, product_type)

    return Agent(system_prompt=SYSTEM_PROMPT,
                 tools=[collect_signals, cluster_problems, assess_rights])


def strands_available() -> bool:
    try:
        import strands  # noqa
        return True
    except Exception:
        return False
