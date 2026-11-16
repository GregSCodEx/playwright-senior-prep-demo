import { CodingChallenge } from '../types';

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'challenge-resilient-locators',
    title: 'Challenge 1 (Day 2): Refactor Brittle XPath & CSS Locators',
    category: 'Resilient Locators',
    level: 'Senior',
    sprintDay: 2,
    sprintDayTitle: 'Day 2: Resilient Locators & Auto-waiting',
    estimatedTimeMinutes: 12,
    description: 'You inherited a legacy test full of brittle XPath selectors, positional indexes, and hardcoded sleeps. Refactor it using modern Playwright best practices: semantic `getByRole`, `.filter({ hasText })`, web-first assertions, and zero artificial `waitForTimeout` calls.',
    interviewContext: 'A classic live coding round: the interviewer hands you a Selenium-style Playwright test and asks you to modernize it into idiomatic TypeScript Playwright.',
    requirements: [
      'Replace `//div[contains(@class, "card")][2]//button` with semantic role + `.filter({ hasText: "Smartwatch Pro" })`.',
      'Replace manual `textContent()` + synchronous `expect().toBe()` with an auto-retrying `await expect(cartBadge).toHaveText("1")` assertion.',
      'Remove all `page.waitForTimeout()` calls.',
      'Use clean `{ page }` destructuring and descriptive locator names.'
    ],
    starterCode: `import { test, expect } from '@playwright/test';

// ❌ LEGACY CODE TO REFACTOR:
test('add product to cart - legacy code', async ({ page }) => {
  await page.goto('/shop');
  await page.waitForTimeout(3000); // Hardcoded wait for load

  // Positional click on the second product card
  const legacyButton = page.locator('xpath=//div[contains(@class, "card")][2]//button[@type="submit"]');
  await legacyButton.click();

  await page.waitForTimeout(2000); // Hardcoded wait for cart animation

  // Manual text extraction & non-retrying assertion
  const badgeText = await page.locator('#cart-count-badge > span').textContent();
  expect(badgeText?.trim()).toBe('1');
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('add product to cart - modern Playwright', async ({ page }) => {
  await page.goto('/shop');

  // Locate target card via Accessibility Tree & text filtering:
  const productCard = page
    .getByRole('article')
    .filter({ hasText: 'Smartwatch Pro' });

  // Click button scoped inside filtered card (auto-waiting handles loading):
  await productCard
    .getByRole('button', { name: 'Add to cart' })
    .click();

  // Web-first assertion with automatic retrying (zero artificial sleeps):
  const cartBadge = page.getByTestId('cart-count-badge');
  await expect(cartBadge).toHaveText('1');
});`,
    solutionExplanation: 'Why this refactored test wins in interviews:\n1. Removing `waitForTimeout` shaves 5 seconds off every run and eliminates arbitrary timing assumptions.\n2. Using `.filter({ hasText: "Smartwatch Pro" })` decouples the test from product ordering or pagination.\n3. Replacing `textContent()` + `toBe()` with `await expect(cartBadge).toHaveText("1")` enables automatic retrying until the asynchronous cart update settles.',
    validationRules: [
      {
        id: 'no-xpath',
        label: 'Zero XPath selectors',
        check: (code: string) => ({
          passed: !code.toLowerCase().includes('xpath=') && !code.includes('//div'),
          feedback: 'Remove all XPath selectors and replace them with `getByRole` and `.filter()`.'
        })
      },
      {
        id: 'no-timeouts',
        label: 'Eliminate `waitForTimeout`',
        check: (code: string) => {
          const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
          const hasTimeout = /\.waitForTimeout\s*\(/.test(cleanCode) || /\bwaitForTimeout\s*\(/.test(cleanCode);
          return {
            passed: !hasTimeout,
            feedback: 'Remove all `page.waitForTimeout(...)` calls.'
          };
        }
      },
      {
        id: 'has-filter',
        label: 'Use `.filter()` to target the product card',
        check: (code: string) => ({
          passed: /\.filter\s*\(/i.test(code),
          feedback: 'Use `.filter({ hasText: ... })` to locate the Smartwatch Pro card cleanly.'
        })
      },
      {
        id: 'has-havetext',
        label: 'Web-first `toHaveText` assertion on the cart badge',
        check: (code: string) => ({
          passed: /expect\([\s\S]*?\)\.toHaveText\s*\(/i.test(code),
          feedback: 'Use `await expect(cartBadge).toHaveText(\'1\')` instead of extracting text into a string.'
        })
      }
    ]
  },
  {
    id: 'challenge-table-shadow-iframe',
    title: 'Challenge 2 (Day 2): Dynamic Table, Shadow DOM & iframe (frameLocator)',
    category: 'Tables, Shadow DOM & Frames',
    level: 'Senior',
    sprintDay: 2,
    sprintDayTitle: 'Day 2: Resilient Locators & Auto-waiting',
    estimatedTimeMinutes: 18,
    description: 'A flagship Senior Live Coding scenario: the page renders a dynamically sorted invoices table, a promo coupon form encapsulated inside a Web Component (Shadow DOM), and a payment widget embedded inside an `<iframe>`. Write a resilient test with zero `.nth()` indexes, zero XPath, and zero `waitForTimeout`.',
    interviewContext: 'Interview reports consistently identify dynamic tables, Shadow DOM piercing, and nested iframes as one of the most frequent practical UI coding tests.',
    requirements: [
      'Locate row `"Invoice #INV-2026"` using `page.getByRole("row").filter({ hasText: "Invoice #INV-2026" })` (no `.nth()` or XPath).',
      'Click the `"Details"` button scoped inside that filtered row (`getByRole("button", { name: "Details" })`).',
      'Enter discount code `"VIP-2026"` into the Shadow DOM input using `getByLabel("Discount code")` (Playwright pierces `#shadow-root` automatically).',
      'Create a frame locator via `page.frameLocator(\'iframe[title="Payment Gateway"]\')` and click `"Confirm transaction"`.',
      'Verify with a web-first assertion `await expect(invoiceRow).toContainText("PAID")` that the invoice status updated.'
    ],
    starterCode: `import { test, expect } from '@playwright/test';

test('Pay invoice across dynamic table, Shadow DOM, and iframe', async ({ page }) => {
  await page.goto('/invoices');

  // 1. Find table row containing "Invoice #INV-2026" without .nth() or XPath:
  // TODO: const invoiceRow = ...

  // 2. Click "Details" button scoped inside that row:
  // TODO: ...

  // 3. Enter discount code "VIP-2026" inside the Web Component (Shadow DOM):
  // Hint: Playwright pierces open Shadow Roots automatically!
  // TODO: ...

  // 4. Target the iframe titled "Payment Gateway" with frameLocator
  // and click "Confirm transaction":
  // TODO: const paymentFrame = ...

  // 5. Verify via web-first assertion that the row status becomes "PAID":
  // TODO: ...
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('Pay invoice across dynamic table, Shadow DOM, and iframe', async ({ page }) => {
  await page.goto('/invoices');

  // 1. Resilient row filtering in a dynamic table (sort order does not matter):
  const invoiceRow = page
    .getByRole('row')
    .filter({ hasText: 'Invoice #INV-2026' });

  // 2. Action scoped strictly to the matched row:
  await invoiceRow.getByRole('button', { name: 'Details' }).click();

  // 3. Automatic Shadow DOM piercing — no element.shadowRoot.querySelector needed:
  await page.getByLabel('Discount code').fill('VIP-2026');

  // 4. Lazy iframe handling with auto-waiting via FrameLocator:
  const paymentFrame = page.frameLocator('iframe[title="Payment Gateway"]');
  await paymentFrame.getByRole('button', { name: 'Confirm transaction' }).click();

  // 5. Web-first assertion on the updated row status:
  await expect(invoiceRow).toContainText('PAID');
});`,
    solutionExplanation: 'This reference solution demonstrates three Senior-level capabilities:\n1. `getByRole("row").filter({ hasText })` makes the test immune to sorting or pagination changes.\n2. Semantic locators (`getByLabel`, `getByRole`) pierce open Shadow DOM automatically—unlike XPath.\n3. `page.frameLocator(...)` returns a lazy locator with built-in auto-waiting, replacing the legacy `page.frame()` handle.',
    validationRules: [
      {
        id: 'no-xpath-or-nth',
        label: 'No XPath or brittle `.nth()` indexing',
        check: (code: string) => {
          const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
          const bad = /xpath=|\/\/tr|\/\/td|\.nth\s*\(/i.test(cleanCode);
          return {
            passed: !bad,
            feedback: 'Remove XPath selectors and `.nth()` calls — use `.filter({ hasText })` instead.'
          };
        }
      },
      {
        id: 'no-timeouts',
        label: 'Zero `waitForTimeout` calls',
        check: (code: string) => {
          const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
          const hasTimeout = /\.waitForTimeout\s*\(/.test(cleanCode) || /\bwaitForTimeout\s*\(/.test(cleanCode);
          return {
            passed: !hasTimeout,
            feedback: 'Eliminate `waitForTimeout` and rely on Playwright auto-waiting.'
          };
        }
      },
      {
        id: 'has-row-filter',
        label: 'Dynamic table filtering (`getByRole("row").filter(...)`)',
        check: (code: string) => {
          const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
          return {
            passed: /getByRole\s*\(\s*['"`]row['"`][\s\S]*?\.filter\s*\(/i.test(cleanCode),
            feedback: 'Locate the row using `page.getByRole(\'row\').filter({ hasText: \'Invoice #INV-2026\' })`.'
          };
        }
      },
      {
        id: 'has-framelocator',
        label: 'Handle `iframe` with `frameLocator()`',
        check: (code: string) => {
          const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
          return {
            passed: /frameLocator\s*\(/i.test(cleanCode),
            feedback: 'Use `page.frameLocator(\'iframe[title="Payment Gateway"]\')` to interact with the payment iframe.'
          };
        }
      },
      {
        id: 'has-status-assertion',
        label: 'Web-first assertion on `"PAID"` status',
        check: (code: string) => {
          const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
          return {
            passed: /await\s+expect\([\s\S]*?\)\.(toContainText|toHaveText|toBeVisible)\s*\([\s\S]*PAID/i.test(cleanCode),
            feedback: 'Verify the invoice status using `await expect(invoiceRow).toContainText(\'PAID\')`.'
          };
        }
      }
    ]
  },
  {
    id: 'challenge-expect-poll',
    title: 'Challenge 3 (Day 3): Async API Status Polling (expect.poll)',
    category: 'Async Assertions',
    level: 'Principal',
    sprintDay: 3,
    sprintDayTitle: 'Day 3: Web-First Assertions & Polling',
    estimatedTimeMinutes: 15,
    description: 'A background worker processes a large batch job asynchronously. After clicking "Start process", `/api/jobs/{id}` transitions through `"PENDING"`, `"PROCESSING"`, and finally `"COMPLETED"`. Implement a clean `expect.poll()` assertion polling every 1 second up to 15 seconds.',
    interviewContext: 'Evaluates your ability to handle asynchronous backend state transitions without writing brittle manual `while(true) { sleep() }` loops.',
    requirements: [
      'Use `await expect.poll(async () => { ... })`.',
      'Configure `{ intervals: [1000], timeout: 15000, message: "..." }` as the second argument.',
      'Assert `.toBe("COMPLETED")`.',
      'Do not forget `await` before `expect.poll`.'
    ],
    starterCode: `import { test, expect } from '@playwright/test';

test('background batch job completes successfully', async ({ page, request }) => {
  await page.goto('/batch-jobs');
  await page.getByRole('button', { name: 'Start process' }).click();
  const jobId = await page.getByTestId('job-id').innerText();

  // TODO: Use expect.poll to query /api/jobs/{jobId} until status === 'COMPLETED'
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('background batch job completes successfully', async ({ page, request }) => {
  await page.goto('/batch-jobs');
  await page.getByRole('button', { name: 'Start process' }).click();
  const jobId = await page.getByTestId('job-id').innerText();

  // Asynchronous endpoint polling using expect.poll:
  await expect.poll(
    async () => {
      const response = await request.get(\`/api/jobs/\${jobId}\`);
      const body = await response.json();
      return body.status;
    },
    {
      message: \`Job \${jobId} did not reach COMPLETED status in time\`,
      intervals: [1000], // Poll every 1 second
      timeout: 15_000,   // Fail after 15 seconds
    }
  ).toBe('COMPLETED');
});`,
    solutionExplanation: '`expect.poll` is Playwright’s built-in retrying assertion for arbitrary synchronous or asynchronous values (API status, DB state, queues). It records every attempt inside Trace Viewer and throws clear business failure messages on timeout.',
    validationRules: [
      {
        id: 'has-expect-poll',
        label: 'Use `await expect.poll(...)`',
        check: (code: string) => ({
          passed: /await\s+expect\.poll\s*\(/i.test(code),
          feedback: 'Use `await expect.poll(async () => { ... }, options).toBe("COMPLETED")`.'
        })
      },
      {
        id: 'has-intervals',
        label: 'Configure `intervals` and `timeout`',
        check: (code: string) => ({
          passed: /intervals|timeout/i.test(code),
          feedback: 'Specify `{ intervals: [1000], timeout: 15000 }` in the options object.'
        })
      },
      {
        id: 'has-to-be-completed',
        label: 'Final assertion `.toBe("COMPLETED")`',
        check: (code: string) => ({
          passed: /\.toBe\s*\(\s*['"`]COMPLETED['"`]\s*\)/i.test(code),
          feedback: 'Finish the polling chain with `.toBe(\'COMPLETED\')`.'
        })
      }
    ]
  }
];
