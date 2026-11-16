import { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // --- DAY 1: ARCHITECTURE & INTERNALS ---
  {
    id: 'arch-1',
    category: 'architecture',
    categoryLabel: 'Architecture & Internals',
    level: 'Senior',
    sprintDay: 1,
    sprintDayTitle: 'Day 1: Playwright Internals',
    question: 'What is the fundamental architectural difference between Playwright and Cypress, and why does it matter for test stability?',
    shortAnswer: 'Playwright runs out-of-process in Node.js and communicates with browser engines over native protocols (CDP/BiDi), whereas Cypress runs in-process inside the browser sharing the same JavaScript event loop as the application under test.',
    detailedAnswer: 'Cypress executes test code inside an iframe within the browser. This creates inherent same-origin constraints, limits native multi-tab and multi-window automation, complicates external OAuth redirects, and shares main-thread JS execution with the application under test. Playwright runs as an external Node.js process communicating via persistent WebSocket or OS pipe channels directly with browser binaries (Chromium, Firefox, WebKit). This gives you 100% network control, seamless multi-tab and cross-origin workflows, and zero interference with application runtime behavior.',
    codeExample: `// Playwright cleanly drives two independent tabs/domains in one test:
const page1 = await context.newPage();
const page2 = await context.newPage();
await page1.goto('https://app.example.com/chat');
await page2.goto('https://app.example.com/chat');
// Full cross-tab synchronization with zero workarounds`,
    recruiterTraps: [
      'Describing Playwright as simply a "newer Selenium".',
      'Missing the in-process limitations of Cypress (no native multi-tab support, friction with cross-origin OAuth flows).'
    ],
    seniorPerspective: 'A Senior engineer highlights process isolation, cross-domain freedom, full OS-level network control, and the fact that Playwright never injects runner loops into your app runtime, guaranteeing production fidelity.',
    tags: ['Architecture', 'Cypress vs Playwright', 'Performance', 'CDP']
  },
  {
    id: 'arch-2',
    category: 'architecture',
    categoryLabel: 'Architecture & Internals',
    level: 'Senior',
    sprintDay: 1,
    sprintDayTitle: 'Day 1: Playwright Internals',
    question: 'Explain the hierarchy: Browser, BrowserContext, and Page. Why does Playwright avoid launching a new browser for every test?',
    shortAnswer: 'Browser is a single binary process (e.g., Chromium). BrowserContext is an isolated incognito-like profile in memory taking ~2ms to create. Page is a single tab inside a context, enabling fast, zero-leak isolation between tests.',
    detailedAnswer: 'In legacy Selenium setups, launching a fresh browser instance per test took 3–8 seconds, tempting teams to reuse sessions and suffer state leakage. Playwright launches one Browser instance per worker process, then allocates a fresh, isolated `BrowserContext` for each test. Every context has separate cookies, `localStorage`, `sessionStorage`, and cache—achieving 100% test isolation with millisecond overhead.',
    codeExample: `// What Playwright's built-in { page } fixture does under the hood:
const browser = await chromium.launch(); // Once per worker
const context = await browser.newContext(); // Per test (~2ms)
const page = await context.newPage(); // Fresh tab per test`,
    recruiterTraps: [
      'Confusing Browser and Page instances.',
      'Suggesting you must restart the entire browser binary to clear cookies and storage.'
    ],
    seniorPerspective: 'Senior engineers know how to optimize read-only tests or leverage worker-scoped browsers to maximize throughput inside memory-constrained CI containers.',
    tags: ['BrowserContext', 'Isolation', 'Memory', 'Optimization']
  },
  {
    id: 'arch-3',
    category: 'architecture',
    categoryLabel: 'Architecture & Internals',
    level: 'Principal',
    sprintDay: 1,
    sprintDayTitle: 'Day 1: Playwright Internals',
    question: 'How does Playwright run WebKit and Firefox tests on Linux CI without macOS or desktop Safari installed?',
    shortAnswer: 'Playwright ships patched open-source builds of WebKit and Firefox bundled with an internal automation protocol server, allowing real WebKit rendering and JavaScriptCore execution directly on Linux.',
    detailedAnswer: 'Apple Safari does not have a Linux version, but the underlying WebKit engine is open source. The Playwright team compiles upstream WebKit for Linux distributions (such as Ubuntu) along with required media and graphics dependencies and an internal CDP-like protocol adapter. Running WebKit inside a Linux Docker container exercises the real rendering engine and JavaScriptCore used by Safari without maintaining expensive macOS runner farms.',
    recruiterTraps: [
      'Claiming Playwright emulates Safari by spoofing the User-Agent string inside Chromium.',
      'Forgetting the `--with-deps` flag when installing browser OS dependencies on Linux CI.'
    ],
    seniorPerspective: 'Understanding that Linux WebKit captures ~99% of Safari rendering and JS engine quirks at a fraction of macOS cloud CI costs.',
    tags: ['WebKit', 'Linux CI', 'Docker', 'Architecture']
  },
  {
    id: 'arch-4',
    category: 'architecture',
    categoryLabel: 'Architecture & Internals',
    level: 'Senior',
    sprintDay: 1,
    sprintDayTitle: 'Day 1: Playwright Internals',
    question: 'How does Playwright differ from Puppeteer given that both were built by the same core engineering team?',
    shortAnswer: 'Puppeteer started at Google as a Chromium-only automation library over CDP. The original creators moved to Microsoft and built Playwright from the ground up as a cross-browser, full-featured test framework with a native runner, auto-waiting, web-first assertions, and fixtures.',
    detailedAnswer: 'Puppeteer began as a low-level Chromium library requiring an external test runner (Jest/Mocha), manual waiting utilities, and custom reporting, with limited cross-browser parity. Playwright provides `@playwright/test` as a batteries-included enterprise test framework featuring worker-based parallelization, web-first retrying assertions, Trace Viewer, UI Mode, and dependency-injected fixtures across Chromium, Firefox, and WebKit.',
    recruiterTraps: [
      'Pairing low-level `playwright` core with Jest instead of using the built-in `@playwright/test` runner.'
    ],
    seniorPerspective: 'Senior candidates articulate why `@playwright/test` outperforms Jest/Mocha for E2E (process-level worker isolation, fixture lifecycle management, and integrated trace artifacts).',
    tags: ['History', 'Puppeteer', 'Tooling']
  },

  // --- DAY 2: RESILIENT LOCATORS, AUTO-WAITING & A11Y ---
  {
    id: 'loc-1',
    category: 'locators',
    categoryLabel: 'Locators & Auto-waiting',
    level: 'Senior',
    sprintDay: 2,
    sprintDayTitle: 'Day 2: Resilient Locators & Auto-waiting',
    question: 'What is the official locator hierarchy and recommended selection strategy in Playwright?',
    shortAnswer: 'Always prioritize user-facing / accessibility locators: getByRole -> getByLabel -> getByPlaceholder -> getByText -> getByTestId. Treat CSS class selectors and XPath as a last resort.',
    detailedAnswer: 'Playwright encourages testing the way users and assistive technologies perceive the page via the Accessibility Object Model (AOM):\n1. `page.getByRole(\'button\', { name: \'Save\' })` — most resilient; validates HTML semantics and accessible naming.\n2. `page.getByLabel(\'Email address\')` — ideal for form controls.\n3. `page.getByPlaceholder(\'Search...\')` — helpful for search inputs without visible labels.\n4. `page.getByText(\'Success!\')` — for non-interactive status text.\n5. `page.getByTestId(\'cart-badge\')` — explicit contract when no semantic role applies.\n\nCSS class chains (`.btn-primary-v2`) and structural XPath (`//div[2]/span`) are brittle anti-patterns that break during routine styling refactors.',
    codeExample: `// ❌ Brittle:
await page.locator('button.submit-v2').click();

// ✅ Resilient (survives CSS and layout refactors):
await page.getByRole('button', { name: 'Submit order' }).click();`,
    recruiterTraps: [
      'Recommending XPath as a default locator strategy.',
      'Ignoring accessibility semantics (ARIA roles and labels) in test design.'
    ],
    seniorPerspective: 'Using `getByRole` nudges frontend developers toward semantic HTML (`<button>` instead of `<div onclick>`), improving overall product accessibility.',
    tags: ['Locators', 'getByRole', 'A11y', 'Best Practices']
  },
  {
    id: 'loc-2',
    category: 'locators',
    categoryLabel: 'Locators & Auto-waiting',
    level: 'Senior',
    sprintDay: 2,
    sprintDayTitle: 'Day 2: Resilient Locators & Auto-waiting',
    question: 'How does Playwright Auto-waiting work internally, and which actionability checks run before a click?',
    shortAnswer: 'Before performing an action like click(), Playwright continuously checks readiness criteria (actionability checks): Attached, Visible, Stable (no active CSS animation), Enabled, and Receiving Events (hit-testing). Only when all pass does it dispatch the input event.',
    detailedAnswer: 'Legacy frameworks threw `ElementNotInteractableException` whenever an element was animating or covered by a spinner. Prior to `locator.click()`, Playwright:\n1. Ensures the element is connected to the DOM (**Attached**).\n2. Verifies non-zero bounding box and visibility (**Visible**).\n3. Compares bounding boxes across two animation frames to verify movement stopped (**Stable**).\n4. Checks the element is not disabled (**Enabled**).\n5. Performs hit-testing at the click point to ensure no modal, overlay, or toast intercepts pointer events (**Receives Events**).\nIf any check fails, Playwright keeps retrying until the action timeout expires.',
    recruiterTraps: [
      'Claiming you still need `waitForSelector` before every click.',
      'Not knowing about animation stability or pointer-event hit-testing.'
    ],
    seniorPerspective: 'Knowing the actionability pipeline lets you diagnose hanging clicks instantly—usually caused by infinite CSS transitions or an invisible overlay capturing pointer events.',
    tags: ['Auto-waiting', 'Actionability', 'Internals']
  },
  {
    id: 'loc-3',
    category: 'locators',
    categoryLabel: 'Locators & Auto-waiting',
    level: 'Senior',
    sprintDay: 2,
    sprintDayTitle: 'Day 2: Resilient Locators & Auto-waiting',
    question: 'How does Playwright handle Shadow DOM, and why does it work out of the box in 99% of cases?',
    shortAnswer: 'CSS, text, and role locators in Playwright are automatically shadow-piercing—they traverse open shadow roots seamlessly without special syntax, unlike XPath.',
    detailedAnswer: 'Modern component systems and Web Components (Lit, FAST, Salesforce LWC, micro-frontends) encapsulate UI inside `#shadow-root` trees. In legacy Selenium you had to write `executeScript` helpers walking `element.shadowRoot`. In Playwright, semantic locators (`getByLabel`, `getByRole`) and CSS locators pierce open shadow roots automatically. Only XPath is excluded because the W3C XPath specification does not cross shadow boundaries.',
    codeExample: `// Works directly even if the input lives inside nested Shadow Roots:
await page.getByLabel('Discount code').fill('VIP-2026');`,
    recruiterTraps: [
      'Proposing `page.evaluate()` scripts to manually traverse `shadowRoot`.',
      'Using XPath selectors in apps built with Web Components.'
    ],
    seniorPerspective: 'Senior engineers highlight that native shadow-piercing eliminates hundreds of lines of brittle helper code in micro-frontend architectures.',
    tags: ['Shadow DOM', 'Web Components', 'Selectors']
  },
  {
    id: 'a11y-axe',
    category: 'a11y',
    categoryLabel: 'Accessibility (A11y)',
    level: 'Senior',
    sprintDay: 2,
    sprintDayTitle: 'Day 2: Resilient Locators & Auto-waiting',
    question: 'How do you implement automated Accessibility (A11y) testing in Playwright using @axe-core/playwright and WCAG 2.1 AA?',
    shortAnswer: 'Use the official @axe-core/playwright package (`AxeBuilder`) to inject the axe-core engine into the rendered page, filter rules by WCAG tags (`wcag2a`, `wcag2aa`, `wcag21aa`), scope scans with include/exclude, and assert zero violations alongside keyboard Tab navigation checks.',
    detailedAnswer: 'Digital accessibility (A11y) is both an engineering standard and a legal requirement (EU Accessibility Act, ADA / Section 508). In Playwright you combine:\n1. **AxeBuilder Scans**: Run `new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()` to inspect contrast, ARIA roles, heading order, and form labels.\n2. **Scoped Audits**: Target components with `.include("#checkout-modal")` or skip third-party widgets with `.exclude("#external-chat")`.\n3. **Keyboard Navigation**: Emulate `page.keyboard.press("Tab")` and verify focus movement with `await expect(locator).toBeFocused()`.',
    codeExample: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Digital Accessibility (WCAG 2.1 AA)', () => {
  test('home page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#third-party-widget')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation reaches form inputs', async ({ page }) => {
    await page.goto('/contact');
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Full name')).toBeFocused();
  });
});`,
    recruiterTraps: [
      'Claiming automated scanners catch 100% of accessibility defects (automation catches roughly 30–50%; screen reader and manual keyboard audits remain essential).',
      'Failing to exclude uncontrollable third-party iframes or chat widgets, causing noisy false failures in CI.'
    ],
    seniorPerspective: 'Senior engineers establish CI violation gates (e.g., failing on critical/serious violations) and help developers remediate ARIA and contrast defects efficiently.',
    tags: ['A11y', 'Accessibility', 'WCAG', 'axe-core', 'Keyboard Navigation']
  },

  // --- DAY 3: WEB-FIRST ASSERTIONS, POLLING & TYPESCRIPT EXTENSIBILITY ---
  {
    id: 'loc-4',
    category: 'locators',
    categoryLabel: 'Locators & Auto-waiting',
    level: 'Senior',
    sprintDay: 3,
    sprintDayTitle: 'Day 3: Web-First Assertions & Polling',
    question: 'Why are page.$() and page.$$() discouraged in modern Playwright?',
    shortAnswer: 'They return eager ElementHandle references that lack auto-waiting and throw stale element errors whenever the DOM re-renders, whereas Locator objects are lazy recipes re-evaluated on every action or assertion.',
    detailedAnswer: '`page.$()` is a legacy API carried over from Puppeteer that captures a static DOM node reference at one instant in time. If React/Vue re-renders a millisecond later, that `ElementHandle` becomes detached and stale. `page.locator()` is lazy: it stores instructions for finding the element and re-queries fresh DOM nodes with full auto-waiting and retrying assertions.',
    recruiterTraps: [
      'Writing `page.$` queries and manual loops over `ElementHandle` arrays during live coding.'
    ],
    seniorPerspective: 'Senior engineers replace `page.$$` loops with `locator.all()` or web-first collection assertions like `await expect(locator).toHaveCount(n)`.',
    tags: ['ElementHandle', 'Locators', 'Best Practices']
  },
  {
    id: 'loc-5',
    category: 'locators',
    categoryLabel: 'Locators & Auto-waiting',
    level: 'Senior',
    sprintDay: 3,
    sprintDayTitle: 'Day 3: Web-First Assertions & Polling',
    question: 'How should you test an element or state that takes 8 seconds to appear when the default assertion timeout is 5 seconds?',
    shortAnswer: 'Override the local timeout on that specific web-first assertion (`{ timeout: 10_000 }`) or use `expect.poll()`, rather than inflating the global timeout for the entire test suite.',
    detailedAnswer: 'Increasing the global timeout in `playwright.config.ts` to 60 seconds slows down failure feedback across every test in CI. When a single business operation legitimately takes longer (such as generating a report or background processing), pass a scoped `timeout` option to the assertion or configure `expect.poll()` with explicit intervals and a descriptive failure message.',
    codeExample: `// Scoped timeout only for this specific slow async operation:
