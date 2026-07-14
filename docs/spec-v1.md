# FIRE Calculator V1 — Spec

**Label:** `ready-for-agent`

## Problem Statement

A person pursuing Financial Independence / Retire Early (FIRE) needs to understand how much money they need to accumulate, how long it will take to get there, and whether their portfolio will actually sustain them through retirement. Existing calculators are either too simplistic (just 25× expenses) or too complex, and none let you easily compare multiple "what if" scenarios side by side with country-specific tax and inflation defaults.

## Solution

A single-page, static FIRE calculator hosted on GitHub Pages that runs a deterministic year-by-year financial simulation across both the accumulation and retirement (drawdown) phases. Users enter their financial details, and the calculator instantly shows when they can retire, how much they need, and whether their money will last — all visualized on an interactive chart. Up to three named scenarios can be compared side by side. Country-based defaults make it easy to get started, and all inputs persist between visits.

## User Stories

1. As a FIRE aspirant, I want to enter my annual savings and annual expenses so that the calculator can determine when I'll reach financial independence.
2. As a FIRE aspirant, I want to see my projected FIRE number (the portfolio value I need) so that I have a concrete target to work toward.
3. As a FIRE aspirant, I want the calculator to solve for the earliest year I can retire so that I know how many working years I have left.
4. As a FIRE aspirant, I want to enter my current age and expected lifespan so that the calculator models my full lifecycle from now until end of life.
5. As a FIRE aspirant, I want my annual expenses to be automatically adjusted for inflation each year so that my FIRE number reflects future purchasing power, not today's.
6. As a FIRE aspirant, I want to enter a savings growth rate so that I can model expected salary increases or lifestyle changes over time.
7. As a FIRE aspirant, I want to enter my current portfolio value so that the simulation accounts for what I've already saved.
8. As a FIRE aspirant, I want to configure the expected annual investment return rate so that I can model different asset allocation strategies.
9. As a FIRE aspirant, I want to set a withdrawal rate (defaulting to 4%) so that the FIRE number calculation reflects my preferred safe withdrawal strategy.
10. As a FIRE aspirant, I want to configure a capital gains tax rate that is applied to investment returns during accumulation so that the simulation reflects real after-tax growth.
11. As a FIRE aspirant, I want to configure a withdrawal tax rate that is applied to retirement withdrawals so that the simulation accounts for income tax on distributions.
12. As a FIRE aspirant, I want the simulation to continue through the retirement drawdown phase so that I can see whether my portfolio survives to my expected lifespan.
13. As a FIRE aspirant, I want unsustainable scenarios (where the portfolio runs out before death) to be clearly flagged so that I know which plans are risky.
14. As a FIRE aspirant, I want to see the age at which an unsustainable scenario depletes so that I understand the severity of the shortfall.
15. As a FIRE aspirant, I want to create up to three named scenarios so that I can compare conservative, moderate, and aggressive plans.
16. As a FIRE aspirant, I want to duplicate an existing scenario so that I can quickly create a variant by tweaking just one or two parameters.
17. As a FIRE aspirant, I want to delete a scenario (as long as at least one remains) so that I can clean up plans I no longer need.
18. As a FIRE aspirant, I want to see all scenarios plotted on a single line chart so that I can visually compare their trajectories.
19. As a FIRE aspirant, I want summary cards for each scenario showing FIRE number, years to FIRE, age at FIRE, total contributions vs. growth, and sustainability status so that I can compare key metrics at a glance.
20. As a FIRE aspirant, I want to expand a collapsible year-by-year breakdown table for any scenario so that I can verify the math and understand each year's cash flows.
21. As a FIRE aspirant, I want to select my country from a dropdown so that realistic defaults for inflation, capital gains tax, withdrawal tax, and currency are pre-filled.
22. As a FIRE aspirant, I want all country-populated defaults to remain editable so that I can override them with my actual rates.
23. As a FIRE aspirant, I want the currency symbol to update when I change the country so that all displayed values are in the correct currency.
24. As a FIRE aspirant, I want results to update in real-time as I change inputs so that I get instant feedback on how each parameter affects my plan.
25. As a FIRE aspirant, I want my inputs to be saved automatically in my browser so that I don't lose my work when I close the tab or refresh.
26. As a FIRE aspirant, I want a Share button that generates a URL encoding my scenarios so that I can send my plan to a friend or bookmark it.
27. As a FIRE aspirant, I want to open a shared URL and see the exact scenarios encoded in it so that I can review someone else's plan.
28. As a FIRE aspirant, I want to toggle between dark and light themes so that I can use the calculator comfortably in any lighting.
29. As a FIRE aspirant, I want the theme to default to my operating system preference so that the app looks right immediately without manual configuration.
30. As a FIRE aspirant, I want the page to be responsive so that I can use the calculator on my phone, tablet, or desktop.
31. As a FIRE aspirant, I want the chart to show a horizontal dashed line at the FIRE number threshold so that I can see exactly where financial independence lies on the graph.
32. As a FIRE aspirant, I want each scenario's chart line to be a distinct color matching its summary card so that I can easily correlate visual elements.

## Implementation Decisions

