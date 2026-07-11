# Complete teuteuteu.com History Page

## Goal

Replace the current abbreviated history with a complete, sourced account of the domain before and after its original Flash period, while preserving the site's restrained visual language.

The page must distinguish verified facts from reasonable inferences and unresolved questions. It must never present the earliest surviving archive as the domain's proven creation date.

## Editorial structure

The page uses a short narrative introduction followed by a chronological timeline:

1. **13 June 2005 — earliest surviving evidence.** The earliest successful Wayback capture currently found already contains the Flash experience, JavaScript window shaking, the instruction to turn up the speakers, and an externally hosted SWF.
2. **2006–2007 — circulation.** Contemporary forum discussions establish that the page circulated among French-speaking web users and identify its sound and shaking as memorable parts of the experience.
3. **2010–2014 — parked domain.** Archived captures show that the original experience had disappeared and the domain was being used as a GoDaddy parking page.
4. **2020–2023 — unrelated editorial blog.** The domain became a French content/SEO blog. Archived legal notices identify Pig Web, RCS Evreux 848 781 845, as the publisher of that later site. This does not establish ownership or creation of the 2005 Flash site.
5. **10 July 2026 — re-registration and restoration.** The current Verisign RDAP record begins on this date, consistent with the domain having been deleted and registered again. The current restoration recreates the preserved Flash interaction with modern web standards.

A final **What remains unknown** section states that no reliable public source found so far identifies the 2005 registrant or creator. The `premierecompagnie.free.fr` SWF host is described only as a technical clue.

## Evidence rules

- Every material historical claim links directly to a supporting archive, registry record, or contemporary discussion.
- Labels and wording distinguish `confirmed`, `clue`, and `unknown` information.
- “Since 2005” means “publicly documented by 13 June 2005,” not “created in 2005.”
- Pig Web is described as the archived blog's publisher, not as the original domain owner.
- Personal ownership is not inferred from usernames, tracker identifiers, hosting account names, or company officers.

## Page design

Keep the existing typography, narrow reading width, white background, and blue links. Add only a lightweight vertical timeline and small evidence labels. There are no cards, decorative hero, animation, or imagery that would compete with the original one-page experience.

The history route may scroll because it is a separate documentary page; the main button experience remains a fixed, overflow-hidden viewport.

## Internationalization

The complete content remains available under every currently supported locale. Historical proper nouns, company names, URLs, dates, and quoted French source text remain exact. Explanatory prose and interface labels are translated.

To avoid maintaining dozens of divergent factual timelines, historical events and source URLs live in one structured data model. Locale files contain the translated labels and prose keyed to those stable events.

## Metadata and structured data

- Update the history page description to mention the documented 2005 Flash artifact and its 2026 restoration.
- Keep canonical and language-alternate URLs.
- Continue emitting an `Article` JSON-LD document, with 13 June 2005 as the earliest documented date and 2026 as the restoration/publication context.
- Do not add hidden SEO text or claims unsupported by the visible page.

## Accessibility

- Use semantic headings and an ordered timeline.
- Evidence labels are plain text, not color-only signals.
- Source links have descriptive accessible names and visible keyboard focus.
- Dates use semantic `time` elements with machine-readable values.

## Verification

- Type-check, lint, unit tests, and production build must pass.
- Add or update tests for the structured timeline, source URLs, metadata, and the distinction between earliest evidence and creation.
- Check the French and English routes at desktop and mobile widths.
- Confirm that the main experience remains unchanged.

## Out of scope

- Purchasing a paid historical WHOIS report.
- Naming the original creator without new primary evidence.
- Reproducing the later parked pages or SEO blog.
- Adding speculative dates, ownership claims, or invisible search-engine copy.
