# Cafe Maps Plans and Pricing

## Initial trial proposal

Offer two plans for café visitors. **Free** covers discovering, choosing, and saving cafés and creating meetups. **Cafe Maps Pass** adds unlimited extended café details, an interactive map, and café polls for meetups. The first five buyers pay **VND 10,000 for 30 days**. The standard price is **VND 19,000 for 30 days**, paid once through PayOS. Pending launch checkouts temporarily hold an offer. After all five offers are paid, new checkouts use the standard price. The current branch supports payment for café detail access. If this flow is used to test demand first, advertise café detail access as the trial benefit.

| Feature | Free | Cafe Maps Pass |
| --- | --- | --- |
| Discover cafés | Search and filter by area, vibe, purpose, price, and opening hours. Find nearby cafés, browse chains, and see similar cafés. | Same access. |
| Choose and visit a café | Name, cover photo, short description, address, opening hours, price range, amenities, parking information, directions, ratings, reviews, and link sharing. | Same access. |
| Explore a café in more detail | View additional photos, menu images, and curated notes for up to 10 distinct cafés per month. | View these details for any café with extended content during the 30-day Pass. |
| Personal account | Saved cafés, quiz, visited café list, browsing history, and basic meetup creation. | Adds the interactive map and the ability to start café polls. |
| Community | Read public reviews. Write reviews, vote, send feedback, and suggest cafés under the current permissions. | Same access. |
| Café owners | Submit up to 3 distinct new café listings per month for review. Updates to existing listings remain free and follow the review process. | The Pass is for visitors. Owner accounts retain the same submission allowance. |

Additional photos and curated notes are benefits worth testing with frequent café explorers. Deduct a view only when the café has extended content beyond its cover photo and basic information. Discovery, directions, and public reviews give first-time visitors something useful when they arrive from Google or a shared link. Free saves, reviews, and café suggestions give users reasons to return and help keep the catalog current.

## Current branch behavior

- The backend supports `measure` mode, which serves and records detail opens, and `enforce` mode, which applies the quota. In `enforce` mode, free views count distinct cafés per calendar month in Vietnam time. Guest usage is tracked per browser and signed-in usage per account. Guest usage merges into the account allowance at sign-in. Users can reopen cafés they already accessed for free in the same month.
- A confirmed payment grants 30 days of access to the account. Guests must sign in to buy the Pass. Donations use a separate flow.
- Opening a café URL currently requests full details automatically. Once the user reaches the limit, the page displays the preview and similar cafés. The backend preview already includes hours, price, amenities, and the Google Maps link. The page currently displays only part of this data. Directions, reviews, sharing, and some community actions currently appear in the full detail view.
- This assessment uses the frontend and backend source on the corresponding feature branches. User behavior, revenue, and production configuration have yet to be verified.

## Backend rollout

The frontend calls `POST /cafes/:slug/detail-access` to open full details. Deploy the backend with this endpoint and the access and payment migrations before the frontend. `GET /payments/cafe-detail/pricing` provides the public price tiers. Pending checkouts return the exact amount in VND, and checkout returns `409` while all remaining launch offers are held by pending orders. Verify that a new guest receives a cookie with a `428` response and receives full details with a `200` response on retry. Start with `measure` mode.

## Before enforcing limits

1. Display free information and core actions on the café page. Request full details only when the user selects **See more photos and menu**. Show the remaining views beside that action and keep the café page available when the user reaches the limit.
2. Keep public previews and the sitemap available so users can find cafés. Enforce paid access on the backend. Confirm that HTML, embedded data, Markdown, and listing APIs expose only public fields and that paying users can access their benefits after signing in on another device.
3. Run `measure` for at least one full monthly cycle after adding the explicit action. Measure the share of visitors who deliberately open more than 10 distinct cafés, using the existing rules for merging guest and account usage. The current count of café page opens reflects traffic to café pages. It cannot measure deliberate demand for additional photos and menus.
4. Test `enforce` with a small group and keep a `measure` group for comparison. Track confirmed payments among accounts shown the offer, revenue after fees and refunds, direction clicks, café saves, and seven-day return rates. Set acceptance thresholds using baseline data before the trial. Expand the rollout if revenue covers additional operating costs and free-user behavior stays within those thresholds.
5. Check the Mapbox account's quota and map loads. Initialize the interactive map after confirming the Pass and after the user chooses to open it. Measure loads per Pass account to estimate cost.

## Saved cafés, quiz, map, and meetups

Keep saved cafés, the quiz, and basic meetup creation free. Put the interactive map in the Pass because Mapbox loads count toward the quota. Keep the visited cafés list available to free users so they can still see their own activity.

| Feature | Free | Pass or future extension | Rationale |
| --- | --- | --- | --- |
| Saved cafés | Save and unsave cafés and create and manage personal folders after signing in. | Shared lists where groups can add cafés and vote. Invitees can participate for free. | Personal collections encourage return visits. Shared selection helps groups coordinate. |
| Quiz | Take the quiz, view the results and café recommendations, and download the result image. Sign in to keep a history. | Remains free. | The quiz helps visitors find cafés that fit their preferences and creates something they can share. Demand for a paid quiz feature is still unclear. |
| Visited map | Mark cafés as visited, browse the visited list, and get directions. | View visited cafés on an interactive Mapbox map. | Limiting map loads to Pass holders concentrates the Mapbox budget on paying users. |
| Coffee meetups | Create meetups, send basic invitations, view invitations, request to join, and approve attendees under existing permissions. Availability depends on the Coffee Meetups feature flag. | The organizer can open a poll with several cafés. Invitees can view and vote for free. | Easy participation helps invitations get responses. Organizers may pay if picking a café and a time takes effort. |

**Café polls for meetups.** A Pass holder selects a few saved cafés, shares one link with the group, and picks a café based on the votes. Only the person opening the poll needs a Pass. Test this flow before adding shared folders, time polls, or route planning. Measure the share of invitees who vote and the share of meetups that settle on a café to decide whether the feature should stay in the Pass. When the Pass expires, users can still view saved cafés, their visited list, and meetups they created.

## Café owner submission allowance

Trial **3 distinct new café listings per owner account per calendar month**, in Vietnam time. Count one submission when the backend accepts a new listing for review. Saving drafts, revising and resubmitting the same listing, and updating the address, opening hours, photos, or menu of an existing café are free and do not consume another submission. Owners with more branches can request batch review. Track the review backlog and how many owners reach the limit before pricing additional submissions.

Café owners could pay for clearly labeled sponsored placements and reports on views, saves, and direction clicks. This would be a separate product for owners. Basic listing information and organic ranking by relevance would remain public.

## Source references

- Frontend · [Café page](../app/%5Blocale%5D/%28main%29/cafe/%5Bslug%5D/page.tsx), [access states](../app/%5Blocale%5D/%28main%29/cafe/%5Bslug%5D/_components/CafeDetailAccess.tsx), [detail content](../app/%5Blocale%5D/%28main%29/cafe/%5Bslug%5D/_components/CafeDetailContent.tsx), [payment flow](../apis/payments/index.ts).
- Backend feature branch · `src/cafe-detail-access/cafe-detail-access.service.ts`, `src/cafes/cafes.service.ts`, `src/payments/payments.service.ts`.
