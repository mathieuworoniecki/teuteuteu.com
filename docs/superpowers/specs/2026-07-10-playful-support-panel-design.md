# Playful support panel design

## Goal

Explain the real operating budget behind teuteuteu.com and invite support with humour, while preserving the original empty one-page composition. The interaction must never prevent a visitor from clicking the central button or the Buy Me a Coffee link.

## Cost model

The initial configurable estimate is:

- Vercel Pro: USD 20 per month, including its monthly usage credit.
- Supabase Pro: USD 25 per month for the first project.
- Domain name: approximately EUR 16 per year.
- Summary: USD 45 per month plus EUR 16 per year, excluding taxes, exchange-rate changes and usage overages.

These values live in one typed configuration object rather than inside the presentation component. The panel labels the total as an estimate and links to `https://buymeacoffee.com/alzok`; it does not imply that a donation is tax deductible or guarantee a fixed future hosting bill.

## Visual treatment

- Keep the existing support link in its current bottom position.
- Show a compact Windows 2000-era utility window near the pointer. It contains a simple two-column cost table, an estimated-total row and one short explanatory line.
- Render the cat as an inline SVG on a small integer pixel grid with `shape-rendering: crispEdges`. CSS animates its eyes, ears and tail. No remote image, canvas runtime or generated-image dependency is required.
- Preserve the existing white background and historical blue. Do not introduce cards, a backdrop, page chrome, scrollbars or a modern modal treatment.
- Clamp the panel position within the viewport and keep enough distance from the pointer that it cannot intercept the intended link click.

## Pointer interaction

1. Hovering the support link reveals the panel and makes it follow the pointer with a restrained delay.
2. If the visitor remains without clicking for 2.5 seconds, the panel performs one short evasive movement and disappears.
3. It returns after one second with the cat and the first humorous prompt, equivalent to "Are you sure?".
4. A second prolonged hover triggers the final evasion and returns with the prompt equivalent to "A tiny tip for my kibble?".
5. After two evasions, the panel remains stable and clickable. No endless chase or random movement is allowed.
6. Clicking either the original support link or the stable panel opens Buy Me a Coffee in a new tab.
7. Pressing the central historical button immediately closes and resets the visible panel so it never competes with the original audio experience.

The state machine is explicit: `closed`, `following`, `evading`, `returning` and `stable`, plus an evasion count capped at two. Timers and animation frames are cancelled on close and component unmount.

## Internationalisation

- Every user-facing and accessible string uses the existing automatic locale resolution and all supported dictionaries: the support link, window title, cost labels, billing periods, estimate qualifier, explanatory copy, total, both cat prompts, close action and accessible cat/panel labels.
- Product names and the destination URL are not translated. Currency values retain their source currency to avoid presenting a misleading live exchange rate.
- Dictionary completeness tests treat the new support-panel keys as required for every locale. English remains the per-key fallback.
- Right-to-left locales reverse textual flow and table alignment while keeping numeric price tokens readable and the panel within the viewport.

## Keyboard, touch and motion

- Keyboard focus opens the panel directly in its stable state. `Escape` closes it. The panel and destination have clear accessible names and visible focus indicators.
- On coarse pointers, the first touch opens a stable panel and the second activation follows the external link. There is no cursor-following or evasion on touch devices.
- With `prefers-reduced-motion: reduce`, the panel fades in at a fixed position and never follows, evades or animates the cat.
- Hover-only content is supplemental: the support URL remains usable if JavaScript or animation fails.

## Component boundaries

- `lib/support-costs.ts` owns typed cost data and display tokens.
- `SupportExperience` owns pointer/focus state, timers and viewport clamping. It receives locale messages and exposes an optional reset signal from the historical button.
- `PixelCat` contains only the SVG and decorative animation hooks and is hidden from assistive technology.
- The historical audio engine does not depend on the support component. Its existing click handler only emits the reset signal.

## Verification

- Unit-test the cost configuration, message interpolation and complete support translations across every locale.
- Test the state machine with deterministic timers: first return, second return, two-evasion cap, close/reset and timer cleanup.
- Playwright verifies pointer following, viewport clamping, the two messages, eventual stable clickability, keyboard/Escape, touch behaviour, reduced motion, RTL layout and continued `overflow: hidden`.
- Re-run lint, TypeScript, unit tests, Chromium E2E, Next production build and Docker production build before deployment.

## GitHub presentation

- Replace the minimal README with a concise English project page.
- Lead with a real desktop screenshot of the finished application stored under `docs/assets/`, followed by a one-paragraph description of the Flash preservation goal.
- Summarise the original audio/shake timeline, internationalisation, global counter, supporters, playful cost panel, accessibility, PWA and abuse protection without marketing filler.
- Document the small Next.js/Supabase stack, Docker development command for WSL, production build commands, required environment-variable names and GitHub-to-Vercel deployment flow.
- Never include credentials, private dashboard links or exact secret values in the README or screenshot.
