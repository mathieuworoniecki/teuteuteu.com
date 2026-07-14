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
  EARLIEST_DOCUMENTED_DATE,
  HISTORY_EVENTS,
  HISTORY_SOURCES,
  type HistoryEvent,
  type HistoryStatus,
} from "@/lib/history-timeline";
import { directionFor, supportedLocale, supportedLocales } from "@/lib/i18n";
import {
  historyMetadata,
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
  const statusLabels: Record<HistoryStatus, string> = {
    confirmed: ui.confirmed,
    lead: ui.lead,
    context: ui.context,
  };
  const eventById = new Map(HISTORY_EVENTS.map((event) => [event.id, event]));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: story.title,
        description: story.intro,
        url: pageUrl,
        inLanguage: locale,
        dateCreated: EARLIEST_DOCUMENTED_DATE,
        datePublished: "2026-07-10",
        dateModified: "2026-07-14",
        author: {
          "@type": "Person",
          name: RESTORER.name,
          url: RESTORER.url,
        },
        isAccessibleForFree: true,
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
