# No Safe Withdrawal Rate Input — Derived from Dynamic Simulation

The calculator does not expose a Safe Withdrawal Rate (SWR) input (e.g. the common "4% rule"). Instead, portfolio sustainability is determined by running the full annual simulation: each year during the Drawout Phase the portfolio earns ROI then the gross annual withdrawal is subtracted. The FIRE Number emerges from this simulation rather than from a static SWR formula. We chose this approach because it is more accurate (it naturally handles the interaction between ROI, inflation, deduction rate, and additional retirement income), is consistent with the rest of the simulation model, and avoids presenting a simplified percentage that users may misapply.

## Considered Options

- **Static SWR input (e.g. 4% rule)**: Simple formula, widely recognised in the FIRE community, but masks the interaction between ROI, inflation, and deductions. A 4% rule derived under one set of assumptions is misleading when applied to a different ROI or inflation rate.
- **Dynamic simulation (chosen)**: Slightly more complex to implement but produces results that are directly consistent with the user's configured inputs.
