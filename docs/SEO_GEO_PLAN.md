# SEO + GEO optimization plan

## Goal

Make `teuteuteu.com` the canonical, citable source for the history and modern
restoration of the original Flash experience, while preserving the almost empty
homepage and keeping crawler traffic away from the click counter and database.

GEO is treated as an extension of good SEO: crawlable pages, original research,
clear claims, direct sources, and a site that is easy to quote. There will be no
hidden keyword text, doorway pages, fake reviews, fabricated dates, or mass
generated pages.

## Current baseline

Already in place:

- server-rendered, crawlable HTML;
- one stable URL per locale and per history page;
- canonical URLs, reciprocal `hreflang` alternatives, and `x-default`;
- international sitemap and crawler policy;
- localized metadata and social cards;
- `WebSite`, `WebApplication`, `Article`, and `ItemList` structured data;
- visible primary-source links, stable chapter fragments, and explicit evidence
  confidence levels;
- responsive history content that works without relying on the audio interaction;
- API routes excluded from crawler discovery.

The baseline should be preserved by automated tests on every deployment.

## Implementation status — 14 July 2026

Implemented in the first optimization wave:

- answer-first, localized history summary and visible evidence methodology;
- dedicated history social card and stronger localized metadata;
- corrected Schema.org graph separating the 2005 artifact from the 2026 article;
- static public JSON source ledger with hashes, events, statuses, and citations;
- explicit `OAI-SearchBot` access while keeping database APIs excluded;
- editorial modification dates shared by metadata and the sitemap;
- IndexNow notification after successful Vercel production deployments only;
- GitHub and Vercel `INDEXNOW_KEY` configuration;
- automated tests for crawler policy, structured data, the source ledger, social
  image generation, mobile, RTL, and international discovery.

Still requires owner access or editorial work:

- Google Search Console and Bing Webmaster verification tokens;
- submission and URL inspection in both dashboards;
- native-speaker quality classification for all indexed locales;
- preservation-community outreach, press material, and earned citations;
- recurring measurement and correction reviews.

## Priority 0 — make indexing measurable and trustworthy

### 1. Search engine ownership and diagnostics

- Verify the domain property in Google Search Console.
- Verify the site in Bing Webmaster Tools and submit the existing sitemap.
- Keep verification tokens in Vercel environment variables or DNS, never in the
  repository when they are secrets.
- Record the initial indexed-page count, excluded-page reasons, search queries,
  countries, devices, Core Web Vitals, and crawl errors.
- Inspect the homepage and the English and French history pages through each
  engine's URL inspection tool after important releases.

Success criteria:

- the canonical domain is verified in both tools;
- the sitemap is accepted without parsing or alternate-language errors;
- `/en/history` and `/fr/history` are indexable and rendered with their visible
  source material;
- API URLs remain absent from the index.

### 2. International indexation quality gate

The site exposes many locales, but quantity must not outrun translation quality.

- Classify locales as `human-reviewed`, `machine-reviewed`, or `pending-review`.
- Index English and French first, then the languages whose title, description,
  chapter copy, dates, direction, and source labels have been reviewed.
- Temporarily apply `noindex,follow` to a locale whose translation is unreliable;
  add it back to the sitemap only after review.
- Test every indexed locale for a self-canonical URL, reciprocal `hreflang`, a
  correct `lang`/`dir`, HTTP 200, and no accidental redirect based on IP.
- Keep an explicit language chooser available to users and crawlers. Browser
  language detection may suggest a locale but must not make other URLs
  undiscoverable.

Success criteria:

- every URL in the sitemap is a page we are comfortable showing to a native
  speaker;
- there are no `hreflang` return-tag, canonical, or mixed-language errors;
- right-to-left locales remain visually and semantically correct.

### 3. Deployment-driven discovery

- Replace the hard-coded sitemap modification date with the latest editorial
  release date, not a request-time timestamp.
- Add an IndexNow notification to the deployment workflow for changed public
  editorial URLs only.
- Never notify IndexNow, regenerate the sitemap, or touch the database when the
  global click counter changes.
- Explicitly allow `OAI-SearchBot` if ChatGPT Search visibility is desired.
- Decide separately whether `GPTBot` may access the site for model training;
  search visibility and training are different choices.

Success criteria:

- one editorial deployment produces at most one small batch of URL notifications;
- user clicks produce zero crawler notifications and zero SEO-related writes;
- crawler policy is covered by an automated test.

## Priority 1 — make the history page the citable source

### 4. Answer-first editorial layer

Add a compact, visible section to the history page that answers the questions
people and answer engines are most likely to ask:

- What was `teuteuteu.com`?
- When is it first documented?
- How did the original Flash animation work?
- Why did the browser window shake?
- What audio did it use?
- Who created it?
- What is confirmed, what is only a lead, and what remains unknown?
- Who restored the site and when?

Each answer should be short, factual, and followed by the strongest direct source
or by an explicit `unknown` statement. This is visible content for humans, not a
hidden SEO block. The current 2005 visual language should be retained.

Success criteria:

- every important factual sentence has a nearby source or confidence label;
- an answer remains understandable when quoted without the rest of the page;
- no claim upgrades a lead into a fact.

### 5. Research methodology and provenance

- Add a visible methodology panel explaining Wayback timestamps, HTTP
  `Last-Modified`, SWF decompilation, WHOIS/RDAP limits, and confidence levels.
