import crypto from "node:crypto";

import { normaliseDonorName } from "@/lib/format";

type UnknownRecord = Record<string, unknown>;

export type BuyMeACoffeeEvent = {
  event_id: string | number;
  type: "donation.created" | "donation.refunded" | string;
  live_mode: boolean;
  created: number;
  data: UnknownRecord;
};

export type DonationDetails = {
  providerDonationId: string;
  donorName: string | null;
  isAnonymous: boolean;
};

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : {};
}

function asText(value: unknown): string | null {
  return typeof value === "string" ? normaliseDonorName(value) : null;
}

export function verifyBuyMeACoffeeSignature(rawBody: string, secret: string, signature: string | null): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = signature.trim().toLowerCase();

  if (actual.length !== expected.length || !/^[a-f0-9]+$/.test(actual)) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

export function parseBuyMeACoffeeEvent(rawBody: string): BuyMeACoffeeEvent | null {
  try {
    const event = JSON.parse(rawBody) as Partial<BuyMeACoffeeEvent>;
    if (
      (typeof event.event_id !== "string" && typeof event.event_id !== "number") ||
      typeof event.type !== "string" ||
      typeof event.live_mode !== "boolean" ||
      typeof event.created !== "number" ||
      !event.data ||
      typeof event.data !== "object"
    ) {
      return null;
    }
    return event as BuyMeACoffeeEvent;
  } catch {
    return null;
  }
}

export function donationDetails(event: BuyMeACoffeeEvent): DonationDetails {
  const data = asRecord(event.data);
  const supporter = asRecord(data.supporter);
  const providerDonationId = String(data.donation_id ?? data.id ?? event.event_id);
  const donorName =
    asText(data.supporter_name) ?? asText(supporter.name) ?? asText(data.donor_name) ?? asText(data.payer_name);
  const isAnonymous =
    data.is_anonymous === true || data.supporter_is_anonymous === true || supporter.is_anonymous === true;

  return { providerDonationId, donorName, isAnonymous };
}
