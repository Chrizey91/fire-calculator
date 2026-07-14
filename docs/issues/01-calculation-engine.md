# 01 — Calculation engine + tests

**What to build:** A pure simulation function that models the full FIRE lifecycle — accumulation phase (annual savings, investment growth, capital gains tax) and drawdown phase (inflation-adjusted withdrawals, withdrawal tax, portfolio depletion tracking). Given a set of financial inputs, it returns the FIRE number, years to FIRE, age at FIRE, sustainability status, depletion age (if unsustainable), total contributions vs. growth, and a year-by-year breakdown array. The function has no DOM dependencies and no side effects. Comprehensive unit tests verify the math across normal cases and edge cases (zero savings, portfolio already above FIRE number, unsustainable scenarios, 100% tax rate, single-year retirement).

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Simulation function accepts an input object with: current age, expected lifespan, current portfolio value, annual savings, savings growth rate, annual expenses, inflation rate, investment return rate, withdrawal rate, capital gains tax rate, withdrawal tax rate
- [ ] Accumulation phase: each year adds savings (growing by savings growth rate), calculates investment gains, deducts capital gains tax from gains, checks if portfolio meets inflation-adjusted FIRE number
- [ ] FIRE number calculated as inflation-adjusted expenses at FIRE year ÷ withdrawal rate
- [ ] Drawdown phase: each year earns investment returns (taxed at capital gains rate), deducts gross withdrawal (expenses ÷ (1 − withdrawal tax rate)), tracks portfolio depletion
- [ ] Returns structured result: fireNumber, yearsToFire (or null), ageAtFire, totalContributions, totalGrowth, isSustainable, depletionAge, yearByYear array
- [ ] Year-by-year entries include: year, age, phase (accumulation/retirement), savings, gains, taxes, withdrawal, endBalance
- [ ] Unit tests cover: typical scenario reaching FIRE, scenario that never reaches FIRE, unsustainable drawdown, zero savings, portfolio already above FIRE number, high tax rates, varying inflation
