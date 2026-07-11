import { HomeExperience } from "@/components/home-experience";
import { supportedLocale } from "@/lib/i18n";
import { requestLocale } from "@/lib/i18n-request";

export const dynamic = "force-dynamic";

type HomeProps = { searchParams: Promise<{ lang?: string | string[] }> };

export default async function Home({ searchParams }: HomeProps) {
  const [automaticLocale, query] = await Promise.all([requestLocale(), searchParams]);
  const requestedLanguage = Array.isArray(query.lang) ? query.lang[0] : query.lang;
  const locale = supportedLocale(requestedLanguage) ?? automaticLocale;
  return <HomeExperience locale={locale} />;
}
