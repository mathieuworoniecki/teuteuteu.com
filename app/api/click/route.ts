import crypto from "node:crypto";

import { incrementPreviewClicks } from "@/lib/preview-counter";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

function visitorHash(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const secret = process.env.CLICK_RATE_LIMIT_SECRET?.trim() || "development-only-click-limit";
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json({ clicks: incrementPreviewClicks(), limited: false, configured: false });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("increment_teuteuteu_click", {
    p_visitor_hash: visitorHash(request),
  });

  if (error) {
    console.error("Unable to increment global click counter", error);
    return Response.json({ error: "Counter is temporarily unavailable." }, { status: 503 });
  }

  const result = Array.isArray(data) ? data[0] : data;
  return Response.json({ clicks: String(result?.total_clicks ?? 0), limited: Boolean(result?.limited) });
}
