# Interactive teuteuteu.com History

## Objective

Turn the localized history route into a detailed interactive archive while preserving the restrained visual language of teuteuteu.com. The home experience remains unchanged, centered, and scroll-free. The separate history route remains scrollable and fully indexable.

The page must communicate three different things without ambiguity:

- what primary evidence confirms;
- what contextual evidence suggests;
- what remains unknown.

## Information architecture

The page begins with a short introduction followed by a standalone “What remains unknown” section. This section is not part of the ordered timeline and carries no date. It names the unresolved roles: original SWF creator, 2005 registrant, HTML developer, and named commercial operator.

A compact period navigation follows:

1. Origins
2. Viral circulation
3. Parking
4. Editorial blog
5. Restoration

The main content is one chronological sequence. Events are never hidden by filters because filtering would damage chronological comprehension.

## Event interaction

Each event is a native `details` element with a stable fragment identifier. Its always-visible summary contains:

- date or date range;
- evidence status as text;
- factual title;
- one-sentence synopsis.

Expanded content uses the same evidence template:

1. What we know
2. What it proves
3. What it does not prove
4. Technical evidence, when relevant
5. Direct primary sources with archive timestamps

The principal 2005 evidence is open by default. Other events are collapsed by default. A progressively enhanced client control provides “Open all” and “Close all”. Native disclosure remains functional without JavaScript.

Opening a URL fragment automatically exposes and focuses the matching event. Each event provides a small copy-link control when JavaScript is available.

## Evidence statuses

Three statuses are used:

- `confirmed`: direct primary evidence or convergent independent sources;
- `lead`: a documented relationship that does not establish authorship or ownership;
- `context`: reliable background that helps explain an era without proving identity.

Unknown facts are presented in the standalone introductory section rather than as a dated timeline status.

Status is always conveyed by visible text. Color is secondary and never the only signal.

## Historical scope

The structured timeline includes:

- 21 January 2005: `boulet.swf` server timestamp establishing early activity on the Free.fr account;
- 3 February and 15 March 2005: Tuningo and Répondeur Téléphonique already operating in the mobile-content ecosystem;
- 7 May 2005: preserved server `Last-Modified` value for `www.teuteuteu.com.swf`;
- 30 May 2005: preserved server timestamp for the related La Grenouille Folle SWF;
- 9 June 2005: preserved server timestamp for the original HTML;
- 13 June 2005: earliest successful public capture currently found;
- 2006: gradual removal of the commercial outbound links while the core experience remains;
- 2005–2007: contemporary forum circulation and identification of the music;
- 2008: expansion of the Free.fr account into a collection of browser games;
- 2010–2014: documented GoDaddy parking period;
- 2011–2012: `tomware` demonstrably using the same Free.fr account for personal images, treated only as a later-control lead;
- 7 December 2020: new registry creation date shown by the 2023 WHOIS snapshot;
- 2021–2023: unrelated content blog with Pig Web named as publisher and OVH as host;
- 31 December 2023: privacy-protected WHOIS snapshot;
- 10 July 2026: new Verisign registry cycle;
- July 2026: modern restoration based on the preserved SWF.

Claims rejected from the public history include an archery-club attribution, an unverified Reddit announcement, acquisition in 2024, proof of a PBN, proof of WordPress from an external scan alone, and a named original creator.

## Data architecture

Historical dates, identifiers, statuses, source URLs, and event keys live in one typed data module. Localized prose lives in the translation catalogue and references stable event keys. The page component renders the data model instead of hardcoding each event.

A small client component owns only progressive interaction controls. It does not own, fetch, or duplicate historical content.

The purchased WHOIS files and deep-research bundle remain local evidence and are never committed or served publicly.

## Visual design

The visual system continues the current white page, Tahoma/Verdana typography, and historical blue links.

Desktop uses a narrow date rail and a readable content column. Mobile becomes a single column. The timeline line is thin and quiet. Disclosure summaries use no card shadows, decorative gradients, oversized headings, or dashboard patterns.

Status colors are restrained:

- confirmed: blue;
- lead: amber;
- context: neutral gray.

Motion is limited to a short disclosure indicator transition and is removed under `prefers-reduced-motion`.

## Accessibility

- Native `details` and `summary` provide disclosure semantics.
- Heading levels remain sequential.
- Dates use `time` elements where a precise machine-readable date exists.
- Period navigation has an accessible label.
- All source links describe their destination and date.
- Copy-link feedback is announced through a polite live region.
- Focus remains visible and fragment navigation moves focus to the target event.
- The full history is usable with keyboard, screen reader, CSS disabled, or JavaScript disabled.

## Internationalization

All public locales receive the same event set and evidence links. Dates are formatted with `Intl.DateTimeFormat`. Proper nouns, identifiers, exact URLs, and archived French quotations are not translated. Interface labels, summaries, evidence explanations, and interaction feedback are localized.

## Search and structured data

All historical prose is server-rendered and visible in the document, including collapsed disclosure content. No hidden keyword copy is added.

The Article JSON-LD keeps 13 June 2005 as the earliest documented evidence and July 2026 as the restoration publication. The page also emits an `ItemList` describing chronological events without claiming that the first archive is the original creation date.

## Verification

- Unit tests validate ordering, stable event IDs, status values, source URLs, and the separation of unknown facts from dated events.
- Translation tests require complete labels and event copy for every public locale.
- Component tests cover open-all, close-all, fragment opening, and copy-link behavior.
- Lint, TypeScript, unit tests, production build, and Docker build must pass.
- French and English production HTML must contain the full chronology.
- Desktop and mobile checks must confirm readable summaries, visible focus, and no horizontal overflow.
- The home experience must remain visually and functionally unchanged.

## Publication

Implementation is committed separately from this design. Only source code, tests, and public documentation are pushed. `LICENSE`, purchased WHOIS material, research bundles, personal data, and generated archives remain outside the commit.
