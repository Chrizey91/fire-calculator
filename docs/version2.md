# FIRE Calculator — Version 2 Spec

Version 2 is a complete rewrite. The goal is a single-page browser tool that lets a user simulate their path to financial independence and explore retirement timing interactively.

---

## Inputs

### Primary (always visible)

| Field | Description | Default |
|---|---|---|
| Current Age | User's age today (whole years) | — |
| Portfolio Value | Current total invested assets | — |
| Monthly Savings | Amount saved/invested each month | — |
| Savings Growth Rate | Annual % by which Monthly Savings increases until Drawout Date | 0% |
| ROI | Annual % return on investments (same rate for both phases) | 7% |
| Target Net Monthly Income | Desired monthly income in retirement, in today's purchasing power, after deductions | — |
| Deduction Rate | % deducted from gross portfolio withdrawals (e.g. tax) | 0% |

### Advanced (collapsed behind "Advanced Settings" toggle)

| Field | Description | Default |
|---|---|---|
| Inflation Rate | Annual % price increase, used for real/nominal conversion | 2% |
| Additional Retirement Income | Net monthly income from external sources after Drawout Date (pension, etc.) | 0 |
| Currency | Cosmetic symbol displayed throughout the UI | € |

---

## Simulation Model

- **Time step**: Annual (monthly inputs × 12 per year).
- **Horizon**: Always simulates from current age to age 100.
- **Accumulation Phase** (current age → Drawout Date):
  - Each year: `portfolio = portfolio × (1 + ROI) + annual_savings`
  - `annual_savings = monthly_savings × 12`, where `monthly_savings` compounds annually by the Savings Growth Rate.
- **Drawout Phase** (Drawout Date → age 100):
  - No new savings contributions.
  - Each year the required gross annual withdrawal is computed:
    - Nominal target net annual income = `target_net_monthly × 12 × (1 + inflation)^years_since_drawout`
    - Net annual need from portfolio = `nominal_target − (additional_retirement_income × 12)`
    - Gross annual withdrawal = `net_annual_need / (1 − deduction_rate)`
  - `portfolio = max(0, portfolio × (1 + ROI) − gross_annual_withdrawal)`
  - Portfolio flatlines at 0 once depleted — never goes negative.
- **FIRE Number**: Computed by running the Drawout Phase simulation backwards from age 100 to find the minimum portfolio at the Drawout Date that sustains withdrawals to age 100 without hitting zero.

---

## Graph

- **Primary curve**: Portfolio value over time (Accumulation Phase + Drawout Phase).
- **Secondary series**: Monthly withdrawal amount (inflation-adjusted, in nominal terms during Drawout Phase) shown as a shaded region or secondary axis — gives the user grounding for what the portfolio is worth at any point in time.
- **Reference line**: FIRE Number — horizontal or dynamic line at the Drawout Date portfolio target.
- **Toggle**: Switch between **Nominal** and **Real** (inflation-adjusted, today's purchasing power) values for all curves. Applies to both the portfolio curve and withdrawal shading.
- **X-axis**: Age as primary label, calendar year as smaller secondary label below (derived from current age + current year).
- **Depletion**: Portfolio curve flatlines at 0. No truncation.

---

## Retirement Slider

- Positioned below the graph, spanning the full age range (current age + 1 → 99).
- Dragging the slider changes the Drawout Date and immediately triggers live recalculation.
- The graph redraws in real time on every slider movement.

---

## Summary Stats Strip

Displayed prominently above or alongside the graph, updating live:

| Stat | Description |
|---|---|
| 🎯 FIRE Number | Portfolio value needed at Drawout Date to sustain withdrawals to 100 |
| 📅 Projected FIRE Age | Age at which the portfolio first crosses the FIRE Number |
| 💰 Portfolio at Retirement | Actual simulated portfolio value at the Drawout Date |
| ⚠️ Runway | Years the portfolio lasts before hitting zero (shown only if portfolio depletes before 100) |

---

## Behaviour

- **Live recalculation**: Graph and stats update immediately on every input change or slider drag.
- **Persistence**: All inputs are saved to `localStorage` and restored on page load.
- **Sharing**: A "Copy link" button encodes all current inputs into the URL hash. Loading a URL with a hash restores those inputs (overrides localStorage).

---

## Out of Scope (v2)

- Multiple scenarios / scenario comparison
- Monte Carlo simulation
- Asset allocation modelling
- Export to PDF/PNG
- Backend / accounts
