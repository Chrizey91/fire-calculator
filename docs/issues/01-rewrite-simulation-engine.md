# 01 — Rewrite simulation engine

**What to build:** A pure simulation function with the v2 interface. Given a complete set of user inputs and a Drawout Date, it runs an annual simulation from current age to age 100 and returns a year-by-year data structure plus summary values. No DOM access, no side effects.

The function must handle:
- Accumulation Phase: portfolio grows by ROI each year; Monthly Savings (×12) are added; Monthly Savings compounds annually by the Savings Growth Rate until the Drawout Date.
- Drawout Phase: no new contributions; the required gross annual withdrawal is computed each year by inflation-adjusting the Target Net Monthly Income, subtracting Additional Retirement Income, and grossing up by the Deduction Rate; portfolio earns ROI then the gross withdrawal is subtracted; portfolio flatlines at 0 once depleted, never negative.
- Each year's record emits both nominal and real (inflation-deflated) values for portfolio value and monthly withdrawal amount.
- FIRE Number: derived by back-solving the drawdown simulation — the minimum portfolio at the Drawout Date that sustains withdrawals to age 100 without hitting zero. No static Safe Withdrawal Rate formula.
- Summary values returned: FIRE Number, Projected FIRE Age (first year portfolio ≥ FIRE Number during Accumulation), Portfolio at Retirement (portfolio value at Drawout Date), Runway (years until depletion, or null if portfolio survives to 100).

All 10 engine test cases from the spec must pass:
- Accumulation only (never reaches FIRE Number)
- Clean FIRE reach (Projected FIRE Age correct)
- Sustainable drawout (no depletion)
- Depletion (flatlines at correct age, Runway correct)
- Savings Growth Rate compounding (stops at Drawout Date)
- Inflation grossing-up of withdrawal (real purchasing power maintained)
- Deduction Rate grossing-up
- Additional Retirement Income offset
- Real vs Nominal values per year
- Age-100 boundary and zero-floor boundary

**Blocked by:** None — can start immediately.

**Status:** done

- [x] `simulate(inputs)` accepts: `currentAge`, `currentPortfolioValue`, `monthlySavings`, `savingsGrowthRate`, `roi`, `inflationRate`, `targetNetMonthlyIncome`, `deductionRate`, `additionalRetirementIncome`, `drawoutAge`
- [x] Returns year-by-year array with `age`, `calendarYear`, `phase`, `nominalPortfolio`, `realPortfolio`, `nominalMonthlyWithdrawal`, `realMonthlyWithdrawal` per entry
- [x] Returns summary object with `fireNumber`, `projectedFireAge`, `portfolioAtRetirement`, `runway`
- [x] Portfolio flatlines at 0 and never goes negative
- [x] Simulation runs exactly from `currentAge` to age 100 (inclusive)
- [x] All 10 specified test cases pass (16 tests total, all green)
