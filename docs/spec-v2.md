# FIRE Calculator v2 — Product Requirements Document

## Problem Statement

The current FIRE calculator (v1) is not fit for purpose. It uses a Safe Withdrawal Rate input to determine the FIRE number, which conflates the user's goal (a desired monthly income in retirement) with an intermediate financial construct (the SWR). The simulation ends at a configurable "expected lifespan" rather than a fixed horizon, the retirement timing cannot be interactively explored, and the graph is absent. The result is a tool that answers "have I reached FIRE?" but not "when should I retire, and what happens if I do?"

v2 is a complete rewrite. Its goal is to let a user model their full financial lifecycle — accumulation through drawout — interactively, so they can answer: *"If I retire at age X with these inputs, will my money last?"*

---

## Solution

A single-page browser tool that simulates portfolio growth and retirement drawdown from the user's current age to age 100. The core interaction is a retirement slider: the user drags it to explore different Drawout Dates and immediately sees the updated graph, FIRE Number, and runway. All inputs persist across sessions and can be shared via URL.

---

## User Stories

### Inputs — Primary

1. As a user, I want to enter my current age, so that the simulation starts from my real situation.
2. As a user, I want to enter my current Portfolio Value, so that the simulation accounts for savings I already have.
3. As a user, I want to enter my Monthly Savings amount, so that the simulation models my ongoing contributions.
4. As a user, I want to enter a Savings Growth Rate (%), so that the simulation accounts for expected increases in my contribution over time (e.g. salary progression).
5. As a user, I want to enter an ROI (%), so that I can model different expected market returns.
6. As a user, I want to enter a Target Net Monthly Income in today's purchasing power, so that I can set my retirement lifestyle goal without worrying about inflation math myself.
7. As a user, I want to enter a Deduction Rate (%), so that the calculator grosses up my target withdrawal to account for taxes or other deductions automatically.

### Inputs — Advanced

8. As a user, I want to configure the Inflation Rate (defaulting to 2%), so that I can model different inflation environments without cluttering the primary form.
9. As a user, I want to enter an Additional Retirement Income (net monthly, defaulting to 0), so that I can model income from a state pension or part-time work after retirement.
10. As a user, I want to select a currency symbol (€, $, £, CHF, etc.), so that the displayed numbers match my real currency without affecting the calculations.
11. As a user, I want the advanced inputs to be hidden behind a collapsible toggle, so that the primary form stays clean and approachable.

### Retirement Slider

12. As a user, I want a retirement slider below the graph spanning my current age to age 99, so that I can set my intended Drawout Date interactively.
13. As a user, I want the slider to snap to whole years (ages), so that the Drawout Date is always a clean integer.
14. As a user, I want the graph and all summary stats to update instantly as I drag the slider, so that I can explore retirement timing scenarios fluidly.

### Simulation

15. As a user, I want the simulation to always run from my current age to age 100, so that I have a consistent long-term view regardless of when I plan to retire.
16. As a user, I want the Accumulation Phase to compound my Monthly Savings annually by my Savings Growth Rate until the Drawout Date, so that I get a realistic picture of increasing contributions.
17. As a user, I want the Drawout Phase to automatically compute the gross portfolio withdrawal needed to deliver my Target Net Monthly Income (adjusted for inflation and net of deductions), so that I don't have to do this math myself.
18. As a user, I want the Additional Retirement Income to reduce the gross portfolio withdrawal required each year, so that my pension or other income reduces the burden on my portfolio.
19. As a user, I want the portfolio to earn ROI throughout both the Accumulation and Drawout phases using the same rate, so that the model stays simple and I can adjust the rate if I want to model a more conservative allocation.
20. As a user, I want the portfolio to flatline at zero rather than go negative, so that the graph clearly shows the point at which my money runs out.

### Graph

