<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cafe Maps Rules

- Files max 300 lines; large component becomes `ComponentName/index.tsx`.
- Fetch code lives in `src/apis/[feature]/index.ts`; no feature API in `src/lib`.
- Split feature code into `hooks`, `helpers`, `constants` only when file would exceed 300 lines or logic is reused.
- Before touching Next APIs, check installed Next version and local docs path; if `node_modules/next/dist/docs/` is missing, use official Next docs.
- Branch names should describe the work only; do not append dates like `-20250820`.
- Push with the `tanlucdev` GitHub account; keep `origin` set to `https://tanlucdev@github.com/tanlucdev/cafe-finder-fe.git`.