- Publish a short correction policy and a dated history changelog.
- Expose the current research report and a machine-readable source ledger from the
  public GitHub repository, after removing private or licensed material.
- Identify the restorer and the exact scope of the restoration without implying
  authorship of the 2005 artifact.
- Keep direct archive URLs stable and add an archived fallback when a source is
  fragile.

Success criteria:

- readers can distinguish original evidence, interpretation, and restoration;
- the page states who wrote it, how it was researched, and when it changed;
- corrections can be traced to a dated commit or changelog entry.

### 6. Metadata and entity graph

- Give the history page its own historical Open Graph image instead of reusing the
  homepage interaction card.
- Expand localized titles and descriptions with the actual subject, for example
  “History of teuteuteu.com — the 2005 French Flash button”.
- Refine JSON-LD into one coherent graph: `WebSite`, current `WebPage`/`Article`,
  restorer `Person`, original digital artifact as `CreativeWork`, chapters as
  `hasPart`, and direct sources through `citation` where they match visible links.
- Use `temporalCoverage` or `about` for the 2005–2026 story. Do not use the
  original site's date as the creation date of the modern article.
- Keep all structured claims identical to visible content and validate the graph
  after every change.

Success criteria:

- no structured-data validation errors;
- article publication, modification, original-artifact, and restoration dates are
  semantically distinct;
- social shares of the history URL show the history, not only the blue button.

## Priority 2 — earn authority rather than simulate it

### 7. Original preservation assets

- Publish hashes, dimensions, frame rate, duration, ActionScript calls, and a safe
  technical description of the preserved SWF.
- Add screenshots of the 2005 capture, the extracted button, and the restoration
  comparison with useful alt text and captions.
- Provide a small public research dataset (CSV or JSON) containing dates, claim
  status, source URL, capture timestamp, and artifact hash.
- Link the dataset, article, source code, and live restoration together with
  stable URLs.

This material is difficult to reproduce and therefore more useful to journalists,
archivists, researchers, and answer engines than generic nostalgia copy.

### 8. Legitimate discovery and mentions

- Submit the preservation project to relevant Flash/Web preservation communities,
  French-web nostalgia communities, and digital-culture newsletters.
- Prepare a concise English/French press note with verified dates, screenshots,
  source links, and contact details.
- Invite corrections from former users or the original creator without publicly
  exposing unverified personal data.
- Do not buy links, manufacture forum mentions, or create thin satellite pages.

Success criteria:

- new referring domains are topically relevant and editorial;
- mentions describe the project accurately as a restoration;
- corrections or new evidence feed back into the public ledger.

## Priority 3 — performance and agent usability

### 9. Keep the public knowledge surface static and cheap

- Continue pre-rendering localized history pages.
- Cache sitemap, robots, social images, and immutable assets at the edge.
- Keep counter state out of the HTML cache key and out of structured data.
- Do not add database-backed page views for crawlers.
- Set explicit size budgets for JavaScript, images, fonts, and the history page.
- Monitor LCP, CLS, INP, server error rate, edge-cache hit rate, and Supabase
  request volume separately.

### 10. Accessibility for people and browser agents

- Preserve semantic headings, article/section structure, descriptive links, button
  names, ARIA state, keyboard access, reduced motion, and visible focus.
- Ensure evidence inside `<details>` remains present in the initial HTML.
- Test the history page with JavaScript disabled, a screen reader-oriented DOM
  inspection, narrow mobile widths, and right-to-left locales.
- Keep the original shaking effect opt-in and bounded so it never prevents access
  to the historical explanation.

## Measurement dashboard

Review monthly at first, then quarterly:

- valid indexed pages by locale;
- impressions, clicks, click-through rate, and query groups for the brand, the
  Flash artifact, French-web nostalgia, and restoration research;
- traffic and citations from ChatGPT (`utm_source=chatgpt.com`) and other answer
  engines where referral data is available;
- earned referring domains and links to the primary history page;
- search-console generative-AI visibility when available;
- Core Web Vitals and crawler error rates;
- Supabase and Vercel usage attributable to bots versus real interactions;
- corrections, new primary sources, and unresolved claims.

Rankings alone are not a sufficient KPI. The target is to become the source that
search engines and answer engines cite when they explain what `teuteuteu.com` was.

## Suggested delivery sequence

### Sprint A — technical truth and measurement

1. Search Console and Bing verification.
2. Locale quality/indexation matrix.
3. Sitemap modification-date correction.
4. Explicit crawler policy and IndexNow-on-deploy.
5. Automated crawl/canonical/alternate/structured-data tests.

### Sprint B — citable history

1. Visible answer-first block.
2. Methodology, corrections, and changelog.
3. Refined entity graph and historical social card.
4. Public source ledger and technical artifact facts.

### Sprint C — authority and iteration

1. Bilingual press/preservation kit.
2. Targeted outreach to relevant communities.
3. Monthly measurement review.
4. Translation review and gradual index expansion.

## References

- Google Search Central, “Optimizing your website for generative AI features on
  Google Search”: <https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>
- Google Search Central, “Managing multi-regional and multilingual sites”:
  <https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites>
- OpenAI, “Publishers and Developers — FAQ”:
  <https://help.openai.com/en/articles/12627856-publishers-and-developers-faq>
- IndexNow protocol documentation: <https://www.indexnow.org/documentation>
