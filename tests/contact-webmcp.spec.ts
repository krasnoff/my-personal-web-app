import { test, expect, Page } from '@playwright/test';

const contact = { fullName: 'Test Sender', email: 'sender@example.com', message: 'A test message' };

async function mockWebMCP(page: Page, legacy = false) {
  await page.addInitScript((legacy) => {
    const tools = new Map();
    (window as any).contactTools = tools;
    const api = {
      registerTool(tool: any, options?: { signal: AbortSignal }) {
        tools.set(tool.name, tool);
        options?.signal.addEventListener('abort', () => tools.delete(tool.name));
      },
      unregisterTool(name: string) { tools.delete(name); },
    };
    Object.defineProperty(legacy ? navigator : document, 'modelContext', { value: api, configurable: true });
  }, legacy);
  await page.goto('http://localhost:3000/contact');
  await expect.poll(() => page.evaluate(() => (window as any).contactTools.has('send_contact_message'))).toBe(true);
}

async function execute(page: Page, input: unknown) {
  return page.evaluate(input => (window as any).contactTools.get('send_contact_message').execute(input), input);
}

test('tool fills fields, waits for email result, prevents overlapping sends, and cleans up', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let requests = 0;
  await page.route('**/api/mailer', async route => {
    requests++;
    expect(route.request().postDataJSON()).toEqual({ submissionObject: contact });
    await pending;
    await route.fulfill({ status: 200, json: 'queued' });
  });
  await mockWebMCP(page);
  const result = execute(page, contact);
  await expect(page.locator('#fullName')).toHaveValue(contact.fullName);
  await expect.poll(() => requests).toBe(1);
  expect(await execute(page, contact)).toMatchObject({ success: false });
  release();
  expect(await result).toMatchObject({ success: true });
  await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('');
  await page.getByRole('link', { name: 'Contact', exact: true }).waitFor();
  await page.getByRole('link', { name: 'Goto homepage', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as any).contactTools.size)).toBe(0);
});

test('rejects invalid tool input and preserves fields on mailer failure', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/mailer', async route => {
    requests++;
    await route.fulfill({ status: 500, json: { error: 'unavailable' } });
  });
  await mockWebMCP(page);
  for (const input of [null, { ...contact, email: 12 }, { ...contact, message: '   ' }, { ...contact, email: 'not-an-email' }]) {
    expect(await execute(page, input)).toMatchObject({ success: false });
  }
  expect(requests).toBe(0);
  expect(await execute(page, contact)).toMatchObject({ success: false, error: expect.stringContaining('Delivery could not be confirmed') });
  expect(requests).toBe(1);
  await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue(contact.message);
  await expect(page.getByRole('button', { name: 'Send Message' })).toBeEnabled();
});

test('supports the earlier navigator API', async ({ page }) => {
  await page.route('**/api/mailer', route => route.fulfill({ status: 200, json: 'queued' }));
  await mockWebMCP(page, true);
  expect(await execute(page, contact)).toMatchObject({ success: true });
});

test('manual form works without WebMCP', async ({ page }) => {
  await page.route('**/api/mailer', route => route.fulfill({ status: 200, json: 'queued' }));
  await page.goto('http://localhost:3000/contact');
  await page.getByRole('textbox', { name: 'Full Name' }).fill(contact.fullName);
  await page.getByRole('textbox', { name: 'Email' }).fill(contact.email);
  await page.getByRole('textbox', { name: 'Message' }).fill(contact.message);
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Send successful')).toBeVisible();
});
