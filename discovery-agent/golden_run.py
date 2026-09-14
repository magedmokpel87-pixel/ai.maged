"""
AI.Maged — Discovery Agent | Logic Validation Run
أول Regression Test للمشروع (المواصفة v0.2: GOLDEN-PATH CONTRACT).

⚠️ هام (v0.2): هذا اختبار منطق على بيانات Synthetic Demo = LOGIC_VALIDATION_RUN.
   ليس Golden Run حقيقياً. الـ Golden Run الحقيقي يتطلب Strands + مصادر حقيقية + Evidence قابل للتحقق.

يشغّل سيناريو Golden Path واحد كامل، يطبع النتيجة، ويحفظها في runs/.
تشغيل:  python golden_run.py
"""
from __future__ import annotations
import importlib.util
import os
import sys
import io

# Fix Windows console encoding for Arabic text
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

_HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("agent", os.path.join(_HERE, "agent.py"))
agent = importlib.util.module_from_spec(spec)
spec.loader.exec_module(agent)


VALIDATION_REQUEST = {
    "request_type": "opportunity_discovery",
    "topic": "AI automation for small businesses",
    "market": ["global", "arabic"],
    "product_types": ["ebook", "affiliate"],
    "language": "en",
    "time_window_days": 90,
    "max_candidates": 10,
}


def main():
    mode = "STRANDS (real agent)" if agent.strands_available() else "DETERMINISTIC (no Strands yet)"
    print("=" * 64)
    print(f"AI.Maged Discovery Agent v{agent.AGENT_VERSION} — LOGIC_VALIDATION_RUN")
    print(f"Mode: {mode}")
    print("⚠️  هذا اختبار منطق على بيانات Synthetic — ليس Golden Run حقيقياً.")
    print("=" * 64)

    # v0.2: run_type = logic_validation صراحةً
    result = agent.run_discovery(VALIDATION_REQUEST, run_type="logic_validation")

    print(f"\nRun Type:  {result.get('run_type')}")
    print(f"Data Mode: {result.get('data_mode')}")
    print(f"Topic:     {result.get('topic')}")
    print(f"Score:     {result.get('opportunity_score')}")
    print(f"Decision:  {result.get('decision')}")
    print(f"Rights:    {result.get('rights', {}).get('classification')}")
    print(f"Path:      {result.get('product_path')}")
    print(f"Product:   {result.get('recommended_product', {}).get('type')}")
    print(f"Evidence:  {result.get('demand', {}).get('signal_count')} items / "
          f"{result.get('demand', {}).get('independent_sources')} sources")
    print(f"Grades:    {result.get('evidence_summary')}")
    print(f"Gates:     {result.get('gates')}")
    print(f"Next:      {result.get('next_action')}")

    path = agent.save_run(result)
    print(f"\n[✓] Logic Validation Run saved: {path}")

    # تحقق أساسي (regression assertions)
    assert result["status"] in ("completed", "failed"), "status invalid"
    assert "opportunity_score" in result or result["status"] == "failed", "no score"
    assert result["decision"] in ("BUILD", "REVIEW", "REJECT"), "bad decision"
    assert result.get("data_mode") in ("LIVE", "SYNTHETIC_DEMO", "MIXED"), "bad data_mode"
    if result["decision"] == "BUILD":
        g = result["gates"]
        assert all(g.values()), "BUILD requires all gates True"
    print("[✓] Regression assertions passed.")
    return result


if __name__ == "__main__":
    main()
