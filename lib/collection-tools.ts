import type { WebMCPTool } from './webmcp';

export interface CollectionItem {
    id: string | number;
    title: string;
    keywords: string;
    summary: string;
    year: number;
    published: string;
    pageUrl: string;
    source: Record<string, unknown>;
}

type Collection = 'posts' | 'works';
const punctuation = new RegExp('[^\\p{L}\\p{N}]+', 'gu');
const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase('en-US').replace(punctuation, ' ').trim();

export function createCollectionTools(collection: Collection, items: CollectionItem[]): WebMCPTool[] {
    const singular = collection === 'posts' ? 'post' : 'work';
    const label = collection === 'posts' ? 'articles' : 'projects';
    const annotations = { readOnlyHint: true, consequentialHint: false };
    const pagination = {
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        offset: { type: 'integer', minimum: 0, default: 0 },
    };
    const queryProperties = {
        query: { type: 'string', description: 'Topic keywords extracted from the user request, for example: react native expo. Punctuation and case are ignored.' },
        match: { type: 'string', enum: ['all', 'any'], default: 'all', description: 'Whether every query word or at least one query word must match.' },
        year: { type: 'integer', minimum: 1, maximum: 9999, description: 'Publication year.' },
        sort: { type: 'string', enum: ['relevance', 'newest', 'oldest'], default: 'relevance' },
        ...pagination,
    };
    const serialize = (item: CollectionItem) => ({ ...item.source, pageUrl: item.pageUrl });
    const error = (message: string) => ({ success: false, error: message });

    function readInput(input: unknown, allowed: string[]): Record<string, unknown> | undefined {
        if (!input || typeof input !== 'object' || Array.isArray(input)) return;
        if (Object.keys(input).some(key => !allowed.includes(key))) return;
        return input as Record<string, unknown>;
    }

    const runQuery = async (input: unknown, search: boolean) => {
        const values = readInput(input, search ? Object.keys(queryProperties) : Object.keys(pagination));
        if (!values) return error('Provide an object containing only the parameters in the tool schema.');
        const { limit = 20, offset = 0, query = '', match = 'all', sort = 'relevance', year } = values;
        if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > 100 ||
            typeof offset !== 'number' || !Number.isSafeInteger(offset) || offset < 0) {
            return error('limit must be an integer from 1 to 100; offset must be a nonnegative safe integer.');
        }
        if (typeof query !== 'string' || (search && !normalize(query))) return error('Provide a nonempty topic query.');
        if (!['all', 'any'].includes(String(match)) || typeof match !== 'string') return error('match must be all or any.');
        if (!['relevance', 'newest', 'oldest'].includes(String(sort)) || typeof sort !== 'string') return error('sort must be relevance, newest, or oldest.');
        if (year !== undefined && (typeof year !== 'number' || !Number.isInteger(year) || year < 1 || year > 9999)) return error('year must be an integer from 1 to 9999.');

        const terms = Array.from(new Set(normalize(query).split(' ').filter(Boolean)));
        const contains = (text: string, term: string) => ` ${normalize(text)} `.includes(` ${term} `);
        const matches = items.map(item => {
            const text = `${item.title} ${item.keywords} ${item.summary}`;
            const hits = terms.filter(term => contains(text, term));
            const score = hits.reduce((sum, term) => sum + 1 + (contains(item.title, term) ? 3 : 0) + (contains(item.keywords, term) ? 2 : 0), 0);
            return { item, hits, score };
        }).filter(({ item, hits }) =>
            (year === undefined || item.year === year) &&
            (!terms.length || (match === 'all' ? hits.length === terms.length : hits.length > 0))
        );
        if (search) matches.sort((a, b) => {
            const dateOrder = a.item.published.localeCompare(b.item.published);
            if (sort === 'oldest') return dateOrder;
            if (sort === 'newest') return -dateOrder;
            return b.score - a.score || -dateOrder;
        });
        const results = matches.slice(offset, offset + limit).map(({ item }) => serialize(item));
        return {
            success: true,
            total: matches.length,
            offset,
            limit,
            nextOffset: offset + results.length < matches.length ? offset + results.length : null,
            results,
        };
    };

    return [
        {
            name: `list_${collection}`,
            description: `Read the ${label} list objects shown on this page, including their metadata and links. Preserves the page's ordering.`,
            inputSchema: { type: 'object', properties: pagination, additionalProperties: false },
            annotations,
            execute: input => runQuery(input, false),
        },
        {
            name: `search_${collection}`,
            description: `Find ${label} by topic across titles, keywords, and summaries. Convert natural-language requests into topic keywords. Returns matching list objects and links; does not fetch external full content.`,
            inputSchema: { type: 'object', properties: queryProperties, required: ['query'], additionalProperties: false },
            annotations,
            execute: input => runQuery(input, true),
        },
        {
            name: `get_${singular}`,
            description: `Read one ${singular} list object by ID, including its summary, metadata, and links.`,
            inputSchema: {
                type: 'object',
                properties: { id: { type: ['string', 'integer'], description: `The ID returned by list_${collection} or search_${collection}.` } },
                required: ['id'],
                additionalProperties: false,
            },
            annotations,
            execute: async input => {
                const values = readInput(input, ['id']);
                if (!values || !['string', 'number'].includes(typeof values.id) ||
                    (typeof values.id === 'number' && !Number.isSafeInteger(values.id)) || !String(values.id).trim()) {
                    return error('Provide a valid string or integer id.');
                }
                const item = items.find(item => String(item.id) === String(values.id));
                return item ? { success: true, result: serialize(item) } : error(`No ${singular} found with that ID.`);
            },
        },
    ];
}
