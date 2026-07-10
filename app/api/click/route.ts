import crypto from "node:crypto";

import { incrementPreviewClicks } from "@/lib/preview-counter";
import { readUtf8Body } from "@/lib/request";
import { getSiteState } from "@/lib/site-state";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

function isSameSiteOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return Boolean(requestHost) && new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

function visitorHash(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const secret = process.env.CLICK_RATE_LIMIT_SECRET?.trim() || "development-only-click-limit";
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

export async function POST(request: Request) {
  if (!isSameSiteOrigin(request)) {
    return Response.json({ error: "Forbidden origin." }, { headers: NO_STORE_HEADERS, status: 403 });
  }
  if ((await readUtf8Body(request, 0)) === null) {
    return Response.json({ error: "Request body is not allowed." }, { headers: NO_STORE_HEADERS, status: 413 });
  }

  if (process.env.CLICK_COUNTER_ENABLED?.trim().toLowerCase() === "false") {
    const state = await getSiteState();
    return Response.json({ clicks: state.clicks, limited: true, readOnly: true }, { headers: NO_STORE_HEADERS });
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      { clicks: incrementPreviewClicks(), limited: false, configured: false },
      { headers: NO_STORE_HEADERS },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("increment_teuteuteu_click", {
    p_visitor_hash: visitorHash(request),
  });

  if (error) {
    console.error("Unable to increment global click counter", error);
    return Response.json(
      { error: "Counter is temporarily unavailable." },
      { headers: NO_STORE_HEADERS, status: 503 },
    );
  }

  const result = Array.isArray(data) ? data[0] : data;
  return Response.json(
    { clicks: String(result?.total_clicks ?? 0), limited: Boolean(result?.limited) },
    { headers: NO_STORE_HEADERS },
  );
}
