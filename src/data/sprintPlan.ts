import { DayPlan } from '../types';

export const SPRINT_PLAN: DayPlan[] = [
  // --- DAY 1 (UNLOCKED DEMO) ---
  {
    dayNumber: 1,
    title: 'Playwright Internals & Process Architecture',
    subtitle: 'Browser, BrowserContext, Page, CDP/WebSocket & out-of-process model',
    phase: 'Phase 1: Foundations, Resilient Locators & Auto-waiting',
    estimatedHours: 2.5,
    objectives: [
      {
        title: 'Browser -> BrowserContext -> Page Hierarchy & In-Memory Micro-Profiles',
        details: 'A `Browser` instance represents a single heavy OS binary process (e.g., Chromium, consuming hundreds of MB of RAM and 2–5 seconds to start). Instead of restarting the browser for each test, Playwright allocates a `BrowserContext`—an isolated incognito-like profile in memory taking under 2 milliseconds to create. Every `BrowserContext` gets completely separate cookies, `localStorage`, `sessionStorage`, cache, and permissions. A `Page` is an individual tab inside a context.',
        codeSnippet: `// How Playwright isolates tests without restarting browser binaries:
const browser = await chromium.launch(); // 1 binary process per worker

// Test 1:
const context1 = await browser.newContext(); // Isolated memory (< 2ms)
const page1 = await context1.newPage();
await page1.goto('https://app.example.com');

// Test 2 (separate session, zero cookie leakage, full parallelism):
const context2 = await browser.newContext();
const page2 = await context2.newPage();`,
        interviewTip: 'When an interviewer asks: "How does Playwright stay fast while keeping tests completely isolated?", answer: "Browser launches once per worker, and each test gets a fresh in-memory BrowserContext in milliseconds—zero state leakage without binary restart overhead."'
      },
      {
        title: 'Out-of-process Architecture (Playwright) vs In-process (Cypress)',
        details: 'Cypress executes tests in-process inside a browser `<iframe>`, sharing the JavaScript event loop with your application. This creates structural limits around multi-tab workflows, cross-origin OAuth redirects, and CPU contention. Playwright runs out-of-process in Node.js and controls browsers externally over native protocols (CDP/WebSocket), giving you multi-tab, multi-domain, and full OS network control with 100% production fidelity.',
        codeSnippet: `// Drive two separate domains and tabs effortlessly in Playwright:
const context = await browser.newContext();
const pageA = await context.newPage();
const pageB = await context.newPage();

await pageA.goto('https://app.example.com/login');
await pageB.goto('https://mail.example.com/inbox'); // Cross-origin domain
// Read 2FA verification code from pageB and submit it on pageA`,
        interviewTip: 'Highlight that Playwright never wraps your app in an iframe or monkey-patches application code, preserving full production fidelity.'
      },
      {
        title: 'Three-Tier Process Pipeline: Node.js Client <-> Driver/Server <-> Browser Binary',
        details: 'Communication in Playwright flows across three layers:\n1. **Node.js Test Worker** (your test code calling `locator.click()`).\n2. **Playwright Core Driver / Server** (an RPC dispatcher serializing commands according to `protocol.yml`).\n3. **Browser Process** (Chromium, WebKit, or Firefox C++ binaries).\nUnlike legacy Selenium’s slow HTTP REST polling, Playwright communicates over OS anonymous pipes (`--remote-debugging-pipe`) or persistent WebSockets using asynchronous JSON-RPC messages and real-time event streams.',
        codeSnippet: `// Low-level communication pipeline:
// [Node.js Test Worker]
//       │  (JSON-RPC over OS Anonymous Pipe / WebSocket)
//       ▼
// [Playwright Driver Dispatcher]
//       │  (CDP Domains: DOM, Page, Network, Runtime, Input)
//       ▼
// [Chromium / WebKit / Firefox C++ Binary]
//       │  (Native browser input events: Input.dispatchMouseEvent)
//       ▼
// [Application DOM]`,
        interviewTip: 'Mention that Playwright uses anonymous OS pipes by default for Chromium, avoiding TCP port exhaustion and firewall headaches on CI runners.'
      },
      {
        title: 'Multi-Page & Popup Handling Without Race Conditions',
        details: 'Enterprise apps routinely open popups or new tabs (Google/SSO login, PDF previews, payment portals). In Playwright, a new window is simply another `Page` within the same `BrowserContext`. To capture popups deterministically without race conditions, wrap `waitForEvent("popup")` and the triggering click inside `Promise.all`.',
        codeSnippet: `// Race-free popup handling pattern:
const [popupPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('button', { name: 'Sign in with SSO' }).click(),
]);

await popupPage.waitForLoadState();
await popupPage.getByLabel('Email').fill('alex@company.com');
await popupPage.getByRole('button', { name: 'Continue' }).click();

// Return focus to main page:
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();`,
        interviewTip: 'Emphasize why `Promise.all` is critical: attaching the `popup` listener before or concurrently with the click prevents missing fast-opening windows.'
      }
    ],
    deepDiveContent: {
      summary: 'In Senior Playwright interviews, recruiters open with architecture questions to separate engineers who understand browser internals from script writers.',
      keyConcepts: [
        {
          title: 'BrowserContext as an In-Memory Micro-Profile',
          explanation: 'One Browser binary starts per worker, while every test receives an isolated BrowserContext with private cookies, storage, and cache in under 2ms.',
        },
        {
          title: 'Process Architecture: Node.js <-> Driver <-> Browser Engine',
          explanation: 'Three-tier event-driven architecture over OS pipes and WebSockets instead of legacy HTTP WebDriver polling.',
        }
      ],
      seniorPitfalls: [
        'Confusing Browser with BrowserContext (claiming every test launches a separate browser binary is a Senior red flag).',
        'Not knowing how Playwright runs WebKit on Linux CI (custom open-source WebKit builds with an internal protocol adapter).',
        'Assuming Playwright uses Selenium HTTP WebDriver APIs under the hood.'
      ],
      practiceTasks: [
        'Write a test using two separate BrowserContext sessions simulating two users interacting in real time.',
        'Capture a popup tab using `Promise.all([page.waitForEvent("popup"), ...])`.',
        'Inspect OS processes (`ps aux | grep playwright` or Task Manager) during a test run to observe Node.js <-> Browser parent-child processes.'
      ],
      interviewQuestionsHighlighted: ['arch-1', 'arch-2', 'arch-3', 'arch-4'],
      sourceMaterials: [
        {
          title: 'Official Playwright GitHub Repository (Core Protocol & Server)',
          url: 'https://github.com/microsoft/playwright/tree/main/packages/playwright-core/src/server',
          description: 'Key directories: `src/server/chromium/`, `src/server/firefox/`, `src/server/webkit/` and `src/protocol/protocol.yml`.'
        },
        {
          title: 'Architecture Talks by Pavel Feldman & Andrey Lushnikov',
          url: 'https://www.youtube.com/results?search_query=playwright+architecture+pavel+feldman+andrey+lushnikov',
          description: 'Playwright creators explain moving away from HTTP REST WebDriver polling to multiplexed event streams.'
        },
        {
          title: 'Chrome DevTools Protocol (CDP) Specification',
          url: 'https://chromedevtools.github.io/devtools-protocol/',
          description: 'Official documentation for CDP domains (Network, Runtime, Target, Page) powering Chromium automation.'
        },
        {
          title: 'Playwright Docs: Browsers & Remote Connections',
          url: 'https://playwright.dev/docs/browsers',
          description: 'Overview of bundled browser binaries, `--with-deps`, and Docker execution.'
        }
      ]
    },
    suggestedQuestionCategory: 'architecture'
  },

  // --- DAY 2 (UNLOCKED DEMO) ---
  {
    dayNumber: 2,
    title: 'Resilient Locators & Auto-waiting Internals',
    subtitle: 'getByRole, Accessibility Tree, Shadow DOM, iframe & actionability checks',
    phase: 'Phase 1: Foundations, Resilient Locators & Auto-waiting',
    estimatedHours: 3,
    objectives: [
      {
        title: 'Prioritizing User-Facing Locators (Accessibility Object Model)',
        details: 'Playwright’s core philosophy: test the app the way real users and screen readers experience it. Locator hierarchy:\n1. `getByRole(role, { name })` — top priority; validates HTML semantics and accessible names.\n2. `getByLabel(text)` — best for labeled form inputs.\n3. `getByPlaceholder(text)` — fallback for unlabeled inputs.\n4. `getByText(text)` — for non-interactive status copy.\n5. `getByTestId(id)` — explicit hook when semantic roles do not disambiguate.\nAvoid CSS styling classes and structural XPath.',
        codeSnippet: `// ❌ Brittle Selenium-style selector:
await page.locator('.btn-primary.btn-large.submit-v2').click();

// ✅ Resilient Playwright AOM locator:
await page.getByRole('button', { name: 'Submit order' }).click();`,
        interviewTip: 'Point out the dual benefit of `getByRole`: styling refactors (e.g., Tailwind migrations) never break tests, and it enforces real accessibility semantics.'
      },
      {
        title: 'Full Actionability Checklist Before Every Interaction',
        details: 'Before executing `click()`, `fill()`, or `check()`, Playwright automatically runs six actionability checks:\n- **Attached**: node is connected to the DOM.\n- **Visible**: non-zero bounding box and not hidden.\n- **Stable**: bounding box coordinates match across two consecutive animation frames.\n- **Enabled**: no `disabled` attribute or disabled fieldset.\n- **Editable**: for text entry, not `readonly`.\n- **Receives Events**: hit-testing confirms no spinner, overlay, or toast intercepts pointer events.',
        codeSnippet: `// All actionability checks run automatically in a loop:
await page.getByRole('button', { name: 'Save' }).click();
// Even during slide-in animations or transient loaders, Playwright waits until stable and unobstructed.`,
        interviewTip: 'When a click hangs in CI, Senior engineers check for infinite CSS transitions (failing stability) or invisible overlays blocking hit-testing.'
      },
      {
        title: 'Automatic Shadow DOM Piercing',
        details: 'Web Components encapsulate markup inside `#shadow-root`. Unlike Selenium’s manual `shadowRoot.querySelector` scripts, Playwright CSS, text, label, and role locators pierce open shadow roots automatically with zero configuration. Only XPath is unsupported inside Shadow DOM per W3C spec.',
        codeSnippet: `// Pierces nested Shadow Roots automatically:
await page.getByLabel('Discount code').fill('VIP-2026');`,
        interviewTip: 'Highlight how native shadow-piercing removes brittle helper utilities in micro-frontend architectures built with Lit or Web Components.'
      },
      {
        title: 'Filtering & Chaining Locators (.filter({ hasText, has }))',
        details: 'Never use positional indexes like `.nth(2)` or `//tr[3]` on dynamic tables or product grids. Filter collections by visible content or nested child locators so test stability is independent of sorting order.',
        codeSnippet: `// Filter a table row by text:
const targetRow = page.getByRole('row').filter({ hasText: 'Invoice #INV-2026' });

// Filter a card containing an in-stock button:
const card = page.getByRole('article').filter({
  has: page.getByRole('button', { name: 'Add to cart' })
});

await targetRow.getByRole('button', { name: 'Details' }).click();`,
        interviewTip: 'Explain that `.filter()` returns a lazy Locator and chains cleanly, keeping tests immune to database sort changes.'
      },
      {
        title: 'Automated Accessibility Testing (A11y) with @axe-core/playwright',
        details: 'Combine `AxeBuilder` WCAG 2.1 AA scans (`withTags(["wcag2a", "wcag2aa", "wcag21aa"])`) with `.include()` / `.exclude()` scoping and keyboard navigation assertions (`page.keyboard.press("Tab")` + `toBeFocused()`).',
        codeSnippet: `import AxeBuilder from '@axe-core/playwright';

test('checkout form passes WCAG 2.1 AA checks', async ({ page }) => {
  await page.goto('/checkout');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('#third-party-widget')
    .analyze();
  expect(results.violations).toEqual([]);
});`,
        interviewTip: 'Note that automated Axe checks catch ~30–50% of WCAG issues; keyboard navigation and screen reader testing complete the picture.'
      },
      {
        title: 'Nested <iframe> Automation with page.frameLocator()',
        details: 'Payment gateways and embedded widgets frequently render inside `<iframe>` elements. Use `page.frameLocator(...)` (lazy with auto-waiting) instead of legacy `page.frame()` together with row filtering.',
        codeSnippet: `const row = page.getByRole('row').filter({ hasText: 'Invoice #INV-2026' });
await row.getByRole('button', { name: 'Details' }).click();

const paymentFrame = page.frameLocator('iframe[title="Payment Gateway"]');
await paymentFrame.getByRole('button', { name: 'Confirm transaction' }).click();`,
        interviewTip: 'Emphasize that `frameLocator()` is lazy—just like `Locator`, it does not query the DOM until an action or assertion executes.'
      }
    ],
    deepDiveContent: {
      summary: 'Test reliability starts with Accessibility Tree locators. Interviewers immediately verify you avoid XPath/sleeps and can handle dynamic tables, Shadow DOM, and iframes.',
      keyConcepts: [
        {
          title: 'Actionability Pipeline Before Clicks',
          explanation: 'Real-time checks for attached, visible, stable, enabled, editable, and hit-testing before every input event.',
        }
      ],
      seniorPitfalls: [
        'Using `page.waitForTimeout(3000)` or `sleep()`—an instant disqualifier.',
        'Relying on generated IDs (`#react-select-3-input`) or fragile `.nth(2)` table row indexes.'
      ],
      practiceTasks: [
        'Solve Challenge 1: Refactor brittle XPath and `waitForTimeout` calls on `/shop`.',
        'Solve Challenge 2: Automate the dynamic table + Shadow DOM + iframe flow on `/invoices`.'
      ],
      interviewQuestionsHighlighted: ['loc-1', 'loc-2', 'loc-3', 'a11y-axe'],
      suggestedChallengeId: 'challenge-resilient-locators',
      suggestedChallengeIds: ['challenge-resilient-locators', 'challenge-table-shadow-iframe']
    },
    suggestedChallengeId: 'challenge-resilient-locators',
    suggestedChallengeIds: ['challenge-resilient-locators', 'challenge-table-shadow-iframe'],
    suggestedQuestionCategory: 'locators'
  },

  // --- DAY 3 (UNLOCKED DEMO) ---
  {
    dayNumber: 3,
    title: 'Web-First Assertions, Async Flows & Polling',
    subtitle: 'expect(locator).toBe* vs instant checks, expect.poll & expect.toPass',
    phase: 'Phase 1: Foundations, Resilient Locators & Auto-waiting',
    estimatedHours: 2.5,
    objectives: [
      {
        title: 'Auto-retrying Web-First Assertions vs Instant Boolean Checks',
        details: 'A classic trap when migrating to Playwright: calling `expect(await locator.isVisible()).toBe(true)`. Because `isVisible()` evaluates immediately in a single millisecond, any async React re-render causes flakiness. Web-first assertions like `await expect(locator).toBeVisible()` retry continuously until the timeout expires.',
        codeSnippet: `// ❌ FLAKY (no retry, instant snapshot):
const isShown = await page.getByRole('alert').isVisible();
expect(isShown).toBe(true);

// ✅ RELIABLE (auto-retrying web-first assertion):
await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });`,
        interviewTip: 'Never forget `await` before web-first assertions—locator assertions are asynchronous and return Promises.'
      },
      {
        title: 'Asynchronous State Polling with expect.poll()',
        details: 'When waiting on background jobs, queues, or API endpoints (`PENDING -> PROCESSING -> COMPLETED`), replace brittle `while(true)` sleep loops with `expect.poll()`. It supports custom backoff intervals, scoped timeouts, Trace Viewer history, and clear business failure messages.',
        codeSnippet: `await expect.poll(
  async () => {
    const res = await request.get(\`/api/jobs/\${jobId}\`);
    return (await res.json()).status;
  },
  {
    message: \`Job \${jobId} did not reach COMPLETED status in time\`,
    intervals: [500, 1000, 2000],
    timeout: 15_000,
  }
).toBe('COMPLETED');`,
        interviewTip: 'Mention `expect.poll` as the idiomatic replacement for custom busy-waiting loops in API/E2E integration tests.'
      },
      {
        title: 'Retrying Multi-Step Blocks with expect.toPass()',
        details: 'When an entire multi-step sequence must succeed together (for example, reloading a page until an exported PDF link appears), wrap the block inside `expect(async () => { ... }).toPass({ intervals, timeout })`.',
        codeSnippet: `await expect(async () => {
  await page.reload();
  await expect(page.getByText('Status: Ready to download')).toBeVisible();
}).toPass({
  intervals: [1000, 2000],
  timeout: 10_000,
});`,
        interviewTip: 'Use `expect.toPass()` selectively for eventual-consistency workflows—never to mask genuine UI race conditions.'
      },
      {
        title: 'Scoped Timeouts & Business-Readable Assertion Messages',
        details: 'A raw failure like `Expected: true, Received: false` wastes triage time in CI. Every Playwright web-first assertion accepts an optional custom `{ message }` parameter alongside scoped `{ timeout }` overrides.',
        codeSnippet: `await expect(page.getByRole('table'), {
  message: 'Billing table failed to load after switching currency to USD'
}).toBeVisible({ timeout: 8000 });`,
        interviewTip: 'Senior engineers design tests for fast CI observability—meaningful assertion messages cut triage time dramatically.'
      }
    ],
    deepDiveContent: {
      summary: 'Switching from instant synchronous checks to auto-retrying assertions and `expect.poll` eliminates 80% of self-inflicted test flakiness.',
      keyConcepts: [
        {
          title: 'Web-First Retrying vs Instant Evaluation',
          explanation: 'await expect(locator).toBeVisible() retries until timeout; locator.isVisible() evaluates once immediately.',
        }
      ],
      seniorPitfalls: [
        'Forgetting `await` on asynchronous `expect(locator)` assertions.',
        'Writing manual `while` sleep loops instead of `expect.poll`.'
      ],
      practiceTasks: [
        'Solve Challenge 3: Poll `/api/jobs/{id}` on `/batch-jobs` until `COMPLETED` using `expect.poll()`.',
        'Practice custom assertion messages and Module Augmentation for custom TypeScript matchers.'
      ],
      interviewQuestionsHighlighted: ['loc-4', 'loc-5', 'ts-3'],
      suggestedChallengeId: 'challenge-expect-poll'
    },
    suggestedChallengeId: 'challenge-expect-poll',
    suggestedQuestionCategory: 'locators'
  },

  // --- DAYS 4 TO 14 (DEMO LOCKED — OUTLINE ONLY) ---
  {
    dayNumber: 4,
    title: 'Network Interception & API Route Mocking',
    subtitle: 'page.route(), route.fulfill(), route.abort() & error simulation',
    phase: 'Phase 2: Network Mocking, Interception & Auth State',
    estimatedHours: 3.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 5,
    title: 'API Testing & Hybrid Scenarios (API + UI)',
    subtitle: 'APIRequestContext, data seeding, Zod schema contracts',
    phase: 'Phase 2: Network Mocking, Interception & Auth State',
    estimatedHours: 2.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 6,
    title: 'Authentication & State Management at Scale',
    subtitle: 'storageState, auth.setup.ts & multi-role RBAC testing',
    phase: 'Phase 2: Network Mocking, Interception & Auth State',
    estimatedHours: 3,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 7,
    title: 'Page Object Model (POM) — Senior Standards',
    subtitle: 'Component composition, Fluent Interface & single responsibility',
    phase: 'Phase 3: Advanced POM, Custom Fixtures & DI',
    estimatedHours: 3,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 8,
    title: 'Custom Fixtures & Dependency Injection',
    subtitle: 'test.extend(), guaranteed teardown & worker vs test scope',
    phase: 'Phase 3: Advanced POM, Custom Fixtures & DI',
    estimatedHours: 3.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 9,
    title: 'Enterprise playwright.config.ts Architecture',
    subtitle: 'Workers, retries, multi-level timeouts & custom reporters',
    phase: 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling',
    estimatedHours: 2.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 10,
    title: 'CI/CD Sharding, Parallelization & Docker',
    subtitle: 'Scaling test suites with --shard, merge-reports & browser caching',
    phase: 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling',
    estimatedHours: 3.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 11,
    title: 'Flaky Test Diagnostics, Tooling & Playwright MCP',
    subtitle: 'Trace Viewer, UI Mode, hydration races & @playwright/mcp',
    phase: 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling',
    estimatedHours: 3,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 12,
    title: 'Visual Regression & Environment Emulation',
    subtitle: 'toHaveScreenshot(), dynamic masking, geolocation & viewports',
    phase: 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling',
    estimatedHours: 2.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 13,
    title: 'Live Coding Under Time Pressure (JS/TS Async)',
    subtitle: 'Think-aloud protocol, Promise.all & generic retry<T> utilities',
    phase: 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling',
    estimatedHours: 3.5,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  },
  {
    dayNumber: 14,
    title: 'Mock Technical Interview & Strategic Q&A',
    subtitle: 'Full dress rehearsal, STAR stories & Hiring Manager alignment',
    phase: 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling',
    estimatedHours: 3,
    isDemoLocked: true,
    objectives: [],
    deepDiveContent: {
      summary: 'Available in the full edition.',
      keyConcepts: [],
      seniorPitfalls: [],
      practiceTasks: [],
      interviewQuestionsHighlighted: []
    }
  }
];
