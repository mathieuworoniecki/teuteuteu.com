import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { historyMessagesFor } from "@/lib/history-i18n";
import { historyResearchMessagesFor } from "@/lib/history-research-i18n";
import {
  EARLIEST_DOCUMENTED_DATE,
  HISTORY_SOURCES,
  RESTORATION_DATE,
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

export default async function HistoryPage({ params }: HistoryPageProps) {
  const locale = supportedLocale((await params).locale);
  if (!locale) notFound();
  const messages = historyMessagesFor(locale);
  const research = historyResearchMessagesFor(locale);
  const date = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${value}T00:00:00Z`));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: messages.title,
    description: messages.original,
    url: new URL(`/${locale}/history`, SITE_ORIGIN).toString(),
    inLanguage: locale,
    dateCreated: EARLIEST_DOCUMENTED_DATE,
    datePublished: RESTORATION_DATE,
    dateModified: "2026-07-12",
    author: {
      "@type": "Person",
      name: RESTORER.name,
      url: RESTORER.url,
      sameAs: RESTORER.url,
    },
    isAccessibleForFree: true,
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
        <h1>{messages.title}</h1>
        <h2>{research.timeline}</h2>
        <ol className="history-timeline">
          <li>
            <time dateTime={EARLIEST_DOCUMENTED_DATE}>
              {date(EARLIEST_DOCUMENTED_DATE)}
            </time>
            <span>{research.confirmed}</span>
            <p>{messages.original}</p>
            <p>{messages.restoration}</p>
            <a href={HISTORY_SOURCES.archive2005}>
              Wayback Machine — 2005
            </a> · <a href={HISTORY_SOURCES.swf2006}>SWF — 2006</a>
          </li>
          <li>
            <time dateTime="2006">2006–2007</time>
            <span>{research.contemporary}</span>
            <p>{research.circulation}</p>
            <ul>
              <li>
                <a href={HISTORY_SOURCES.pcAstuces2006}>PC Astuces — 2006</a>
              </li>
              <li>
                <a href={HISTORY_SOURCES.ubuntu2006}>Ubuntu-fr — 2006</a>
              </li>
              <li>
                <a href={HISTORY_SOURCES.macUser2006}>MacUser — 2006</a>
              </li>
              <li>
                <a href={HISTORY_SOURCES.gamekult2007}>Gamekult — 2007</a>
              </li>
            </ul>
          </li>
          <li>
            <time dateTime="2010">2010–2014</time>
            <span>{research.confirmed}</span>
            <p>{research.parking}</p>
            <a href={HISTORY_SOURCES.parking2010}>Wayback Machine — 2010</a>
          </li>
          <li>
            <time dateTime="2020">2020–2023</time>
            <span>{research.confirmed}</span>
            <p>{research.blog}</p>
            <a href={HISTORY_SOURCES.legal2021}>
              Wayback Machine — legal notice
            </a>
          </li>
          <li>
            <time dateTime={RESTORATION_DATE}>{date(RESTORATION_DATE)}</time>
            <span>{research.confirmed}</span>
            <p>{messages.modern}</p>
            <a href={HISTORY_SOURCES.rdap2026}>Verisign RDAP</a>
          </li>
          <li className="history-timeline__unknown">
            <strong>{research.unknown}</strong>
            <span>{research.unknown}</span>
            <p>{research.unresolved}</p>
          </li>
        </ol>
        <h2>{messages.sources}</h2>
        <p>{research.unresolved}</p>
        <p className="history-page__credit">
          Restoration: <a href={RESTORER.url}>{RESTORER.name}</a>
        </p>
        <a className="history-page__back" href={localeHomePath(locale)}>
          ← {messages.back}
        </a>
      </article>
    </main>
  );
}
