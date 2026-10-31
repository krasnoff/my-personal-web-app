import { test, expect, Page } from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL ?? 'http://localhost:3000';

async function openCollection(page: Page, collection: 'posts' | 'works', legacy = false) {
    await page.addInitScript(legacy => {
        const tools = new Map();
        (window as any).collectionTools = tools;
        Object.defineProperty(legacy ? navigator : document, 'modelContext', {
            configurable: true,
            value: {
                registerTool(tool: any, options?: { signal: AbortSignal }) {
                    tools.set(tool.name, tool);
                    options?.signal.addEventListener('abort', () => tools.delete(tool.name));
                },
                unregisterTool(name: string) { tools.delete(name); },
            },
        });
    }, legacy);
    await page.goto(`${baseURL}/${collection}`);
    await expect.poll(() => page.evaluate(() => (window as any).collectionTools.size)).toBe(3);
}

function execute(page: Page, name: string, input: unknown) {
    return page.evaluate(({ name, input }) => (window as any).collectionTools.get(name).execute(input), { name, input });
}

test('posts support list, topic searches, year filters, pagination and single article lookup', async ({ page }) => {
    await openCollection(page, 'posts');
    const list = await execute(page, 'list_posts', {});
    expect(list.success).toBe(true);
    expect(list.total).toBe(await page.getByRole('heading', { level: 2 }).count());
    expect(list.results[0].publishDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    const result = await execute(page, 'search_posts', { query: 'REACT-NATIVE Expo' });
    expect(result.total).toBe(1);
    expect(result.results[0].title).toBe('A Practical Guide to Building Mobile Apps with AI Tools');
    expect(result.results[0].pageUrl).toContain('/posts/1');
    expect(result.results[0].url).toContain('linkedin.com');
    expect((await execute(page, 'search_posts', { query: 'react native expo', year: 2025 })).total).toBe(0);
    expect((await execute(page, 'search_posts', { query: 'react native expo', match: 'any' })).total).toBeGreaterThan(1);
    const first = await execute(page, 'list_posts', { limit: 1 });
    const second = await execute(page, 'list_posts', { limit: 1, offset: first.nextOffset });
    expect(second.results[0].id).not.toBe(first.results[0].id);
    expect((await execute(page, 'get_post', { id: String(result.results[0].id) })).result).toEqual(result.results[0]);
    expect((await execute(page, 'get_post', { id: 'missing' })).success).toBe(false);
    const beyond = await execute(page, 'list_posts', { offset: 1000 });
    expect(beyond.results).toEqual([]);
    expect(beyond.nextOffset).toBeNull();
});

test('works query real list objects and support legacy WebMCP', async ({ page }) => {
    await openCollection(page, 'works', true);
    const list = await execute(page, 'list_works', {});
    expect(list.total).toBe(await page.getByRole('heading', { level: 2 }).count());
    const result = await execute(page, 'search_works', { query: 'react native expo', year: 2026 });
    expect(result.results.map((item: any) => item.title).sort()).toEqual(['Plant Identifier', 'Speech Transcriber']);
    expect(result.results[0].gitUrl).toContain('github.com');
    const item = await execute(page, 'get_work', { id: Number(result.results[0].id) });
    expect(item.result).toEqual(result.results[0]);
    expect((await execute(page, 'search_works', { query: 'unmatched-topic' })).total).toBe(0);
    const oldest = await execute(page, 'search_works', { query: 'react', sort: 'oldest' });
    const years = oldest.results.map((item: any) => Number(item.publishYear));
    expect(years).toEqual([...years].sort((a, b) => a - b));
});

test('invalid query inputs return actionable errors', async ({ page }) => {
    await openCollection(page, 'posts');
    for (const input of [null, [], {}, { query: '  ' }, { query: 12 }, { query: 'react', limit: 0 },
        { query: 'react', limit: 101 }, { query: 'react', offset: -1 }, { query: 'react', offset: 1.5 },
        { query: 'react', year: '2026' }, { query: 'react', sort: 'unknown' },
        { query: 'react', match: 'unknown' }, { query: 'react', extra: true }]) {
        expect(await execute(page, 'search_posts', input)).toMatchObject({ success: false, error: expect.any(String) });
    }
    expect((await execute(page, 'get_post', { id: {} })).success).toBe(false);
    expect((await execute(page, 'list_posts', { query: 'react' })).success).toBe(false);
});

test('tools are read-only and scoped to their collection route', async ({ page }) => {
    await openCollection(page, 'posts');
    expect(await page.evaluate(() => [...(window as any).collectionTools.values()].every(tool => tool.annotations.readOnlyHint))).toBe(true);
    await page.getByRole('link', { name: 'Works', exact: true }).click();
    await expect.poll(() => page.evaluate(() => [...(window as any).collectionTools.keys()].sort())).toEqual(['get_work', 'list_works', 'search_works']);
    await page.getByRole('link', { name: 'Goto homepage', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as any).collectionTools.size)).toBe(0);
});

test('collection pages render without WebMCP', async ({ page }) => {
    for (const collection of ['posts', 'works']) {
        await page.goto(`${baseURL}/${collection}`);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(collection === 'posts' ? 'Posts' : 'Works');
        expect(await page.getByRole('heading', { level: 2 }).count()).toBeGreaterThan(0);
    }
});
