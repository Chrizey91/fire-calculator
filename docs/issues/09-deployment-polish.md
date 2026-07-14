# 09 — GitHub Action + deployment polish

**What to build:** A GitHub Action workflow that deploys the static site to GitHub Pages on every push to `main`. The workflow uploads the `src/` directory as a Pages artifact and deploys it — no build step needed. Additionally, update the README with a project description, features list, and local development instructions. Add a footer to the page with a disclaimer ("This calculator is for educational purposes only and does not constitute financial advice"), a link to the GitHub repo, and any final responsive and animation polish: micro-interactions on hover (card lifts, button glows), smooth transitions on collapsible sections, and a favicon.

**Blocked by:** 06 — Year-by-year detail tables, 07 — Dark/light theme, 08 — Persistence + sharing

**Status:** ready-for-agent

- [ ] GitHub Action workflow file that triggers on push to `main`
- [ ] Workflow uses `actions/upload-pages-artifact` to upload `src/` and `actions/deploy-pages` to deploy
- [ ] Site is live on GitHub Pages after a push to main
- [ ] README updated with: project description, features list, local dev instructions ("open src/index.html or use a local server"), deployment info
- [ ] Footer with disclaimer text, GitHub repo link
- [ ] Favicon (SVG fire/flame icon) in the assets directory, referenced in the HTML head
- [ ] Micro-animations: card hover lift (translateY + shadow increase), button hover glow, input focus ring animation
- [ ] Smooth expand/collapse animation on year-by-year tables
- [ ] Final responsive check: all elements look correct at desktop (1200px+), tablet (768px), and mobile (375px) widths
