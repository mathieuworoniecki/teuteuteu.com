import crypto from "node:crypto";

import { describe, expect, it } from "vitest";

import { donationDetails, parseBuyMeACoffeeEvent, verifyBuyMeACoffeeSignature } from "@/lib/webhook";

const secret = "not-a-real-secret";
const payload = JSON.stringify({
  event_id: 42,
  type: "donation.created",
  live_mode: true,
  created: 1_719_825_600,
  data: { donation_id: "don-42", supporter_name: "  Zoé  ", is_anonymous: false },
});

describe("Buy Me a Coffee webhook helpers", () => {
  it("accepts only the matching HMAC signature", () => {
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    expect(verifyBuyMeACoffeeSignature(payload, secret, signature)).toBe(true);
    expect(verifyBuyMeACoffeeSignature(payload, secret, "00")).toBe(false);
  });

  it("extracts public donor details", () => {
    const event = parseBuyMeACoffeeEvent(payload);
    expect(event).not.toBeNull();
    expect(donationDetails(event!)).toEqual({
      providerDonationId: "don-42",
      donorName: "Zoé",
      isAnonymous: false,
    });
  });

  it("rejects malformed payloads", () => {
    expect(parseBuyMeACoffeeEvent("not json")).toBeNull();
    expect(parseBuyMeACoffeeEvent(JSON.stringify({ type: "donation.created" }))).toBeNull();
  });
});
