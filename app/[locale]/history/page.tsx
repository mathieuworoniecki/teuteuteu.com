import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { historyMessagesFor } from "@/lib/history-i18n";
import { directionFor, supportedLocale, supportedLocales } from "@/lib/i18n";
import { historyMetadata, localeHomePath, RESTORER, SITE_ORIGIN } from "@/lib/seo";

type HistoryPageProps = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HistoryPageProps): Promise<Metadata> {
  const locale = supportedLocale((await params).locale);
  return locale ? historyMetadata(locale) : {};
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const locale = supportedLocale((await params).locale);
  if (!locale) notFound();
  const messages = historyMessagesFor(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: messages.title,
    description: messages.original,
    url: new URL(`/${locale}/history`, SITE_ORIGIN).toString(),
    inLanguage: locale,
    datePublished: "2026-07-10",
    dateModified: "2026-07-11",
    author: { "@type": "Person", name: RESTORER.name, url: RESTORER.url, sameAs: RESTORER.url },
    isAccessibleForFree: true,
  };

  return (
    <main className="history-page" dir={directionFor(locale)} lang={locale}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
        type="application/ld+json"
      />
      <article>
        <h1>{messages.title}</h1>
        <p>{messages.original}</p>
        <p>{messages.restoration}</p>
        <p>{messages.modern}</p>
        <h2>{messages.sources}</h2>
        <ul>
          <li><a href="https://www.macuser.de/threads/wie-geht-das.183952/" rel="noreferrer">MacUser, 3 July 2006</a></li>
          <li><a href="https://forum.ubuntu-fr.org/viewtopic.php?pid=285537" rel="noreferrer">Ubuntu-fr, May 2006</a></li>
          <li><a href="https://forum.pcastuces.com/teuteuteu-f5s19492.htm?rep=1678040" rel="noreferrer">PC Astuces, 24 April 2006</a></li>
          <li><a href="https://www.gamekult.com/forum/t/teu-teu-teu-teuteuteu-teuteu/171639" rel="noreferrer">Gamekult, 2007</a></li>
        </ul>
        <p className="history-page__credit">Restoration: <a href={RESTORER.url}>{RESTORER.name}</a></p>
        <a className="history-page__back" href={localeHomePath(locale)}>← {messages.back}</a>
      </article>
    </main>
  );
}
