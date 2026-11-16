export interface CheatsheetSection {
  id: string;
  title: string;
  description: string;
  items: {
    name: string;
    syntax: string;
    explanation: string;
    example?: string;
  }[];
}

export const CHEATSHEET_SECTIONS: CheatsheetSection[] = [
  {
    id: 'locators',
    title: '1. Resilient Locators (Demo Days 1–3 Focus)',
    description: 'Official Playwright locator hierarchy grounded in the Accessibility Object Model (AOM) plus Shadow DOM and iframe support.',
    items: [
      {
        name: 'page.getByRole(role, { name })',
        syntax: 'page.getByRole("button", { name: "Add to cart" })',
        explanation: 'Top-priority locator. Verifies ARIA role (button, link, heading, checkbox, row, dialog) and accessible name.',
        example: 'await page.getByRole("button", { name: /confirm/i }).click();'
      },
      {
        name: 'page.getByLabel(text)',
        syntax: 'page.getByLabel("Discount code")',
        explanation: 'Targets form controls associated with a <label>—and automatically pierces open Shadow DOM.',
        example: 'await page.getByLabel("Discount code").fill("VIP-2026");'
      },
      {
        name: 'page.getByPlaceholder(text)',
        syntax: 'page.getByPlaceholder("Search products...")',
        explanation: 'Matches input controls by placeholder attribute when no explicit label exists.',
        example: 'await page.getByPlaceholder("Enter promo code...").fill("SAVE10");'
      },
      {
        name: 'page.getByText(text, { exact })',
        syntax: 'page.getByText("Smartwatch Pro", { exact: false })',
        explanation: 'Matches visible text content—best for non-interactive copy, banners, and status messages.',
        example: 'await expect(page.getByText("Order confirmed")).toBeVisible();'
      },
      {
        name: 'page.getByTestId(id)',
        syntax: 'page.getByTestId("cart-count-badge")',
        explanation: 'Matches data-testid (or a custom testIdAttribute) when semantic roles alone are insufficient.',
        example: 'await expect(page.getByTestId("cart-count-badge")).toHaveText("1");'
      },
      {
        name: 'locator.filter({ hasText, has })',
        syntax: 'page.getByRole("row").filter({ hasText: "Invoice #INV-2026" })',
        explanation: 'Narrows a locator collection by text or nested child locator, eliminating fragile .nth() indexes.',
        example: 'const row = page.getByRole("row").filter({ hasText: "Invoice #INV-2026" });'
      },
      {
        name: 'page.frameLocator(selector)',
        syntax: 'page.frameLocator(\'iframe[title="Payment Gateway"]\').getByRole("button")',
        explanation: 'Lazy handle to nested <iframe> content with full auto-waiting (replaces legacy page.frame()).',
        example: 'await page.frameLocator(\'iframe[title="Payment Gateway"]\').getByRole("button", { name: "Confirm transaction" }).click();'
      }
    ]
  },
  {
    id: 'assertions',
    title: '2. Web-First Assertions (Auto-retrying)',
    description: 'Asynchronous assertions that automatically poll until the condition passes or the timeout expires.',
    items: [
      {
        name: 'await expect(locator).toBeVisible()',
        syntax: 'await expect(loc).toBeVisible({ timeout?: number })',
        explanation: 'Waits until the element is attached to the DOM and visually rendered.',
        example: 'await expect(page.getByRole("alert")).toBeVisible();'
      },
      {
        name: 'await expect(locator).toHaveText(expected)',
        syntax: 'await expect(loc).toHaveText("1")',
        explanation: 'Retries until the element text matches the expected string or RegExp.',
        example: 'await expect(page.getByTestId("cart-count-badge")).toHaveText("1");'
      },
      {
        name: 'await expect(locator).toContainText(expected)',
        syntax: 'await expect(row).toContainText("PAID")',
        explanation: 'Retries until the element contains the expected substring (ideal for table rows).',
        example: 'await expect(invoiceRow).toContainText("PAID");'
      },
      {
        name: 'await expect(locator).toHaveCount(count)',
        syntax: 'await expect(loc).toHaveCount(5)',
        explanation: 'Asserts the exact number of matched elements in a collection.',
        example: 'await expect(page.getByRole("article")).toHaveCount(2);'
      },
      {
        name: 'await expect(locator).toBeEnabled() / toBeDisabled()',
        syntax: 'await expect(loc).toBeEnabled()',
        explanation: 'Checks whether an interactive control is enabled or disabled.',
        example: 'await expect(page.getByRole("button", { name: "Save" })).toBeEnabled();'
      },
      {
        name: 'await expect.poll(fn, options).toBe(expected)',
        syntax: 'await expect.poll(async () => status, { intervals: [1000], timeout: 15000 }).toBe("COMPLETED")',
        explanation: 'Polls any async function (API endpoint, job queue, DB query) with configurable intervals and timeout.',
        example: 'await expect.poll(async () => (await request.get(`/api/jobs/${id}`)).json()).toMatchObject({ status: "COMPLETED" });'
      }
    ]
  },
  {
    id: 'cli',
    title: '3. Essential Playwright CLI & Demo Lab Commands',
    description: 'Core terminal commands for running tests locally, inspecting traces, and debugging.',
    items: [
      {
        name: 'Run Demo Lab Exercises (Chromium)',
        syntax: 'npm run lab:exercises',
        explanation: 'Launches the local Training Sandbox App (:4173) and runs tests/exercises/01..03.spec.ts.',
        example: 'npm run lab:exercises'
      },
      {
        name: 'Run Demo Lab Reference Solutions',
        syntax: 'npm run lab:solutions',
        explanation: 'Runs the verified reference solutions in tests/solutions/01..03.spec.ts against the sandbox.',
        example: 'npm run lab:solutions'
      },
      {
        name: 'Playwright UI Mode (Interactive IDE)',
        syntax: 'npx playwright test --ui',
        explanation: 'Launches the interactive time-travel test explorer with watch mode and live locator picking.',
        example: 'npx playwright test --ui'
      },
      {
        name: 'Playwright Inspector (Step Debugger)',
        syntax: 'PWDEBUG=1 npx playwright test',
        explanation: 'Opens a headed browser with infinite timeout and step-over debugging controls.',
        example: 'PWDEBUG=1 npx playwright test tests/exercises/02-table-shadow-iframe.spec.ts'
      },
      {
        name: 'Inspect Saved CI Traces',
        syntax: 'npx playwright show-trace path/to/trace.zip',
        explanation: 'Opens Trace Viewer to inspect DOM snapshots, network waterfall, console logs, and actionability checks.',
        example: 'npx playwright show-trace ./test-results/trace.zip'
      },
      {
        name: 'Generate Locators with Codegen',
        syntax: 'npx playwright codegen http://127.0.0.1:4173',
        explanation: 'Records user interactions in a live browser and generates getByRole/getByLabel Playwright TypeScript.',
        example: 'npx playwright codegen http://127.0.0.1:4173/invoices'
      }
    ]
  }
];

