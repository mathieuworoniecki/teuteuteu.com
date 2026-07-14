import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HistoryControls } from "@/components/history-controls";
import { HistoryPixelScene } from "@/components/history-pixel-scene";
import { HISTORY_CHAPTERS } from "@/lib/history-chapters";
import { historyInterfaceMessagesFor } from "@/lib/history-interface-i18n";
import { historyMessagesFor } from "@/lib/history-i18n";
import { historyResearchMessagesFor } from "@/lib/history-research-i18n";
import { historyStoryMessagesFor } from "@/lib/history-story-i18n";
import {
  HISTORY_EVENTS,
  HISTORY_SOURCES,
  type HistoryEvent,
  type HistoryStatus,
} from "@/lib/history-timeline";
import { directionFor, supportedLocale, supportedLocales } from "@/lib/i18n";
import {
  historyMetadata,
  HISTORY_MODIFIED_AT,
  HISTORY_PUBLISHED_AT,
  localeHomePath,
  RESTORER,
  SITE_ORIGIN,
} from "@/lib/seo";

type HistoryPageProps = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const locale = supportedLocale((await params).locale);
  return locale ? historyMetadata(locale) : {};
}

function exactDate(locale: string, event: HistoryEvent) {
  if (!event.dateTime || !/^\d{4}-\d{2}-\d{2}$/.test(event.dateTime))
    return event.dateLabel;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${event.dateTime}T00:00:00Z`));
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const locale = supportedLocale((await params).locale);
  if (!locale) notFound();

  const messages = historyMessagesFor(locale);
  const research = historyResearchMessagesFor(locale);
  const ui = historyInterfaceMessagesFor(locale);
  const story = historyStoryMessagesFor(locale);
  const pageUrl = new URL(`/${locale}/history`, SITE_ORIGIN).toString();
  const websiteId = new URL("/#website", SITE_ORIGIN).toString();
  const webpageId = `${pageUrl}#webpage`;
  const articleId = `${pageUrl}#article`;
  const artifactId = `${pageUrl}#original-artifact`;
  const restorerId = `${pageUrl}#restorer`;
  const ledgerUrl = new URL("/history-sources.json", SITE_ORIGIN).toString();
  const statusLabels: Record<HistoryStatus, string> = {
    confirmed: ui.confirmed,
    lead: ui.lead,
    context: ui.context,
  };
  const eventById = new Map(HISTORY_EVENTS.map((event) => [event.id, event]));
  const citationUrls = Array.from(
    new Set(Object.values(HISTORY_SOURCES).map((source) => source.url)),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "teuteuteu.com",
        url: SITE_ORIGIN.toString(),
        inLanguage: locale,
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: pageUrl,
        name: messages.title,
        description: messages.original,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": articleId },
        datePublished: HISTORY_PUBLISHED_AT,
        dateModified: HISTORY_MODIFIED_AT,
      },
      {
        "@type": "Article",
        "@id": articleId,
        headline: story.title,
        alternativeHeadline: messages.title,
        description: messages.original,
        url: pageUrl,
        inLanguage: locale,
        datePublished: HISTORY_PUBLISHED_AT,
        dateModified: HISTORY_MODIFIED_AT,
        temporalCoverage: "2005/2026",
        mainEntityOfPage: { "@id": webpageId },
        author: { "@id": restorerId },
        about: { "@id": artifactId },
        citation: citationUrls,
        hasPart: HISTORY_CHAPTERS.map((chapter, index) => ({
          "@type": "WebPageElement",
          "@id": `${pageUrl}#chapter-${chapter.id}`,
          position: index + 1,
          name: story.chapters[chapter.id].title,
        })),
        isAccessibleForFree: true,
      },
      {
        "@type": "Person",
        "@id": restorerId,
        name: RESTORER.name,
        url: RESTORER.url,
      },
      {
        "@type": "CreativeWork",
        "@id": artifactId,
        name: "www.teuteuteu.com.swf",
        description: messages.original,
        temporalCoverage: "2005",
        url: HISTORY_SOURCES.originalSwf.url,
        sameAs: HISTORY_SOURCES.archive2005.url,
        subjectOf: { "@id": `${ledgerUrl}#dataset` },
      },
      {
        "@type": "Dataset",
        "@id": `${ledgerUrl}#dataset`,
        name: "teuteuteu.com public history source ledger",
        description: messages.original,
        url: ledgerUrl,
        dateModified: HISTORY_MODIFIED_AT,
        creator: { "@id": restorerId },
        distribution: {
          "@type": "DataDownload",
          contentUrl: ledgerUrl,
          encodingFormat: "application/json",
        },
      },
      {
        "@type": "ItemList",
        name: story.title,
        numberOfItems: HISTORY_CHAPTERS.length,
        itemListElement: HISTORY_CHAPTERS.map((chapter, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${pageUrl}#chapter-${chapter.id}`,
          name: story.chapters[chapter.id].title,
        })),
      },
    ],
  };

  return (
    <main className="history-page" dir={directionFor(locale)} lang={locale}>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
        type="application/ld+json"
      />
      <HistoryControls linkCopied={ui.linkCopied} />

      <article className="history-story">
        <header className="history-story__hero">
          <a className="history-page__back" href={localeHomePath(locale)}>
            ← {messages.back}
          </a>
          <div className="history-story__hero-copy">
            <p className="history-story__year">2005 → 2026</p>
            <h1>{story.title}</h1>
            <p className="history-story__intro">{story.intro}</p>
            <p className="history-story__duration">{story.duration}</p>
          </div>
          <nav aria-label={ui.periods} className="history-story__nav">
            {HISTORY_CHAPTERS.map((chapter, index) => (
              <a
                data-history-nav
                href={`#chapter-${chapter.id}`}
                key={chapter.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {story.chapters[chapter.id].title}
              </a>
            ))}
          </nav>
        </header>

        <section
          aria-labelledby="history-brief-title"
          className="history-brief"
        >
          <header>
            <p>{ui.known}</p>
            <h2 id="history-brief-title">{story.shortVersion}</h2>
          </header>
          <div className="history-brief__answers">
            <article>
              <h3>{ui.origins}</h3>
              <p>{messages.original}</p>
            </article>
            <article>
              <h3>{ui.restoration}</h3>
              <p>{messages.restoration}</p>
            </article>
            <article>
              <h3>{ui.context}</h3>
              <p>{messages.modern}</p>
            </article>
          </div>
        </section>

        <div className="history-story__chapters">
          {HISTORY_CHAPTERS.map((chapter, index) => {
            const copy = story.chapters[chapter.id];
            const events = chapter.eventIds.map((eventId) => {
              const event = eventById.get(eventId);
              if (!event) throw new Error(`Unknown history event: ${eventId}`);
              return event;
            });
            return (
              <section
                aria-labelledby={`chapter-${chapter.id}-title`}
                className="history-chapter"
                data-history-chapter
                id={`chapter-${chapter.id}`}
                key={chapter.id}
              >
                <div className="history-chapter__scene">
                  <HistoryPixelScene scene={chapter.scene} />
                  <span aria-hidden="true" className="history-chapter__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="history-chapter__copy">
                  <p className="history-chapter__period">
                    {story.chapter} {index + 1} · {chapter.period}
                  </p>
                  <h2 id={`chapter-${chapter.id}-title`}>{copy.title}</h2>
                  {copy.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p className="history-chapter__fact">
                    <span>{story.shortVersion}</span>
                    {copy.fact}
                  </p>
                </div>

                <details className="history-archive" suppressHydrationWarning>
                  <summary>
                    <span>{story.examineEvidence}</span>
                    <small>
                      {events.length} {story.evidenceFiles}
                    </small>
                  </summary>
                  <div className="history-archive__window">
                    <div
                      aria-hidden="true"
                      className="history-archive__titlebar"
                    >
                      <span>teuteuteu.com / {chapter.period}</span>
                      <span>×</span>
                    </div>
                    <div className="history-archive__events">
                      {events.map((event) => (
                        <section
                          className="history-evidence"
                          id={event.id}
                          key={event.id}
                        >
                          <header>
                            <span className="history-evidence__date">
                              {event.dateTime ? (
                                <time dateTime={event.dateTime}>
                                  {exactDate(locale, event)}
                                </time>
                              ) : (
                                event.dateLabel
                              )}
                            </span>
                            <span
                              className={`history-status history-status--${event.status}`}
                            >
                              {statusLabels[event.status]}
                            </span>
                            <h3>{event.title}</h3>
                          </header>
                          <ul className="history-evidence__facts" lang="en">
                            {event.evidence.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <h4>{story.directSources}</h4>
                          <ul className="history-evidence__sources">
                            {event.sourceKeys.map((sourceKey) => {
                              const source = HISTORY_SOURCES[sourceKey];
                              return (
                                <li key={sourceKey}>
                                  <a href={source.url}>{source.label}</a>
                                  <small lang="en">{source.captured}</small>
                                </li>
                              );
                            })}
                          </ul>
                          <button
                            className="history-evidence__copy"
                            data-copy-history={event.id}
                            type="button"
                          >
                            {ui.copyLink}
                          </button>
                        </section>
                      ))}
                    </div>
                  </div>
                </details>
              </section>
            );
          })}
        </div>

        <section className="history-mystery" id="mystery">
          <div aria-hidden="true" className="history-mystery__pixel">
            ?
          </div>
          <div>
            <p className="history-mystery__label">{story.remainsUnknown}</p>
            <h2>{story.mysteryTitle}</h2>
            <p>{story.mysteryBody}</p>
            <dl>
              <div>
                <dt>{story.strongestLead}</dt>
                <dd>
                  <code>premierecompagnie.free.fr</code> → <code>tomware</code>{" "}
                  <small>(2011–2012)</small>
                </dd>
              </div>
              <div>
                <dt>{story.remainsUnknown}</dt>
                <dd>{research.unresolved}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="history-methodology-title"
          className="history-methodology"
          id="methodology"
        >
          <header>
            <p>{ui.technicalEvidence}</p>
            <h2 id="history-methodology-title">{ui.known}</h2>
          </header>
          <div className="history-methodology__levels">
            <article>
              <h3>{ui.confirmed}</h3>
              <p>{story.chapters.birth.fact}</p>
            </article>
            <article>
              <h3>{ui.context}</h3>
              <p>{research.circulation}</p>
              <p>{research.parking}</p>
            </article>
            <article>
              <h3>{ui.lead}</h3>
              <p>{research.unresolved}</p>
            </article>
          </div>
          <footer>
            <a href="/history-sources.json">{ui.sources} · JSON</a>
            <a href="https://github.com/mathieuworoniecki/teuteuteu.com">
              GitHub
            </a>
          </footer>
        </section>

        <footer className="history-story__footer">
          <p>
            Restoration: <a href={RESTORER.url}>{RESTORER.name}</a>
          </p>
          <a href={localeHomePath(locale)}>← {messages.back}</a>
        </footer>
      </article>
    </main>
  );
}
