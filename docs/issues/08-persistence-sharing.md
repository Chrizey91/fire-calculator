# 08 — Persistence + sharing

**What to build:** Automatic persistence of all user inputs via LocalStorage, and a Share button that generates a URL encoding the full application state. On every input change, the complete state (all scenario inputs, scenario names, selected country) is serialized and saved to LocalStorage. When the user returns, their scenarios reload exactly as they left them. A Share button in the header encodes the full state into the URL hash (base64-compressed JSON) and copies the URL to the clipboard, showing a brief toast notification ("Link copied!"). On page load, the URL hash is checked first — if present, it takes priority over LocalStorage, allowing shared links to work. If neither exists, the app starts with a single empty scenario.

**Blocked by:** 04 — Multi-scenario comparison

**Status:** ready-for-agent

- [ ] All scenario inputs + global settings (country, currency) auto-saved to LocalStorage on every input change
- [ ] On page load: check URL hash → if present, decode and restore state; else check LocalStorage → if present, restore state; else start with one empty default scenario
- [ ] Share button in the header area
- [ ] Clicking Share encodes full state as base64-compressed JSON in the URL hash
- [ ] URL copied to clipboard with a brief toast notification ("Link copied!")
- [ ] Toast notification auto-dismisses after ~2 seconds
- [ ] Shared URLs correctly restore: number of scenarios, all input values, scenario names, selected country
- [ ] State encoding is compact enough to stay under ~2,000 character URL length
- [ ] Theme preference stored separately (not part of shared URL, only in LocalStorage)
