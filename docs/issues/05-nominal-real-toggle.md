# 05 — Nominal / Real toggle

**What to build:** A toggle above (or beside) the graph that switches all graph series between Nominal and Real (inflation-adjusted, today's purchasing power) values. The simulation engine already emits both nominal and real values per year — this ticket wires the toggle to select which set the chart renders.

**What changes when the toggle is active (Real view):**
- Portfolio curve: uses `realPortfolio` values instead of `nominalPortfolio`
- Monthly withdrawal shading: uses `realMonthlyWithdrawal` instead of `nominalMonthlyWithdrawal`
- FIRE Number reference line: shown in real terms (deflated back to today's money)
- Y-axis label updates to indicate the active view (e.g. "Portfolio Value (today's €)" vs "Portfolio Value (nominal €)")

Summary stats (FIRE Number, Portfolio at Retirement) may optionally update to reflect the active view — use judgement on whether this adds clarity or confusion.

**Blocked by:** 04 (graph must exist).

**Status:** done

- [x] Toggle control is visible and clearly labelled (e.g. "Nominal" / "Real")
- [x] Switching to Real updates the portfolio curve to `realPortfolio` values
- [x] Switching to Real updates the withdrawal shading to `realMonthlyWithdrawal` values
- [x] FIRE Number reference line reflects the active view
- [x] Y-axis label or graph title indicates which view is active
- [x] Toggle state persists when inputs change or slider is dragged (does not reset to default)