await expect(page.getByText('Export completed successfully'))
  .toBeVisible({ timeout: 15_000 });`,
    recruiterTraps: [
      'Inserting `await page.waitForTimeout(10000)`—an immediate red flag in interviews.',
      'Increasing global timeouts across the whole suite to mask one slow endpoint.'
    ],
    seniorPerspective: 'Manage timeouts explicitly per slow boundary with meaningful custom messages (`{ message: "Report generation timed out" }`) for fast CI triage.',
    tags: ['Timeouts', 'Assertions', 'Stability']
  },
  {
    id: 'ts-3',
    category: 'typescript',
    categoryLabel: 'Advanced TypeScript',
    level: 'Principal',
    sprintDay: 3,
    sprintDayTitle: 'Day 3: Web-First Assertions & Polling',
    question: 'What are Declaration Merging and Module Augmentation in TypeScript, and how do you use them to extend Playwright types (such as custom expect matchers)?',
    shortAnswer: 'Declaration merging combines multiple TypeScript declarations with the same name into one definition. Module augmentation lets you add custom matchers or properties to external library types like `@playwright/test` without modifying `node_modules`.',
    detailedAnswer: 'When creating domain-specific assertions (`expect.extend(...)`), you want full TypeScript IntelliSense and type checking in every spec file. Using `declare module "@playwright/test"` you can augment `Matchers<R>` with custom methods such as `toBeWithinTimeLimit()`. TypeScript merges your declaration with Playwright’s built-in definitions automatically.',
    codeExample: `// types/playwright-matchers.d.ts
