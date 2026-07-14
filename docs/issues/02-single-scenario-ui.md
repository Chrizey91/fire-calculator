# 02 — Single scenario UI + live results

**What to build:** A single-page HTML application where the user fills in one scenario's financial inputs and immediately sees their FIRE results in a summary card. The form includes all input fields (current age, expected lifespan, current portfolio value, annual savings, savings growth rate, annual expenses, inflation rate, investment return, withdrawal rate, capital gains tax, withdrawal tax) with sensible placeholder text. On every input change (debounced at ~300ms), the calculation engine runs and a summary card updates showing: FIRE number, years to FIRE, age at FIRE, total contributions vs. total investment growth, and sustainability status (green if sustainable, red if unsustainable with depletion age shown). Basic responsive styling with Inter font from Google Fonts, clean card layout, and a professional look.

**Blocked by:** 01 — Calculation engine + tests

**Status:** ready-for-agent

- [ ] HTML page with a single scenario input form containing all fields from the spec
- [ ] Input fields have appropriate types (number), step values, and placeholder/default values (withdrawal rate = 4%, investment return = 7%, lifespan = 85)
- [ ] Form wired to the calculation engine with ~300ms debounce on input events
- [ ] Summary card displays: FIRE number (formatted with currency symbol), years to FIRE, age at FIRE, total contributions, total investment growth, sustainability status
- [ ] Unsustainable scenarios visually flagged (red styling, depletion age shown)
- [ ] Basic responsive layout using CSS Grid or Flexbox
- [ ] Inter font loaded from Google Fonts
- [ ] Semantic HTML structure (single h1, proper heading hierarchy, labels on inputs)
- [ ] Page has proper title tag and meta description
