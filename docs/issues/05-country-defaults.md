# 05 — Country defaults

**What to build:** A country dropdown in the global settings area (above the scenario cards) that, when changed, auto-fills realistic default values into the scenario input fields. Supported countries: USA, UK, Germany, Switzerland, Netherlands, Canada, Australia, Austria. Selecting a country sets: currency (used in all formatting), inflation rate, capital gains tax rate, and withdrawal tax rate. Investment return is intentionally not set by country. All auto-filled values remain fully editable by the user after population. The currency symbol updates throughout the UI (summary cards, chart axis, detail tables) when the country changes.

**Blocked by:** 02 — Single scenario UI + live results

**Status:** ready-for-agent

- [ ] Country dropdown in a global settings bar above scenario cards
- [ ] 8 countries supported with flag emoji labels: 🇺🇸 USA, 🇬🇧 UK, 🇩🇪 Germany, 🇨🇭 Switzerland, 🇳🇱 Netherlands, 🇨🇦 Canada, 🇦🇺 Australia, 🇦🇹 Austria
- [ ] Selecting a country populates: currency symbol, inflation rate, capital gains tax rate, withdrawal tax rate into all scenario forms
- [ ] Auto-filled values remain editable (no locking or disabling of fields)
- [ ] Currency symbol updates in summary cards and chart axis formatting
- [ ] Country data stored in a dedicated module with representative rates for each country
- [ ] Changing country triggers recalculation of all scenarios
