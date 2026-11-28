# Cafe Maps Pricing Research Handoff

**Decision to make:** Should Cafe Maps charge visitors for a 30-day Pass? If so, which users would buy it, what would they pay for, and when should it launch?

**Recommendation:** Keep the pricing page and checkout as a reversible experiment. Keep production detail access in `measure` mode while collecting evidence. Offer a small, voluntary paid pilot once its benefits are clearly available. Consider an enforced quota only after measuring demand and preserving the basic details people need to choose and visit a café.

## What we know

| Item | Status |
| --- | --- |
| Offer | Proposed launch price of VND 10,000 for the first five confirmed buyers, then VND 19,000 for 30 days. One-time payment through PayOS. VND 29,000 is a candidate for a later test. |
| Implementation | The `feature/cafe-detail-access` worktrees contain the pricing page and detail checkout. Local PostgreSQL tests with simulated PayOS verified concurrent offer allocation and the switch to VND 19,000. A live PayOS checkout returned a valid QR. Payment settlement and production configuration remain unverified. |
| What the Pass unlocks today | The confirmed payment grants unlimited café details for 30 days. The pricing page also presents the interactive visited map and meetup polling as planned benefits. The Pass does not currently unlock those features. |
| What a hard limit changes today | Entering a café page automatically requests full detail. After the quota, the current UI hides directions, reviews, sharing, and some community actions along with extended content. Public previews already carry some basic fields, but the page does not render all of them when locked. |
| What the recorded quota measures | The limit is 10 distinct cafés per calendar month in Vietnam time. Current records count automatic detail opens. They can estimate how many visitors would encounter a limit, but they cannot measure deliberate demand for galleries, menus, or notes. |
| Available evidence | GA page-view integration and several Coffee Meetups events exist in the repository. No production traffic export, confirmed purchase data, retention baseline, or Mapbox bill was reviewed for this handoff. |

The owner submission allowance is a separate proposal. Assess its review workload and business value separately from consumer willingness to pay.

## Why charge, and why wait

- **A plausible paid job exists.** Frequent café explorers may value recent photos, menus, and curated notes if those details help them choose where to go and save time. An interactive visited map may support a case for charging if its ongoing cost and repeat use are material. Polling may serve meetup organizers who already spend time getting a group to agree.
- **A paywall can interrupt the core job.** A visitor arriving from search or a shared link may only need opening hours, a price range, or directions. Hiding these can reduce visits, shares, saves, and repeat use even if it produces some sales. Paywall demand may reflect an interrupted task, so compare it with voluntary purchases.
- **The price depends on repeat value and economics.** Start the pilot at VND 19,000 after the five VND 10,000 checkouts. Treat those five purchases as a checkout and messaging check. They are too few, publicly discounted, and ordered by arrival, so they cannot establish demand at VND 19,000 or VND 29,000. Test VND 29,000 with comparable new users after the additional benefits are available and used.
- **The bundle needs evidence feature by feature.** If map loads drive cost, compare the paid map with a limited free preview or a list-only free experience. If few organizers create repeat meetups, defer polling. Keep the basic actions users rely on and the data they already saved available after expiry.

## Research plan

1. **Establish the baseline.** Request at least one complete month of de-identified product data. Count unique visitors, unique cafés opened per visitor, same-month repeat visits, search and shared-link entries, mobile share, and signed-in share. Show the distribution and the number of people above 10 distinct opens. Separate guests and accounts and account for the existing identity merge. Flag missing or biased data.
2. **Observe deliberate intent.** Give visitors an explicit way to open the extended content while keeping basic information public. Record the action, content availability, and subsequent directions or saves. Compare how often users open extra details for cafés with useful content against the existing automatic page-open figures. Check whether the catalog has enough recent, distinctive content to support a paid experience.
3. **Interview around real visits.** Recruit return visitors who browse many cafés, occasional visitors arriving from search or shared links, and people who organize meetups. Ask participants to reconstruct their last café decision, show what they used and what was missing, and describe how often they face that problem. Test the 30-day purchase offer after that discussion. Treat stated interest separately from confirmed purchases or renewals.
4. **Run a paid pilot with a comparison group.** Expose a stable cohort to an optional VND 19,000 offer for benefits it can immediately use. Keep a comparable cohort on the free experience. Include the offer, checkout start, and confirmed payment in the analysis. Report how many accounts saw each step, the purchase rate per exposed account, and the rate of a second purchase among customers whose first 30 days have elapsed. Exclude demo and seeded activity.
5. **Measure contribution and protect discovery.** Calculate collected revenue less refunds, payment fees, and incremental Mapbox or other service costs. Report content and support effort separately when exact allocation is unavailable. Compare directions, saves, shares, first visit completion, and seven-day return rates with the comparison group. Define acceptable changes and minimum sample size from the baseline before testing. Include uncertainty and avoid drawing a price conclusion from a handful of orders.
6. **Consider quota enforcement separately.** If voluntary demand and repeat use are promising, test an extended-content limit with a small stable cohort. Preserve address, hours, price range, directions, reviews, sharing, saves, and basic meetups. Compare optional Pass and limited extended access before choosing a site-wide policy.

## Decision criteria

| Evidence | Decision |
| --- | --- |
| Frequent users deliberately open extended content, VND 19,000 attracts repeat purchases, and the pilot covers incremental costs without degrading core discovery beyond the agreed bounds. | Continue the Pass. Consider a small quota trial once the public detail experience is complete. |
| Users value the product but purchases are weak, or they only pay after ordinary tasks are blocked. | Keep detail access open. Rework the paid benefits or test voluntary supporter access while improving content. |
| Paid usage is strong and map or polling delivers measurable recurring value. | Test VND 29,000 with a comparable new cohort. Evaluate net revenue per exposed account and retention alongside conversion. |
| Measurement is unreliable or the sample is too small. | Keep `measure` mode and gather stronger evidence before changing access or price. |

## Assignment for the analysis session

Use the [plans and pricing proposal](cafe-detail-access-pricing.md) for feature scope and the handoff above for research priorities. Return a recommendation to proceed, revise, or defer. Identify which segment would buy the Pass, what evidence supports each benefit, the best first offer, and the metrics or unknowns that could reverse the recommendation. Label source findings, hypotheses, and measured results separately. If product data is unavailable, specify the exact aggregate data to request and which decisions it would resolve.
