# 04 — Multi-scenario comparison

**What to build:** Support for up to 3 named scenarios displayed side-by-side as input cards. The user starts with one scenario and can add more (up to 3) via an "Add Scenario" button, or duplicate an existing scenario. Each scenario has an editable name and a distinct color that is used consistently on its card border/accent, chart line, and summary card. All scenarios are plotted on a single shared chart for direct visual comparison, each with its own FIRE threshold dashed line. A summary card appears for each scenario. Scenarios can be deleted as long as at least one remains. The responsive layout shows cards in a row on desktop (up to 3 columns) and stacks them on mobile.

**Blocked by:** 03 — Portfolio lifecycle chart

**Status:** ready-for-agent

- [ ] "Add Scenario" button creates a new scenario card with default values (hidden when 3 scenarios exist)
- [ ] "Duplicate" button on each scenario card clones its inputs into a new scenario
- [ ] "Delete" button on each scenario card removes it (hidden when only 1 scenario exists)
- [ ] Each scenario has an editable name field (defaults to "Scenario 1", "Scenario 2", "Scenario 3")
- [ ] Each scenario assigned a distinct color (e.g., blue, green, orange) used on card accent, chart line, and summary card
- [ ] Chart renders one line per scenario, each with its own color and FIRE threshold dashed line
- [ ] Summary cards rendered for each active scenario with the same result fields
- [ ] Responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- [ ] All scenarios recalculate and re-render when any input in any scenario changes
