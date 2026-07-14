# User-friendly history redesign

## Objective

Replace the evidence-first history ledger with a four-minute illustrated story that balances nostalgia and investigation. The page must remain truthful, indexable, accessible, localized and visually related to the minimal 2005 experience.

## Reading architecture

The public story has five chapters:

1. 2005, a button appears.
2. The link goes viral.
3. Then, silence.
4. The domain's other lives.
5. 2026, the button returns.

Each chapter contains one pixel-art scene, a period, a narrative title, two or three short paragraphs and one memorable fact. A single disclosure named “Examine the evidence” exposes the event ledger, technical proof and direct sources for that chapter. The complete evidence remains server-rendered inside native `details` elements.

The page closes with a short investigation section asking who created the original site. It presents only documented leads and explicitly preserves uncertainty.

## Information hierarchy

The first viewport contains a back link, a concise title, a two-sentence introduction and a five-step chapter index. It does not expose evidence statuses, hashes, commercial identifiers or technical vocabulary.

The narrative is the primary layer. Dates, status labels, archived timestamps and source URLs are the secondary layer. Repeated “what we know / what it proves / what it does not prove” blocks are removed.

## Visual direction

The interface keeps the white page, Tahoma/Verdana typography and historical blue links. It avoids cards, glass effects, modern dashboard patterns and decorative gradients.

Five code-native pixel-art scenes use a limited palette of historical blue, pale blue, warm gray and amber. Desktop alternates scene and copy. Mobile always places the scene before the copy. A thin pixel cable visually connects the chapters.

Evidence disclosures resemble restrained Windows 2000 utility panels with a blue title strip and gray body. This treatment is reserved for archival material and never wraps the main narrative.

## Interaction

- Chapter navigation uses stable anchors.
- A small reading-progress indicator highlights the current chapter when JavaScript is available.
- Native chapter evidence disclosures work without JavaScript.
- Each individual source event keeps a stable deep link and copy-link control.
- Pixel motion is subtle and removed under `prefers-reduced-motion`.
- No modal, carousel or horizontal-scroll interaction is introduced.

## Content model

The existing 16-event evidence ledger and source registry remain the source of truth. A new five-chapter model references event IDs instead of duplicating dates or URLs. Localized interface and chapter copy are keyed by chapter.

The purchased WHOIS reports, private research bundle and extracted source material remain excluded from Git, Docker and public assets.

## Responsive behavior

Desktop uses a two-column editorial rhythm with alternating visual placement. Below 760 pixels, every chapter becomes one column. Navigation wraps naturally, technical identifiers break safely, touch targets remain at least 44 pixels high, and the page never overflows horizontally.

## Accessibility

- Sequential headings describe the five chapters.
- Pixel art is decorative when the adjacent narrative conveys the same information.
- Status is expressed in text, never by color alone.
- Focus styles remain visible.
- The experience supports keyboard, screen reader, CSS-disabled and JavaScript-disabled use.
- RTL locales mirror layout without reversing historical chronology.

## Search and structured data

All chapter narratives and evidence remain visible in server HTML. Article structured data remains, while the ItemList is reduced to the five public chapters. The 16 technical events remain addressable but no longer dominate search-facing headings.

## Verification

- Unit tests validate that every event belongs to exactly one chapter.
- Translation tests require complete chapter labels and copy for all locales.
- End-to-end tests cover chapter navigation, evidence disclosure, deep links, RTL and mobile overflow.
- Lint, TypeScript, unit tests, production build, Playwright and Docker must pass.
- The home route must remain unchanged.

## Publication

Commit only the redesign specification, source files, translations and tests. Preserve the user's modified `LICENSE`. Push to `main`, monitor GitHub Actions and verify the deployed Vercel page on desktop and mobile.
