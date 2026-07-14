# 06 — Year-by-year detail tables

**What to build:** A collapsible detail table for each scenario, placed below the chart and summary cards. Each table shows the full year-by-year breakdown of the simulation so users can verify the math and understand the cash flows. Tables are collapsed by default and expand on click. The table headers are: Year, Age, Phase (Accumulation/Retirement), Annual Savings, Investment Gains, Taxes Paid, Withdrawal, End-of-Year Balance. All monetary values are formatted with the active currency symbol. The FIRE year row is visually highlighted. Rows where the portfolio depletes are highlighted in red.

**Blocked by:** 04 — Multi-scenario comparison

**Status:** ready-for-agent

- [ ] One collapsible section per scenario, labeled with the scenario name and color
- [ ] Collapsed by default, expands/collapses on click with smooth animation
- [ ] Table columns: Year, Age, Phase, Annual Savings, Investment Gains, Taxes Paid, Withdrawal, End-of-Year Balance
- [ ] All monetary values formatted with currency symbol and thousand separators
- [ ] FIRE year row visually highlighted (e.g., bold or accent background)
- [ ] Depletion row (if unsustainable) highlighted in red/warning color
- [ ] Phase column shows "Accumulation" or "Retirement"
- [ ] Tables update in real-time alongside the chart and summary cards
- [ ] Tables are responsive (horizontally scrollable on narrow screens)