21. As a user, I want to see a portfolio value curve over time covering both Accumulation and Drawout phases, so that I can see the complete arc of my financial life.
22. As a user, I want to see a shaded region during the Drawout Phase showing the monthly withdrawal amount in each year (inflation-adjusted in nominal terms), so that I have a grounded sense of what the portfolio is worth at any point in time.
23. As a user, I want to see a reference line on the graph showing my FIRE Number at the Drawout Date, so that I can immediately see whether my portfolio has reached the required level.
24. As a user, I want to toggle between Nominal and Real (inflation-adjusted, today's purchasing power) views on the graph, so that I can see both what the numbers literally say and what they mean in today's money.
25. As a user, I want the x-axis to show age as the primary label with the corresponding calendar year shown smaller below, so that I can orient myself both personally and in real time.

### Summary Stats

26. As a user, I want to see my FIRE Number prominently displayed, so that I know the exact portfolio target I am aiming for at the selected Drawout Date.
27. As a user, I want to see my Projected FIRE Age — the age at which my portfolio is projected to first cross the FIRE Number — so that I can compare it against my chosen Drawout Date.
28. As a user, I want to see my Portfolio at Retirement — the actual simulated portfolio value at the Drawout Date — so that I know whether I am over or under my FIRE Number.
29. As a user, I want to see my Runway — the number of years the portfolio lasts before hitting zero — when the portfolio depletes before age 100, so that I know how significant the shortfall is.
30. As a user, I want all four summary stats to update live as I change inputs or move the retirement slider, so that the stats always reflect my current scenario.

### Persistence & Sharing

31. As a user, I want my inputs to be automatically saved to localStorage, so that my scenario is waiting for me the next time I open the calculator.
32. As a user, I want a "Copy link" button that encodes all my current inputs into the URL hash, so that I can share my exact scenario with a partner or financial advisor.
33. As a user, I want the calculator to restore inputs from the URL hash when I open a shared link, so that the shared scenario loads exactly as the sender configured it.

---

## Implementation Decisions

### Simulation Engine

- The simulation engine is a **pure function**: given a set of inputs, it returns a deterministic year-by-year data structure. No side effects, no DOM access.
- **Time step**: annual. Monthly inputs (Monthly Savings, Target Net Monthly Income) are multiplied by 12 within the engine for each annual step.
- **Horizon**: always 100 − currentAge years. Fixed; not user-configurable.
- **Accumulation Phase formula per year**:
  - `portfolio = portfolio × (1 + ROI) + (monthlySavings × 12)`
  - `monthlySavings` is itself multiplied by `(1 + savingsGrowthRate)` at the end of each year, compounding annually.
- **Drawout Phase formula per year**:
  - `yearsSinceDrawout = age − drawoutAge`
  - `nominalTargetNet = targetNetMonthly × 12 × (1 + inflationRate)^yearsSinceDrawout`
  - `netNeededFromPortfolio = nominalTargetNet − (additionalRetirementIncome × 12)`
  - `grossWithdrawal = netNeededFromPortfolio / (1 − deductionRate)` (clamped to ≥ 0)
  - `portfolio = max(0, portfolio × (1 + ROI) − grossWithdrawal)`
- **FIRE Number**: derived by back-solving the Drawout Phase simulation — the minimum portfolio value at the Drawout Date that results in the portfolio not hitting zero before age 100. No static SWR formula is used (see ADR-0002).
- **Real vs Nominal values**: the engine emits **both** nominal and real values for each year. Real value = nominal value / (1 + inflationRate)^yearsSinceCurrentAge. The UI toggles which series to render; the engine always computes both.
- Each year's record in the output includes: age, calendar year, phase, nominal portfolio value, real portfolio value, nominal monthly withdrawal, real monthly withdrawal.

### UI Architecture

- **Single module boundary**: the UI layer calls the engine's pure function and maps the returned data to the chart and summary stats. All financial logic lives in the engine; none in the UI layer.
- **Live recalculation**: the engine is called synchronously on every input `change`/`input` event and on every slider `input` event. No debounce needed — the annual simulation over ≤ 80 years is negligible in cost.
- **Chart library**: use an existing charting library already available in the project or the browser; avoid heavy dependencies. The chart must support dual series (portfolio curve + shaded withdrawal region) and a horizontal reference line.
- **Input layout**: two tiers — 7 primary inputs always visible, 3 advanced inputs behind a collapsible `<details>` element or equivalent toggle.
- **localStorage**: all inputs are serialised to a single JSON key on every change. On page load, localStorage is read first; URL hash overrides it if present.
- **URL hash sharing**: inputs are JSON-serialised and base64-encoded into `window.location.hash`. The "Copy link" button writes the current hash to the clipboard. On load, if a hash is present, it is decoded and takes priority over localStorage.

### Dropped from v1

- `expectedLifespan` input — replaced by fixed horizon of age 100.
- `annualExpenses` input — replaced by `targetNetMonthlyIncome` (monthly, net, in today's money).
- `withdrawalRate` input (SWR) — replaced by dynamic simulation (ADR-0002).
- `capitalGainsTax` and `withdrawalTax` as two separate inputs — replaced by a single `deductionRate`.
- Multiple scenario cards — v2 is single-scenario.

---

## Testing Decisions

### What makes a good test

Tests should call the simulation engine's pure function directly with a set of inputs and assert on the returned year-by-year data and summary values. Tests must not interact with the DOM or depend on rendering. They test **external behaviour** (given these inputs, the simulation produces these outputs) — not internal implementation details like variable names or intermediate computations.

### Seam

The single test seam is the **engine's exported `simulate` function** (currently `engine.js`, to be rewritten for v2). This is the highest seam that covers all financial logic. UI tests are not required for v2 — the engine covers the risk.

### Test cases to cover

- **Accumulation only**: a user who never reaches their FIRE Number by age 100 — verify the portfolio grows correctly each year and FIRE Number is reported accurately.
- **Clean FIRE reach**: a user who reaches the FIRE Number during the Accumulation Phase — verify Projected FIRE Age is correct.
- **Sustainable drawout**: a user who retires with a portfolio above the FIRE Number — verify the portfolio never hits zero before age 100.
- **Depletion**: a user who retires with too small a portfolio — verify the portfolio flatlines at zero at the correct age and Runway is calculated correctly.
- **Savings Growth Rate compounding**: verify that Monthly Savings compounds correctly by the Savings Growth Rate each year until the Drawout Date, and stops compounding after.
- **Inflation grossing-up**: verify that the gross withdrawal increases annually to preserve real purchasing power.
- **Deduction Rate grossing-up**: verify that the gross withdrawal correctly grosses up the net target through the Deduction Rate.
- **Additional Retirement Income offset**: verify that Additional Retirement Income reduces the required gross portfolio withdrawal correctly.
- **Real vs Nominal toggle**: verify that the engine emits both nominal and real values per year, and that real values correctly deflate nominal values by cumulative inflation.
- **Age 100 boundary**: verify the simulation runs exactly to age 100 and no further.
- **Zero depletion boundary**: verify portfolio never goes below zero.

### Prior art

The existing `engine.js` test structure (if any in `test/`) should be used as a reference. The new engine tests should follow the same module import pattern.

---

## Out of Scope

- Multiple scenario comparison
- Monte Carlo / stochastic simulation
- Asset allocation modelling (stocks vs bonds split)
- Export to PDF or PNG
- User accounts or backend persistence
- Mobile-specific native features
- Internationalisation beyond cosmetic currency symbol selection
- Tax jurisdiction-specific rules

---

## Further Notes

- The `deductionRate` is intentionally a single blended rate rather than separate capital gains and withdrawal taxes. This is simpler and avoids misleading precision — users are unlikely to know the exact effective rate for each category.
- The Additional Retirement Income field is deliberately entered as a **net** figure (after the user's own tax workings). Mixing it into the Deduction Rate mechanism would be incorrect since pension tax treatment often differs from investment income tax.
- The FIRE Number is a function of the Drawout Date — it changes as the user moves the slider, because the number of years to sustain withdrawals, and the inflation-adjusted withdrawal amount, both change.
- Calendar year on the x-axis is derived from `currentYear + (age − currentAge)`, where `currentYear` is read from `new Date()` at page load. No user input is needed.
