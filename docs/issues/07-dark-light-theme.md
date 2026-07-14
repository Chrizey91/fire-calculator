# 07 — Dark/light theme

**What to build:** A theme system with dark and light modes, toggled via a button in the header. The theme defaults to the user's OS preference (via `prefers-color-scheme` media query). The dark theme uses a deep navy/charcoal background with glassmorphism cards (backdrop-filter blur, semi-transparent backgrounds, subtle glowing borders) and vibrant accent colors. The light theme uses white/light gray backgrounds with crisp card shadows and a professional color palette. All colors are driven by CSS custom properties on a `data-theme` attribute. The Chart.js chart updates its colors (grid lines, text, line colors) when the theme toggles. Theme preference persists in LocalStorage. The transition between themes is smooth (CSS transition on background and color properties).

**Blocked by:** 03 — Portfolio lifecycle chart

**Status:** ready-for-agent

- [ ] All colors defined as CSS custom properties under `[data-theme="light"]` and `[data-theme="dark"]`
- [ ] Toggle button in the header (sun/moon icon or similar)
- [ ] Default theme detected from `prefers-color-scheme` media query
- [ ] Dark theme: deep navy/charcoal background, glassmorphism cards with backdrop-filter blur, glowing accent borders, vibrant gradients
- [ ] Light theme: white/light gray background, crisp shadows, professional blue/green palette
- [ ] Chart.js colors (grid, text, tooltips, line colors) update when theme changes
- [ ] Smooth CSS transition between themes (300–500ms on background-color, color, border-color, box-shadow)
- [ ] Theme preference stored in LocalStorage, restored on page load
- [ ] Toggle works correctly on all page elements: header, forms, cards, chart, tables, footer
