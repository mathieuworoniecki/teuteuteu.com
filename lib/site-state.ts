import "server-only";

import { getPreviewClicks } from "@/lib/preview-counter";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import type { Donor, SiteState } from "@/lib/types";

function previewState(): SiteState {
  return { clicks: getPreviewClicks(), donors: [], configured: false };
}

export async function getSiteState(): Promise<SiteState> {
  if (!isSupabaseConfigured()) return previewState();

  const supabase = getSupabaseAdmin();
  const [{ data: stats, error: statsError }, { data: donors, error: donorsError }] = await Promise.all([
    supabase.from("site_stats").select("total_clicks").eq("id", 1).single(),
    supabase
      .from("supporters")
      .select("id, display_name, received_at")
      .eq("is_visible", true)
      .order("received_at", { ascending: false })
      .limit(40),
  ]);

  if (statsError || donorsError) {
    console.error("Unable to read public site state", { statsError, donorsError });
    return previewState();
  }

  return {
    clicks: String(stats?.total_clicks ?? 0),
    donors: (donors ?? []).map(
      (donor): Donor => ({ id: donor.id, name: donor.display_name, receivedAt: donor.received_at }),
    ),
    configured: true,
  };
}
