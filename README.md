This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Google login

Frontend calls `GET /api-proxy/auth/oauth/google/start?returnUrl=/...`; `next.config.ts` rewrites `/api-proxy/*` to `API_URL`.

Local config:

```bash
API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Google OAuth Client config belongs to the backend. Add the frontend URL to allowed origins, and add the backend callback URL, usually `http://localhost:3001/api/auth/oauth/google/callback`, to authorized redirect URIs.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Cafe cache invalidation

FE and BE must share a nonempty `REVALIDATE_SECRET`. On BE, set
`FRONTEND_REVALIDATE_URL=https://cafemaps.net/api/revalidate-cafes`.
Keep secrets in deployment environment settings.

`POST /api/revalidate-cafes` requires `Authorization: Bearer <REVALIDATE_SECRET>`
and a JSON object: `{ "reason": "cafe_changed", "slug": "ten-quan" }`.
`{}` expires all cafe data. An optional slug must be a nonempty string after
trimming, at most 251 characters (the `cafe:` tag prefix uses five characters).
Invalid auth returns 401; malformed JSON, non-object bodies, or invalid slugs
return 400 without touching cache. Success returns
`{ "revalidated": true, "tags": ["cafes", "cafe:ten-quan"] }`.
Tags expire immediately across `/vi` and `/en`; the next page load fetches fresh
data. Existing tabs require a reload. Server fetch caching remains 300 seconds.

Deploy FE first, then BE. Verify a permitted CMS hours update: BE logs must show
`cafe.revalidate.done` with the correct slug and HTTP status, the detail API must
return `Cache-Control: no-store`, and the next load of both locale pages must
match the API. BE retries network failures, timeouts, 429 and 5xx once after
500 ms, with 3 seconds per attempt. Other failures do not retry or undo DB writes.

Regression check: `node --test scripts/revalidate-cafes.test.mjs`.
