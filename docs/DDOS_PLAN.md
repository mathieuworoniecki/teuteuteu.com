# Anti-spam and DDoS plan

## Objective

The page, button and audio must stay available even when the global counter is attacked. Counter writes are secondary and can be switched to read-only without affecting the historical interaction.

## Vercel edge layer

1. Keep both custom domains behind Vercel's CDN and automatic DDoS mitigation.
2. Cache the historical MP3, button PNGs and icon as immutable static assets for one year.
3. Micro-cache `/api/state` at Vercel for two seconds to collapse simultaneous public reads without making the counter feel stale.
4. Create a dedicated WAF rule for `POST /api/click`. Start with logging, observe real traffic, then rate-limit each IP to 60 requests per minute with a `429` response.
5. On Vercel Pro, use a short persistent action when repeated bursts continue so rejected traffic is stopped before application compute.
6. Do not challenge or rate-limit the Buy Me a Coffee webhook with the browser rule. It is protected by its signature and body-size limit.
7. Keep Vercel spend notifications and a hard spending limit enabled.

## Next.js application layer

1. Accept only an empty `POST /api/click` request.
2. Reject foreign browser origins when an `Origin` header is present.
3. Hash the normalized visitor address with `CLICK_RATE_LIMIT_SECRET`; never store the raw address.
4. Set `CLICK_COUNTER_ENABLED=false` during an incident to return the current total without writing.
5. Return `Cache-Control: no-store` on write and webhook responses.
6. Keep audio playback, button feedback and shake animation independent from API success.
7. Refresh the public total only while the tab is visible and no more than once per minute.

## Supabase layer

1. Increment and rate-limit in one atomic PostgreSQL transaction.
2. Keep service credentials server-only and revoke function/table access from public roles.
3. Accept at most 60 presses per visitor fingerprint per minute.
4. Delete inactive rate-limit rows after 48 hours with a daily Supabase Cron job.
5. Keep the Free plan while database size and egress remain below 70% of their quotas; upgrade for backups, no-pausing guarantees or sustained viral traffic.

## Incident response

1. Inspect Vercel Firewall traffic, function errors and Supabase database/egress usage.
2. Switch the counter to read-only before the database becomes the bottleneck.
3. Enable Vercel Attack Challenge Mode if the whole site is targeted.
4. Keep static delivery and the page available throughout the incident.
5. Afterward, review blocked traffic, adjust the WAF threshold and confirm the cleanup job is healthy before restoring writes.

## Launch checks

- Human interaction remains counted.
- The 61st request from one fingerprint in a minute does not increment the total.
- Foreign origins and request bodies are rejected.
- Supabase failure does not stop audio or animation.
- The emergency switch makes the counter read-only.
- A valid signed webhook passes; an invalid or oversized webhook is rejected.
- Static assets show immutable cache headers and write APIs show no-store headers.
