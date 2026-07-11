# Anti-spam and DDoS plan

## Objective

The page, button and audio must stay available even when the global counter is attacked. Counter writes are secondary and can be switched to read-only without affecting the historical interaction.

## Vercel edge layer

1. Keep both custom domains behind Vercel's CDN and automatic DDoS mitigation.
2. Cache the historical MP3, button PNGs and icon as immutable static assets for one year.
3. Micro-cache `/api/counter` at Vercel for two seconds and `/api/supporters` for one minute. Keep `/api/state` only as a compatibility endpoint.
4. Rate-limit `POST /api/click` to 60 requests per minute per IP with a persistent one-minute action.
5. Validate every browser click with Vercel BotID Basic before invoking Supabase. Keep JA4 fingerprint rules in log-only mode because legitimate browsers can share a fingerprint.
6. Do not challenge or rate-limit the Buy Me a Coffee webhook with the browser rule. It is protected by its signature and body-size limit.
7. Keep Vercel Pro spend notifications and a hard spending limit enabled.

## Next.js application layer

1. Accept only an empty `POST /api/click` request.
2. In production, require a matching `Origin` and reject foreign `Sec-Fetch-Site` values.
3. Hash the normalized visitor address with `CLICK_RATE_LIMIT_SECRET`; never store the raw address.
4. Set `CLICK_COUNTER_ENABLED=false` during an incident to return the current total without writing.
5. Return `Cache-Control: no-store` on write and webhook responses.
6. Keep audio playback, button feedback and shake animation independent from API success.
7. Refresh the public total every 2.5 seconds with jitter only while the tab is visible; back off to 60 seconds on repeated failures.

## Supabase layer

1. Increment one of 64 counter shards and rate-limit in one atomic PostgreSQL transaction.
2. Keep service credentials server-only and revoke function/table access from public roles.
3. Accept at most 60 presses per visitor fingerprint per minute.
4. Delete inactive rate-limit rows older than two hours in bounded batches with an hourly Supabase Cron job.
5. Use the active Supabase Pro plan for backups, higher quotas and no-pausing guarantees; monitor usage before increasing compute.

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