### Calculation Engine
- The simulation is a **deterministic year-by-year projection** (not Monte Carlo). This keeps the logic simple, transparent, and verifiable.
- The engine is a **pure function**: it takes a plain input object and returns a plain result object with no side effects or DOM dependencies. This is the single testable seam in the codebase.
- **Accumulation phase**: Each year, annual savings are added to the portfolio, investment gains are calculated, capital gains tax is deducted from gains, and the portfolio is compared to the inflation-adjusted FIRE number. Savings grow by the configured savings growth rate each year. FIRE is reached when the portfolio meets or exceeds the FIRE number.
- **Drawdown phase**: After FIRE, each year the portfolio earns investment returns (taxed at capital gains rate), and a gross withdrawal is deducted. The gross withdrawal = inflation-adjusted expenses ÷ (1 − withdrawal tax rate), reflecting the tax drag on distributions.
- **FIRE number** = inflation-adjusted annual expenses at FIRE year ÷ withdrawal rate.
- If the portfolio hits zero before the expected lifespan, the scenario is marked **unsustainable** and the depletion age is recorded.

### Scenario Management
- Up to **3 named scenarios**, managed entirely in client-side state.
- Users can create, duplicate, and delete scenarios (minimum 1 must exist).
- Each scenario has a distinct color used consistently in its card, chart line, and summary.

### Country Defaults
- **8 countries** supported in V1: USA, UK, Germany, Switzerland, Netherlands, Canada, Australia, Austria.
- Selecting a country auto-fills: currency, inflation rate, capital gains tax rate, withdrawal tax rate.
- All auto-filled values remain user-editable.
- Investment return is intentionally **not** set by country (it depends on asset allocation, not geography).

### Data Persistence
- **LocalStorage** auto-saves all scenario inputs and global settings on every change.
- A **Share button** encodes the full state into a URL hash (base64-compressed JSON) and copies it to the clipboard.
- On page load, URL hash takes priority over LocalStorage.

### Charting
- **Chart.js 4.x** via CDN for the portfolio trajectory line chart.
- X-axis: age. Y-axis: portfolio value (currency-formatted).
- One line per scenario, horizontal dashed line for FIRE threshold, vertical dashed line for FIRE year.
- Chart colors update on theme toggle.

### Styling and Theming
- **Dark/light toggle** with OS `prefers-color-scheme` as default.
- Dark theme: deep navy/charcoal with glassmorphism cards.
- Light theme: white/light gray with clean shadows.
- CSS custom properties for all design tokens. Smooth transition animations between themes.
- **Google Fonts (Inter)** for typography.

### Architecture
- **Vanilla HTML/CSS/JS** — no framework, no build step.
- JS organized as ES modules: `engine.js`, `scenarios.js`, `chart.js`, `countries.js`, `storage.js`, `theme.js`, `app.js`.
- Real-time recalculation on every input change, debounced at ~300ms.

### Deployment
- **GitHub Pages** via a **GitHub Action** triggered on push to `main`.
- The action deploys the static `src/` directory directly — no build step.

### Page Layout
- **Top-to-bottom single-page flow**: header → country selector → scenario cards (responsive grid: 3 → 2 → 1 columns) → chart → summary cards → collapsible detail tables → footer.

## Testing Decisions

### Testing Seam
The **calculation engine** is the single testing seam. It is a pure function with no DOM dependencies, making it trivially unit-testable in isolation.

### What Makes a Good Test
- Tests should exercise the engine's **external behavior**: given a set of inputs, assert the expected outputs (FIRE number, years to FIRE, sustainability, year-by-year balances).
- Tests should **not** assert internal implementation details like loop counters or intermediate variables.
- Edge cases to cover: zero savings, zero expenses, 100% tax rate, portfolio already above FIRE number, unsustainable scenarios, single-year retirement, very long lifespans.

### Prior Art
- No existing tests in the codebase (greenfield project). The engine module will be the first tested module and will establish the testing pattern for future work.

## Out of Scope

- **Monte Carlo simulation** or probabilistic return modeling — V1 is deterministic only.
- **Multiple asset classes** or portfolio rebalancing logic.
- **Detailed tax brackets** or progressive tax calculations — V1 uses flat rates.
- **Social security, pensions, or other income streams** in retirement.
- **Inflation-adjusted investment returns** (real vs. nominal) — V1 uses nominal returns and separate inflation.
- **User accounts or server-side storage** — all data stays in the browser.
- **Internationalization (i18n)** beyond currency symbols — the UI is English-only in V1.
- **Accessibility audit** — basic semantic HTML will be used, but a full WCAG audit is deferred.
- **CI/CD beyond deployment** — no automated test runner in the pipeline for V1.

## Further Notes

- The country default data (tax rates, inflation) represents **rough representative values** for V1 and is not tax advice. A disclaimer should be visible in the footer.
- The Share URL encoding should be compact enough to avoid URL length limits in browsers (~2,000 chars). Base64-encoded compressed JSON of 3 scenarios should fit well within this.
- The year-by-year table columns: Year, Age, Phase (Accumulation/Retirement), Annual Savings, Investment Gains, Taxes Paid, Withdrawal, End-of-Year Balance.
- Theme preference is stored in LocalStorage separately from scenario data so theme persists even if scenario data is cleared.
