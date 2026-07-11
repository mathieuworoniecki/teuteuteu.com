import "server-only";

import { headers } from "next/headers";

import { resolveAcceptLanguage } from "@/lib/i18n";

export async function requestLocale() {
  const requestHeaders = await headers();
  return resolveAcceptLanguage(requestHeaders.get("x-teuteuteu-locale") ?? requestHeaders.get("accept-language"));
}
