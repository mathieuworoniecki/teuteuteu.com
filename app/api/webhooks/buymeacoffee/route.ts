import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { readUtf8Body } from "@/lib/request";
import { donationDetails, parseBuyMeACoffeeEvent, verifyBuyMeACoffeeSignature } from "@/lib/webhook";

export const runtime = "nodejs";
const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };
const MAX_WEBHOOK_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const secret = process.env.BUY_ME_A_COFFEE_WEBHOOK_SECRET?.trim();
  const rawBody = await readUtf8Body(request, MAX_WEBHOOK_BYTES);

  if (rawBody === null) {
    return Response.json({ error: "Webhook payload is too large." }, { headers: NO_STORE_HEADERS, status: 413 });
  }

  if (!secret || !verifyBuyMeACoffeeSignature(rawBody, secret, request.headers.get("x-signature-sha256"))) {
    return Response.json({ error: "Invalid webhook signature." }, { headers: NO_STORE_HEADERS, status: 401 });
  }

  const event = parseBuyMeACoffeeEvent(rawBody);
  if (!event) return Response.json({ error: "Invalid webhook payload." }, { headers: NO_STORE_HEADERS, status: 400 });
  if (!event.live_mode || !isSupabaseConfigured()) return Response.json({ received: true }, { headers: NO_STORE_HEADERS });

  const details = donationDetails(event);
  const supabase = getSupabaseAdmin();

  if (event.type === "donation.created") {
    if (details.isAnonymous || !details.donorName) return Response.json({ received: true }, { headers: NO_STORE_HEADERS });

    const { error } = await supabase.from("supporters").upsert(
      {
        event_id: String(event.event_id),
        provider_donation_id: details.providerDonationId,
        display_name: details.donorName,
        received_at: new Date(event.created * 1000).toISOString(),
        is_visible: true,
      },
      { onConflict: "event_id", ignoreDuplicates: true },
    );
    if (error) {
      console.error("Unable to store Buy Me a Coffee donor", error);
      return Response.json({ error: "Temporary storage failure." }, { headers: NO_STORE_HEADERS, status: 503 });
    }
  }

  if (event.type === "donation.refunded") {
    const { error } = await supabase
      .from("supporters")
      .update({ is_visible: false, refunded_at: new Date().toISOString() })
      .eq("provider_donation_id", details.providerDonationId);
    if (error) {
      console.error("Unable to hide refunded Buy Me a Coffee donor", error);
      return Response.json({ error: "Temporary storage failure." }, { headers: NO_STORE_HEADERS, status: 503 });
    }
  }

  return Response.json({ received: true }, { headers: NO_STORE_HEADERS });
}
