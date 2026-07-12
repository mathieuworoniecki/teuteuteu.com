import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HistoryControls } from "@/components/history-controls";
import { historyInterfaceMessagesFor } from "@/lib/history-interface-i18n";
import { historyMessagesFor } from "@/lib/history-i18n";
import { historyResearchMessagesFor } from "@/lib/history-research-i18n";
import {
  EARLIEST_DOCUMENTED_DATE,
  HISTORY_EVENTS,
  HISTORY_SOURCES,
  type HistoryEvent,
  type HistoryPeriod,
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

const periods: readonly HistoryPeriod[] = [
  "origins",
  "viral",
  "parking",
  "blog",
  "restoration",
];

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
  const pageUrl = new URL(`/${locale}/history`, SITE_ORIGIN).toString();
  const periodLabels: Record<HistoryPeriod, string> = {
    origins: ui.origins,
    viral: ui.viral,
    parking: ui.parking,
    blog: ui.blog,
    restoration: ui.restoration,
  };
  const statusLabels: Record<HistoryStatus, string> = {
    confirmed: ui.confirmed,
    lead: ui.lead,
    context: ui.context,
  };
  const periodSynopsis: Record<HistoryPeriod, string> = {
    origins: messages.original,
    viral: research.circulation,
    parking: research.parking,
    blog: research.blog,
    restoration: messages.modern,
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: messages.title,
        description: messages.original,
        url: pageUrl,
        inLanguage: locale,
        dateCreated: EARLIEST_DOCUMENTED_DATE,
        datePublished: "2026-07-10",
        dateModified: "2026-07-12",
        author: {
          "@type": "Person",
          name: RESTORER.name,
          url: RESTORER.url,
        },
        isAccessibleForFree: true,
      },
      {
        "@type": "ItemList",
        name: research.timeline,
        numberOfItems: HISTORY_EVENTS.length,
        itemListElement: HISTORY_EVENTS.map((event, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${pageUrl}#${event.id}`,
          name: event.title,
          ...(event.dateTime && /^\d{4}-\d{2}-\d{2}$/.test(event.dateTime)
            ? { dateCreated: event.dateTime }
            : {}),
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
      <article>
        <header className="history-header">
          <a
            className="history-page__back history-page__back--top"
            href={localeHomePath(locale)}
          >
            ← {messages.back}
          </a>
          <h1>{messages.title}</h1>
          <p>{messages.original}</p>
          <p>{messages.restoration}</p>
        </header>

        <aside
          aria-labelledby="history-unknown-title"
          className="history-unknown"
        >
          <h2 id="history-unknown-title">? {ui.unknown}</h2>
          <p>{research.unresolved}</p>
          <p>
            <code>premierecompagnie.free.fr</code> · <code>tututete</code> ·{" "}
            <code>pub-7619547521109019</code> · <code>r=15576</code>
          </p>
        </aside>

        <nav aria-label={ui.periods} className="history-periods">
          <span>{ui.periods}:</span>
          {periods.map((period) => (
            <a href={`#period-${period}`} key={period}>
              {periodLabels[period]}
            </a>
          ))}
        </nav>

        <div className="history-timeline-heading">
          <h2>{research.timeline}</h2>
          <HistoryControls
            closeAll={ui.closeAll}
            linkCopied={ui.linkCopied}
            openAll={ui.openAll}
          />
        </div>

        <div className="history-timeline">
          {periods.map((period) => {
            const events = HISTORY_EVENTS.filter(
              (event) => event.period === period,
            );
            return (
              <section
                aria-labelledby={`period-${period}-title`}
                className="history-period"
                id={`period-${period}`}
                key={period}
              >
                <h3 id={`period-${period}-title`}>{periodLabels[period]}</h3>
                <ol>
                  {events.map((event) => (
                    <li key={event.id}>
                      <details
                        data-history-event
                        id={event.id}
                        open={event.open}
                      >
                        <summary>
                          <span className="history-event__date">
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
                          <strong>{event.title}</strong>
                          <span className="history-event__synopsis">
                            {periodSynopsis[event.period]}
                          </span>
                          <span className="sr-only history-event__show">
                            {ui.showDetails}
                          </span>
                          <span className="sr-only history-event__hide">
                            {ui.hideDetails}
                          </span>
                        </summary>
                        <div className="history-event__body">
                          <section>
                            <h4>{ui.known}</h4>
                            <p>{periodSynopsis[event.period]}</p>
                          </section>
                          <section>
                            <h4>{ui.proves}</h4>
                            <p>
                              <strong>{statusLabels[event.status]}.</strong>{" "}
                              {event.title}
                            </p>
                          </section>
                          <section>
                            <h4>{ui.doesNotProve}</h4>
                            <p>{research.unresolved}</p>
                          </section>
                          <section>
                            <h4>{ui.technicalEvidence}</h4>
                            <ul lang="en">
                              {event.evidence.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </section>
                          <section>
                            <h4>{ui.sources}</h4>
                            <ul className="history-event__sources">
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
                          </section>
                          <button
                            className="history-event__copy"
                            data-copy-history={event.id}
                            type="button"
                          >
                            {ui.copyLink}
                          </button>
                        </div>
                      </details>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>

        <footer className="history-page__footer">
          <p className="history-page__credit">
            Restoration: <a href={RESTORER.url}>{RESTORER.name}</a>
          </p>
          <a className="history-page__back" href={localeHomePath(locale)}>
            ← {messages.back}
          </a>
        </footer>
      </article>
    </main>
  );
}
