# 03 — Wire engine to inputs + summary stats strip

**What to build:** Connect the new simulation engine to the new input form and display four live-updating summary stats. Every time any input changes, the engine is called immediately and the stats update. A default Drawout Date is used as a placeholder (e.g. current age + 30, or age 67, whichever is within range) until the retirement slider is built in ticket 04.

**Summary stats to display:**

| Stat | Label | Notes |
|---|---|---|
| 🎯 FIRE Number | FIRE Number | Portfolio value needed at Drawout Date to sustain withdrawals to 100 |
| 📅 Projected FIRE Age | Projected FIRE Age | Age at which portfolio first crosses FIRE Number; show "Not reached" if it doesn't |
| 💰 Portfolio at Retirement | Portfolio at Retirement | Actual simulated portfolio value at the Drawout Date |
| ⚠️ Runway | Runway | Years portfolio lasts before hitting zero; hidden or shown as "Sustainable to 100" when portfolio survives |

All monetary values formatted with the selected currency symbol. Stats strip should be visually prominent — above or beside the graph area (graph placeholder can be an empty container for now).

**Blocked by:** 01 (engine), 02 (input form).

**Status:** done

- [x] Engine is called on every input `change`/`input` event with no debounce (annual simulation is fast enough)
- [x] All four stats render correctly and update live
- [x] Currency symbol from the currency selector applies to all monetary stats
- [x] Projected FIRE Age shows "Not reached" when the portfolio never crosses the FIRE Number
- [x] Runway stat is hidden (or reads "Sustainable to 100") when the portfolio does not deplete before age 100
- [x] A default Drawout Date is used; the stats are correct given that default
