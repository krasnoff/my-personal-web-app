This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contact page WebMCP

The `/contact` page exposes `send_contact_message` to WebMCP-capable browser
agents while the page is mounted. It takes `fullName`, `email`, and `message`
strings, fills the visible form, validates it, and sends through the existing
`/api/mailer` endpoint. The result reports `success` and either a `message` or
an actionable `error`. Sending is marked consequential because it sends real email.

Registration uses `document.modelContext` with a fallback for the older
`navigator.modelContext` API. Browsers without WebMCP keep the normal contact
form. Use a browser with WebMCP enabled on HTTPS (or localhost); in its tool
inspector, open `/contact` and invoke `send_contact_message`, for example:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "message": "I'd like to discuss a project."
}
```

Email delivery uses the existing server environment variables `HOST`, `LOGIN`,
`API_KEY`, and `RECIPIENT_EMAIL`. A failed or cancelled request cannot confirm
whether delivery occurred; verify before retrying to avoid duplicate emails.

Run `npm run dev`, then `npx playwright test tests/contact-webmcp.spec.ts
--project=chromium` to verify the integration. These tests mock the browser API
and intercept the mail endpoint, so no email is sent. Browser-agent discovery
itself requires a WebMCP-enabled browser.

## Posts and works WebMCP

The collection pages expose read-only tools using the same data as their visible
lists. Tools are registered only while their collection page is mounted:

| Page | List objects | Search objects | Get one object |
| --- | --- | --- | --- |
| `/posts` | `list_posts` | `search_posts` | `get_post` |
| `/works` | `list_works` | `search_works` | `get_work` |

List tools accept `{}` or optional `limit` (1–100, default 20) and `offset`
(default 0). Search tools require `query`, and also accept `match` (`all` by
default, or `any`), `year`, `sort` (`relevance`, `newest`, `oldest`), `limit`, and
`offset`. Get tools accept an `id` from a list/search result as a string or integer.

For example, invoke `search_posts` on `/posts` with:

```json
{ "query": "react native expo", "match": "all", "limit": 10 }
```

This finds **A Practical Guide to Building Mobile Apps with AI Tools**. The same
query with `search_works` finds **Speech Transcriber** and **Plant Identifier**.
Search matches whole words across titles, keywords, and summaries, ignoring case
and punctuation. Agents should extract topic keywords from conversational
requests; this is a local keyword search, not semantic search or external article
retrieval. `match: "any"` broadens results to any of the query words.

Results include the original list object fields plus `pageUrl` pointing to the
item's page. Existing `url` fields point to the full article or project. Collection
results also include `total`, `offset`, `limit`, and `nextOffset` (null at the end).
No matches returns an empty results array; invalid arguments return an error.

With the dev server running, test using:

```bash
npx playwright test tests/collection-webmcp.spec.ts --project=chromium
```

Set `TEST_BASE_URL` if the server runs somewhere other than `http://localhost:3000`.
Tests mock WebMCP registration and execution; live browser-agent discovery still
requires a WebMCP-enabled browser.