import { expect as baseExpect } from '@playwright/test';

// Module Augmentation:
declare module '@playwright/test' {
  interface Matchers<R> {
    toBeWithinTimeLimit(maxMilliseconds: number): R;
  }
}

// Custom matcher implementation:
baseExpect.extend({
  async toBeWithinTimeLimit(receivedTime: number, maxMs: number) {
    const pass = receivedTime <= maxMs;
    return {
      pass,
      message: () =>
        pass
          ? \`Execution time \${receivedTime}ms is within \${maxMs}ms limit\`
          : \`Exceeded limit: expected <= \${maxMs}ms, received \${receivedTime}ms\`,
    };
  },
});

// Full TypeScript autocomplete in tests:
await expect(executionDuration).toBeWithinTimeLimit(2000);`,
    recruiterTraps: [
      'Not knowing `declare module` or attempting to cast `expect(...) as any`.',
      'Forgetting an import/export inside a `.d.ts` file, causing TypeScript to treat it as a global script rather than an augmenting module.'
    ],
    seniorPerspective: 'Principal engineers leverage module augmentation inside shared internal QA packages (e.g., `@company/qa-core`) to give every team strongly typed domain matchers.',
    tags: ['TypeScript', 'Declaration Merging', 'Module Augmentation', 'Custom Matchers']
  }
];
