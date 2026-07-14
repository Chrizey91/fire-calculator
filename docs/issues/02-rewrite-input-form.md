# 02 — Rewrite input form

**What to build:** A clean, fully functional input form replacing the v1 form. All 10 inputs rendered with correct labels, types, defaults, and validation ranges. Advanced inputs are hidden behind a collapsible toggle and only revealed on demand.

**Primary inputs (always visible):**

| Field | Label | Default | Notes |
|---|---|---|---|
| Current Age | Current Age | — | Integer, min 1 |
| Portfolio Value | Current Portfolio Value | — | Number, min 0 |
| Monthly Savings | Monthly Savings | — | Number, min 0 |
| Savings Growth Rate | Savings Growth Rate (%) | 0% | Decimal, allow negative |
| ROI | Annual ROI (%) | 7% | Decimal |
| Target Net Monthly Income | Target Net Monthly Income | — | Number, min 0, in today's money |
| Deduction Rate | Deduction Rate (%) | 0% | Decimal, 0–100 |

**Advanced inputs (collapsed by default):**

| Field | Label | Default |
|---|---|---|
| Inflation Rate | Inflation Rate (%) | 2% |
| Additional Retirement Income | Additional Retirement Income (net/month) | 0 |
| Currency | Currency | € |

Currency is a dropdown with at minimum: € (EUR), $ (USD), £ (GBP), CHF.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] All 7 primary inputs rendered with correct labels and defaults
- [x] All 3 advanced inputs rendered inside a collapsible section (collapsed by default)
- [x] Currency selector updates the currency symbol displayed throughout the UI
- [x] Form does not reference `expectedLifespan`, `annualExpenses`, `withdrawalRate`, `capitalGainsTax`, or `withdrawalTax` — those are v1 inputs and must be removed
- [x] Inputs use correct HTML types and min/max/step attributes to prevent invalid values
- [x] Visual design is consistent with the existing app's dark-mode glass aesthetic
