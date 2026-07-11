import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeExperience } from "@/components/home-experience";
import { supportedLocale, supportedLocales } from "@/lib/i18n";
import { homeMetadata, localeHomePath } from "@/lib/seo";

type LocalePageProps = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const locale = supportedLocale((await params).locale);
  if (!locale) return {};
  return homeMetadata(locale, localeHomePath(locale));
}

export default async function LocaleHome({ params }: LocalePageProps) {
  const locale = supportedLocale((await params).locale);
  if (!locale) notFound();
  return <HomeExperience locale={locale} />;
}
