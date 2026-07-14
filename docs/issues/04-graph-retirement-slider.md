# 04 — Graph + retirement slider

**What to build:** The main interactive visualisation. A retirement slider below the graph lets the user set the Drawout Date by dragging. The graph and all summary stats update live on every slider movement and input change.

**Graph data series:**
1. **Portfolio value curve** — one continuous line spanning the full simulation (Accumulation Phase + Drawout Phase). The Accumulation and Drawout segments may be visually distinguished (e.g. different colour or line style).
2. **Monthly withdrawal shaded region** — rendered only during the Drawout Phase. Shows the nominal gross monthly withdrawal amount required each year as a shaded band or area on a secondary axis. This grounds the user in what the portfolio is worth in real terms at any point.
3. **FIRE Number reference line** — a horizontal line at the FIRE Number value at the Drawout Date, so the user can immediately see whether the portfolio crosses it.

**X-axis:** Age as the primary tick label. Calendar year as a smaller secondary label below each tick (derived from current age and the current calendar year at page load).

**Retirement slider:**
- Spans from `currentAge + 1` to `99`
- Snaps to whole ages only
- Positioned below the graph
- Dragging it changes the Drawout Date, immediately re-runs the simulation, redraws the graph, and updates the summary stats

**Blocked by:** 03 (engine wired to inputs and stats).

**Status:** done

- [x] Portfolio curve renders correctly across both Accumulation and Drawout phases
- [x] Monthly withdrawal shaded region visible during Drawout Phase
- [x] FIRE Number reference line visible at the correct portfolio value
- [x] X-axis shows age labels (primary) and calendar year labels (secondary)
- [x] Portfolio curve flatlines visibly at 0 when portfolio depletes
- [x] Retirement slider spans `currentAge + 1` to `99`, snaps to whole ages
- [x] Dragging slider updates graph and all summary stats live
- [x] Graph and slider also update when any input field changes
- [x] Chart and slider are responsive — usable on typical desktop viewport widths
