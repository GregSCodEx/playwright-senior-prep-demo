import express from 'express';

const app = express();
app.use(express.json());

const PORT = Number(process.env.LAB_PORT || 4173);

let jobCounter = 100;
const jobPolls = new Map<string, number>();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Playwright Senior Prep Demo — Training Sandbox App' });
});

app.get('/', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Training Sandbox App | Playwright Senior Lab (Demo Days 1-3)</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; max-width: 820px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    h1 { color: #34d399; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-top: 24px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px; }
    a { color: #38bdf8; font-weight: 600; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { background: #020617; padding: 2px 6px; border-radius: 4px; color: #a7f3d0; font-size: 0.85em; }
  </style>
</head>
<body>
  <main>
    <h1>Training Sandbox App (Demo: Days 1–3)</h1>
    <p>Local Playwright test target providing real interactive UI pages and endpoints for the 3 Demo Live Coding challenges.</p>
    <div class="grid">
      <div class="card">
        <h3>Challenge 1: Shop (Day 2)</h3>
        <a href="/shop">/shop</a>
        <p>Async cart counter update (Smartwatch Pro).</p>
      </div>
      <div class="card">
        <h3>Challenge 2: Invoices (Day 2)</h3>
        <a href="/invoices">/invoices</a>
        <p>Dynamic table + Shadow DOM + nested <code>&lt;iframe&gt;</code>.</p>
      </div>
      <div class="card">
        <h3>Challenge 3: Batch Jobs (Day 3)</h3>
        <a href="/batch-jobs">/batch-jobs</a>
        <p>Background job status polling: <code>PENDING → PROCESSING → COMPLETED</code>.</p>
      </div>
    </div>
  </main>
</body>
</html>`);
});

// Challenge 1 (Day 2): /shop
app.get('/shop', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Electronics Shop — Training Sandbox</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; background: #f8fafc; color: #0f172a; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 24px; }
    article { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
    button { background: #059669; color: #ffffff; border: 0; border-radius: 6px; padding: 8px 14px; font-weight: 600; cursor: pointer; }
  </style>
</head>
<body>
  <header>
    <h1>Electronics Shop</h1>
    <div>Cart: <span data-testid="cart-count-badge" id="cart-count-badge">0</span></div>
  </header>
  <main>
    <article class="product-card">
      <div>
        <h2>Wireless Headphones</h2>
        <p>$129</p>
      </div>
      <button type="submit" data-product="headphones">Add to cart</button>
    </article>
    <article class="product-card">
      <div>
        <h2>Smartwatch Pro</h2>
        <p>$299</p>
      </div>
      <button type="submit" data-product="smartwatch">Add to cart</button>
    </article>
  </main>
  <script>
    let count = 0;
    document.querySelectorAll('button[data-product]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          count += 1;
          document.getElementById('cart-count-badge').textContent = String(count);
        }, 120);
      });
    });
  </script>
</body>
</html>`);
});

// Challenge 2 (Day 2): /invoices + /payment-frame (Table + Shadow DOM + iframe)
app.get('/payment-frame', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Payment Gateway</title></head>
<body style="font-family: system-ui, sans-serif; padding: 14px; background: #f1f5f9; color: #0f172a;">
  <p style="margin: 0 0 10px;">Embedded Payment Frame</p>
  <button type="button" id="confirm-tx" style="background: #0284c7; color: #fff; border: 0; padding: 8px 14px; border-radius: 6px; cursor: pointer;">
    Confirm transaction
  </button>
  <script>
    document.getElementById('confirm-tx').addEventListener('click', () => {
      window.parent.postMessage('PAYMENT_CONFIRMED', '*');
    });
  </script>
</body>
</html>`);
});

app.get('/invoices', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoices — Training Sandbox</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 820px; margin: 40px auto; padding: 0 16px; background: #f8fafc; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
    th { background: #e2e8f0; }
    button { background: #0f172a; color: #ffffff; border: 0; border-radius: 6px; padding: 6px 12px; cursor: pointer; }
  </style>
</head>
<body>
  <main>
    <h1>Invoices</h1>
    <table>
      <thead>
        <tr>
          <th>Number</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr data-invoice="INV-2025">
          <td>Invoice #INV-2025</td>
          <td>$190</td>
          <td class="status">PAID</td>
          <td><button type="button">Details</button></td>
        </tr>
        <tr data-invoice="INV-2026">
          <td>Invoice #INV-2026</td>
          <td>$490</td>
          <td class="status">PENDING</td>
          <td><button type="button" id="open-inv-2026">Details</button></td>
        </tr>
      </tbody>
    </table>

    <section id="details-panel" hidden style="margin-top: 24px; background: #fff; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px;">
      <h2>Invoice #INV-2026 Details</h2>
      <promo-coupon-box></promo-coupon-box>
      <div style="margin-top: 16px;">
        <iframe title="Payment Gateway" src="/payment-frame" width="100%" height="120" style="border: 1px solid #cbd5e1; border-radius: 6px;"></iframe>
      </div>
    </section>
  </main>

  <script>
    class PromoCouponBox extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = \`
          <div>
            <label for="coupon-code" style="display:block; margin-bottom:4px; font-weight:600;">Discount code</label>
            <input id="coupon-code" type="text" placeholder="Enter promo code..." style="padding:6px 10px; border:1px solid #94a3b8; border-radius:6px;" />
          </div>
        \`;
      }
    }
    customElements.define('promo-coupon-box', PromoCouponBox);

    document.getElementById('open-inv-2026').addEventListener('click', () => {
      document.getElementById('details-panel').hidden = false;
    });

    window.addEventListener('message', (event) => {
      if (event.data === 'PAYMENT_CONFIRMED') {
        setTimeout(() => {
          const statusCell = document.querySelector('tr[data-invoice="INV-2026"] .status');
          if (statusCell) statusCell.textContent = 'PAID';
        }, 80);
      }
    });
  </script>
</body>
</html>`);
});

// Challenge 3 (Day 3): /batch-jobs + /api/jobs + /api/jobs/:id
app.get('/batch-jobs', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Batch Jobs — Training Sandbox</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px;">
  <main>
    <h1>Batch Processing</h1>
    <button type="button" id="start-job">Start process</button>
    <p>Job ID: <strong data-testid="job-id" id="job-id"></strong></p>
  </main>
  <script>
    document.getElementById('start-job').addEventListener('click', async () => {
      const res = await fetch('/api/jobs', { method: 'POST' });
      const data = await res.json();
      document.getElementById('job-id').textContent = data.id;
    });
  </script>
</body>
</html>`);
});

app.post('/api/jobs', (_req, res) => {
  jobCounter += 1;
  const id = `job-${jobCounter}`;
  jobPolls.set(id, 0);
  res.status(201).json({ id, status: 'PENDING' });
});

app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const count = (jobPolls.get(id) ?? 0) + 1;
  jobPolls.set(id, count);

  const status = count === 1 ? 'PENDING' : count === 2 ? 'PROCESSING' : 'COMPLETED';
  res.json({ id, status, attempt: count });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Training Sandbox App (Demo Days 1-3) running at http://127.0.0.1:${PORT}`);
});
