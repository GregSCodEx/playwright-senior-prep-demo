# Playwright Senior Prep — Demo Edition (Days 1–3 Active)

Interactive preparation platform for **Senior Playwright Automation Engineers** (TypeScript).
In this **Demo Edition**, **Days 1–3** (curriculum, 11 interview Q&As, 3 live coding challenges, local Training Sandbox App, and Cheatsheet) are unlocked. Days 4–14 show the syllabus outline and open a preview notice modal when clicked, with all Day 4–14 files and answers excluded from the repository and downloadable `.ZIP` bundles.

---

## Quick Start (Local Machine)

### Prerequisites
- **Node.js** `v18+` or `v20+` (LTS)
- `npm`

### 1. Install dependencies & browsers
```bash
npm install
npx playwright install chromium
```

### 2. Run the Web Platform
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**. Progress is saved locally in `localStorage`.

---

## Local Practice Lab & Training Sandbox App (Days 1–3)

Run real Playwright tests against the local Express Training Sandbox (`http://127.0.0.1:4173`) covering:
1. `01-resilient-locators.spec.ts` (`/shop`)
2. `02-table-shadow-iframe.spec.ts` (`/invoices` — dynamic table, Shadow DOM, `frameLocator`)
3. `03-expect-poll.spec.ts` (`/batch-jobs` — async polling with `expect.poll`)

```bash
# Run starter exercises:
npm run lab:exercises

# Run verified reference solutions:
npm run lab:solutions

# Interactive Playwright UI Mode:
npm run lab:ui

# Static rule grader:
npm run lab:grade
npm run lab:grade:solutions
```

---

## Deploying to GitHub Pages (Static SPA)

This React application is 100% client-side with `base: './'` configured in `vite.config.ts` and a ready-to-use `.github/workflows/deploy.yml` workflow.

1. Push the repository to GitHub (`main` or `master` branch):
   ```bash
   git add .
   git commit -m "Deploy Demo Edition to GitHub Pages"
   git push origin main
   ```
2. On GitHub, open **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
4. The workflow builds `dist/` via `npm run build` and deploys automatically to `https://<username>.github.io/<repo-name>/`.
