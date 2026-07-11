# Live counter, SEO/GEO, and resilience design

## Intent

Preserve the historically faithful, one-screen teuteuteu experience while making the implementation resilient under viral traffic. The homepage remains a white, scroll-free `100dvh` canvas with the original button, counter, donors, and discreet support/history links. Editorial content lives on a separate, crawlable history route.

## Counter and abuse protection

- Split public reads into a two-second CDN-cached counter endpoint and a longer-cached supporters endpoint.
- Refresh the counter every 2.5 seconds with jitter, only while the document is visible, and back off to 60 seconds after failures.
- Store the exact total as decimal strings at every JavaScript boundary.
- Replace the single write hotspot with 64 Postgres counter shards while retaining a compatible `site_stats` read view and the existing RPC signature.
- Keep the transactional 60-click/minute visitor limit, shorten transient-row retention, enable RLS, and preserve the read-only circuit breaker.
- Reject invalid origin/fetch metadata before the database. Protect the click route with Vercel BotID Basic and the existing IP WAF rule; observe JA4 without enforcing a shared-fingerprint limit.

## Discovery and internationalization

- Keep automatic language negotiation at `/` and add stable `/{locale}` and `/{locale}/history` routes for every existing locale.
- Add self-canonicals, complete `hreflang` alternates, `x-default`, localized metadata, Open Graph, a sitemap, crawler policy, and structured data.
- Publish a visible, sourced history of the restored Flash artifact. Never add hidden SEO text or crawler-only content.
- Allow search, user-agent, and training crawlers to read public pages while excluding APIs and webhooks.
- Add a small `llms.txt` discovery aid without treating it as a ranking signal.

## Reliability and operating cost

- Stop caching deployment-bound Next.js HTML in the service worker. Cache only stable historical assets and a self-contained offline page.
- Display the active costs as Vercel Pro `$20/month`, Supabase Pro `from $25/month`, and domain `€16/year`, for `from $45/month + €16/year`, excluding taxes and overages.
- Add Vercel Web Analytics for page views only; do not emit a billable analytics event for every button click.
- Rotate the previously disclosed Supabase database credential before production verification.

## Acceptance criteria

- A second visible browser observes a click within five seconds without interacting.
- Hidden documents generate no polling, and failed polling backs off without surfacing an error.
- Concurrent accepted increments are never lost and no single counter row is a global write lock.
- Requests classified as bots, cross-site requests, invalid bodies, and rate-limited visitors do not mutate the total.
- Every supported locale has a stable home/history pair with valid canonical and alternate links.
- Updating between two service-worker deployments never returns HTML that references removed Next.js chunks.
- Lint, type checking, unit tests, production build, and Playwright pass before the production push.
