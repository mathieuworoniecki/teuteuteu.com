import { DonorStream } from "@/components/donor-stream";
import { PwaRegistrar } from "@/components/pwa-registrar";
import { TeuteuteuMachine } from "@/components/teuteuteu-machine";
import { directionFor, messagesFor, supportedLocale } from "@/lib/i18n";
import { requestLocale } from "@/lib/i18n-request";
import { getSiteState } from "@/lib/site-state";
import { supportMessagesFor } from "@/lib/support-i18n";

export const dynamic = "force-dynamic";

type HomeProps = { searchParams: Promise<{ lang?: string | string[] }> };

export default async function Home({ searchParams }: HomeProps) {
  const [initialState, automaticLocale, query] = await Promise.all([getSiteState(), requestLocale(), searchParams]);
  const requestedLanguage = Array.isArray(query.lang) ? query.lang[0] : query.lang;
  const locale = supportedLocale(requestedLanguage) ?? automaticLocale;
  const messages = messagesFor(locale);
  const supportMessages = supportMessagesFor(locale);
  const direction = directionFor(locale);

  return (
    <main className="site-shell" dir={direction} lang={locale}>
      <DonorStream donors={initialState.donors} label={messages.donors} />
      <TeuteuteuMachine
        direction={direction}
        initialState={initialState}
        locale={locale}
        messages={messages}
        supportMessages={supportMessages}
      />
      <PwaRegistrar />
    </main>
  );
}
