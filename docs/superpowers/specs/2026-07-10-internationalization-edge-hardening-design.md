# Internationalisation and edge-hardening design

## Goal

Make the single-page restoration feel native to an international visitor without adding visible controls or changing the original composition. Keep the page, audio and button usable if localisation, Supabase or the counter API fails. Use Vercel's Git integration as the only production deployment path.

## Localisation contract

- English is the source language and final fallback.
- Resolve the locale from the request `Accept-Language` header, matching exact tags first and then their base language. A supported `?lang=` value may override the page copy for testing and sharing.
- Ship reviewed dictionaries in the application. No runtime translation API, client tracking, remote dependency or translation latency is allowed.
- Initial coverage is 50 languages: English, French, German, Spanish, Italian, Portuguese, Dutch, Polish, Czech, Slovak, Hungarian, Romanian, Bulgarian, Greek, Turkish, Russian, Ukrainian, Swedish, Norwegian, Danish, Finnish, Estonian, Latvian, Lithuanian, Slovenian, Croatian, Serbian, Bosnian, Albanian, Catalan, Basque, Galician, Irish, Welsh, Icelandic, Maltese, Arabic, Hebrew, Persian, Urdu, Hindi, Bengali, Indonesian, Malay, Vietnamese, Thai, Japanese, Korean and Chinese.
- Regional variants map to the closest dictionary. Chinese distinguishes simplified and traditional scripts. Portuguese distinguishes Brazilian and European number formatting while sharing copy where appropriate.
- Arabic, Hebrew, Persian and Urdu set a right-to-left direction on the localised application region. The historical button remains visually centred and donor names are never translated.
- Translate every visible string and accessible label: instruction, loading state, play/pause control, counter, playback status, donor-region label, support prompt, metadata description and Open Graph text.
- Format exact and compact click totals with `Intl.NumberFormat` using the resolved locale. Keep all counter values as decimal strings/`BigInt`; localisation must not reduce numeric capacity or precision.
- If a dictionary key is missing, fall back per key to English. Invalid or unsupported locale tags also fall back to English.

## Architecture

- `lib/i18n.ts` owns supported locale metadata, tag normalisation, fallback selection, text dictionaries and direction.
- Server components resolve the initial locale. `app/layout.tsx` generates localised metadata and sets the document language/direction for automatic detection. `app/page.tsx` passes a small serialisable localisation object to client components.
- `TeuteuteuMachine` receives messages and locale as props; it contains no hard-coded user-facing copy. `DonorStream` receives its translated accessible label.
- Formatting helpers accept a locale explicitly and remain independently unit-tested.
- The query override affects the page region and its copy. Automatic request detection remains authoritative for document metadata, avoiding cookies and preserving a stateless one-page site.

## CDN and offline behaviour

- Vercel's GitHub integration deploys every push to `main`; GitHub Actions only validates lint, types, tests and builds.
- Vercel automatically serves static files through its CDN. Add explicit one-year immutable browser caching only to the historical MP3, button PNGs and icon whose contents are treated as versioned artefacts.
- Give `/api/state` a two-second Vercel-only micro-cache to collapse viral read bursts. Never cache `/api/click` or webhook responses. The HTML remains dynamic because it contains the current counter and donor list.
- Update the service worker to cache immutable assets and use network-first navigation with the last successful page as offline fallback. It must not return a permanently cached French or English shell to every visitor.

## Abuse and failure handling

- `/api/click` accepts only same-site browser writes when an `Origin` header exists, rejects unexpected request bodies, returns `Cache-Control: no-store`, and supports `CLICK_COUNTER_ENABLED=false` as an emergency read-only switch.
- `CLICK_RATE_LIMIT_SECRET` is a generated production secret. Raw IP addresses are never stored; the existing Supabase transaction remains the authoritative 60-per-minute limit.
- Vercel WAF observes `/api/click` with a log rule before enforcement. After traffic validation, enable a per-IP rate limit with a 429 response if the account plan supports it. Do not challenge the Buy Me a Coffee webhook.
- The webhook keeps signature verification, receives no CDN cache, and limits accepted body size before parsing.
- Audio playback and visual press feedback do not depend on successful counter writes.

## Verification

- Unit-test locale negotiation, regional fallback, English fallback, RTL direction, dictionary completeness and large-number formatting.
- Extend browser tests with English, French, Japanese and Arabic request locales; verify translated copy, `lang`, RTL behaviour, no scroll and unchanged audio/button interaction.
- Build with Next.js and the production Docker target.
- After deployment, verify both custom domains, immutable asset cache headers, no-store API headers, Supabase persistence, at least one RTL locale and GitHub/Vercel status.
- Apply the WAF initially in log mode and inspect live traffic before changing it to rate limiting, following Vercel's safe rollout guidance.

## External configuration still required

- The authenticated Vercel CLI may create `CLICK_RATE_LIMIT_SECRET`, link the local directory to project `prj_YBCbgFcdTz1QTjGzmGgm1MYsbvq9`, inspect the Supabase-provided variables and manage firewall rules.
- The Buy Me a Coffee signing secret must come from the owner's Buy Me a Coffee integration dashboard. It must be entered directly into Vercel and never pasted into chat or committed.
