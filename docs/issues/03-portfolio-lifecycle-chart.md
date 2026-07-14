# 03 — Portfolio lifecycle chart

**What to build:** A Chart.js line chart below the summary card that visualizes the portfolio's value over the user's entire lifetime — from current age through expected lifespan. The chart clearly shows the accumulation phase (portfolio growing) and the drawdown phase (portfolio declining after FIRE). A horizontal dashed line marks the FIRE number threshold. The X-axis shows age, the Y-axis shows portfolio value formatted with the currency symbol. The chart updates in real-time alongside the summary card whenever inputs change. The chart is responsive and includes smooth animations on data updates.

**Blocked by:** 02 — Single scenario UI + live results

**Status:** ready-for-agent

- [ ] Chart.js 4.x loaded via CDN
- [ ] Line chart with age on X-axis and portfolio value on Y-axis
- [ ] Portfolio trajectory line showing both accumulation and drawdown phases
- [ ] Horizontal dashed line at the FIRE number threshold
- [ ] Vertical dashed line or annotation marking the FIRE year/age
- [ ] Y-axis values formatted with currency symbol and abbreviated (e.g., €1.2M)
- [ ] Chart updates in real-time when inputs change (reuses debounced calculation)
- [ ] Smooth animation on data updates
- [ ] Responsive sizing (fills container width, reasonable height)
- [ ] Graceful handling when FIRE is never reached (no threshold line, chart shows accumulation only)