export const SENIOR_GOLDEN_RULES = [
  {
    rule: 'Never use waitForTimeout() or arbitrary sleep()',
    reason: 'Playwright provides built-in actionability checks and retrying web-first assertions. Hardcoded sleeps are an immediate red flag in technical interviews.'
  },
  {
    rule: 'Default to User-Facing Locators (getByRole, getByLabel)',
    reason: 'CSS classes change during routine styling refactors. ARIA roles and accessible names stay stable and improve product accessibility.'
  },
  {
    rule: 'Eliminate ElementHandle ($ / $$) in favor of lazy Locators',
    reason: 'Locators re-query fresh DOM nodes on every step and prevent stale element errors in modern reactive SPAs.'
  },
  {
    rule: 'Use expect.poll() instead of manual while-loops',
    reason: 'Official retrying assertions integrate cleanly with Trace Viewer, backoff intervals, and readable timeout failure messages.'
  },
  {
    rule: 'Rely on native Shadow DOM piercing & frameLocator()',
    reason: 'Playwright traverses open shadow roots automatically for semantic locators and gives iframes lazy auto-waiting via frameLocator().'
  },
  {
    rule: 'Clarify requirements and think aloud during Live Coding',
    reason: 'Interviewers evaluate engineering reasoning, edge-case awareness, and trade-off discussions just as heavily as working syntax.'
  }
];

export const QUESTIONS_TO_ASK_INTERVIEWERS = [
  'What does your current Flaky Rate look like on the main branch, and what SLA do you follow for quarantining or fixing unstable tests?',
  'Do your CI/CD pipelines spin up ephemeral preview environments per Pull Request, or do tests share a single staging environment?',
  'How is E2E ownership split between product engineers and QA automation engineers?',
  'Do you shard Playwright suites in CI, and what total feedback loop time do you target for PR merges?',
  'What are the biggest architectural or test-stability bottlenecks you want this role to solve in the next two quarters?'
];
