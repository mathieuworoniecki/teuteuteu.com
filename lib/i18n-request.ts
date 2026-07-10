import "server-only";

import { headers } from "next/headers";

import { resolveAcceptLanguage } from "@/lib/i18n";

export async function requestLocale() {
  return resolveAcceptLanguage((await headers()).get("accept-language"));
}
