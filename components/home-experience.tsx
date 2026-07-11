import { DonorStream } from "@/components/donor-stream";
import { PwaRegistrar } from "@/components/pwa-registrar";
import { TeuteuteuMachine } from "@/components/teuteuteu-machine";
import { historyMessagesFor } from "@/lib/history-i18n";
import { directionFor, messagesFor, type SupportedLocale } from "@/lib/i18n";
import { localeHistoryPath, RESTORER, SITE_ORIGIN } from "@/lib/seo";
import { supportMessagesFor } from "@/lib/support-i18n";
import type { SiteState } from "@/lib/types";

const INITIAL_STATE: SiteState = { clicks: "0", configured: false, donors: [] };

type HomeExperienceProps = { locale: SupportedLocale };

export function HomeExperience({ locale }: HomeExperienceProps) {
  const messages = messagesFor(locale);
  const supportMessages = supportMessagesFor(locale);
  const historyMessages = historyMessagesFor(locale);
  const direction = directionFor(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "WebApplication"],
    name: "teuteuteu.com",
    url: SITE_ORIGIN.toString(),
    applicationCategory: "EntertainmentApplication",
    browserRequirements: "Requires JavaScript and Web Audio for the restored interaction",
    inLanguage: locale,
    isAccessibleForFree: true,
    creator: { "@type": "Person", name: RESTORER.name, sameAs: RESTORER.url },
  };

  return (
    <main className="site-shell" dir={direction} lang={locale}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
        type="application/ld+json"
      />
      <DonorStream donors={INITIAL_STATE.donors} label={messages.donors} />
      <TeuteuteuMachine
        direction={direction}
        historyHref={localeHistoryPath(locale)}
        historyLabel={historyMessages.link}
        initialState={INITIAL_STATE}
        locale={locale}
        messages={messages}
        supportMessages={supportMessages}
      />
      <PwaRegistrar />
    </main>
  );
}
