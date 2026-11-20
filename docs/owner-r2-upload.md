# Owner images through backend storage

New owner gallery/menu uploads use multipart backend API, not Cloudinary signatures. Community uploads and old Cloudinary display transformations remain available. R2 URLs pass through unchanged. A single form queue permits two POSTs across gallery/menu and all file selections. URLs merge into current draft in selection order; existing text edits survive reconciliation.

Saved tiles remain during deletion. Errors offer retry and block preview/save/submit. Cancelling a sent upload waits for its URL then deletes it; queued cancellation sends no request. Unmount releases previews and stops queued work without deleting successfully saved images. Pending cancelled uploads still clean up their eventual results.

Timeout/network/5xx never automatically repeats POST. The form reads `/submissions/me` without swallowing errors. One lost response with one new attributable URL can recover; absent or ambiguous URLs remain explicitly blocked and offer another draft read. With multiple simultaneous lost responses, the API has no request identifier to safely match URLs back to selected files; the form stays blocked instead of guessing which object a cancellation should delete. This conservative limit introduces no presigned/idempotency protocol.

`DELETE /submissions/:id/images` takes `{ "url": "..." }`; retry after a lost DELETE response only accepts 404 after a draft read confirms absence. Backend media membership is authoritative on PATCH; order/cover metadata can still change. Backend must deploy before this FE.

## Checks

- Node 22: `node --experimental-strip-types --test scripts/submission-upload-batch.test.mjs scripts/owner-gallery-limit.test.mjs scripts/owner-intro-word-limit.test.mjs scripts/community-upload-stability.test.mjs`: 14 pass.
- `npm run build`: pass. `npx tsc --noEmit --allowImportingTsExtensions`: pass (existing repository tests import `.ts` paths). ESLint on changed files: pass.
- Browser: real local Nest backend/PostgreSQL with local S3 HTTP storage. Gallery/menu, maximum two requests, reverse completion order, cover selection, deletion failure/retry, failed-image replacement, preview and save/submit pass. Network contains no POST to `api.cloudinary.com`; no React page errors.

Reproduce browser verification with the paired backend fixture:

1. Follow backend `docs/owner-r2-upload.md` to prepare a disposable local database and start `test/owner-r2.browser-server.ts`.
2. Run this FE with `API_URL=<fixture address> npx next dev --webpack --port 3117`.
3. Run `BASE_URL=http://localhost:3117 PLAYWRIGHT_MODULE=<existing Playwright module> node scripts/owner-r2.browser.mjs`.

The script uses an existing Playwright installation, generated test images, a local-only test JWT in `/tmp/cafe-owner-r2-browser.json`, and a localhost backend. No project dependencies were added. The in-app browser was unavailable; standalone headless Chrome performed these checks. Production R2 permissions/networking remain unverified.

## Deployment

Deploy backend first with `IMAGE_STORAGE_PROVIDER=r2`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`. Put no secrets in FE or Git. No migration, existing URL rewrite, merge, deployment or production data edits in this task.

After deployment: upload one gallery and one menu image; open their public URLs; confirm draft/preview and no Cloudinary upload; delete the test images. Production is unverified until this smoke test runs. Reverting FE to Cloudinary may restore the original failure and does not reliably restore upload. Repairing old Cloudinary 401 images is separate work.
