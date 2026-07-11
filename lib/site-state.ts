import "server-only";

import { getPreviewClicks } from "@/lib/preview-counter";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/server";
import type { CounterState, Donor, SiteState, SupportersState } from "@/lib/types";

export function previewCounterState(): CounterState {
  return { clicks: getPreviewClicks(), configured: false, updatedAt: new Date().toISOString() };
}

export function previewSupportersState(): SupportersState {
  return { donors: [], configured: false };
}

export async function getCounterState(): Promise<CounterState> {
  if (!isSupabaseConfigured()) return previewCounterState();

  const supabase = getSupabaseAdmin();
  const { data: stats, error } = await supabase
    .from("site_stats")
    .select("total_clicks, updated_at")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Unable to read public click counter", error);
    return previewCounterState();
  }

  return {
    clicks: String(stats?.total_clicks ?? 0),
    configured: true,
    updatedAt: stats?.updated_at ?? new Date().toISOString(),
  };
}

export async function getSupportersState(): Promise<SupportersState> {
  if (!isSupabaseConfigured()) return previewSupportersState();

  const supabase = getSupabaseAdmin();
  const { data: donors, error } = await supabase
    .from("supporters")
    .select("id, display_name, received_at")
    .eq("is_visible", true)
    .order("received_at", { ascending: false })
    .limit(40);

  if (error) {
    console.error("Unable to read public supporters", error);
    return previewSupportersState();
  }

  return {
    donors: (donors ?? []).map(
      (donor): Donor => ({ id: donor.id, name: donor.display_name, receivedAt: donor.received_at }),
    ),
    configured: true,
  };
}

export async function getSiteState(): Promise<SiteState> {
  const [counter, supporters] = await Promise.all([getCounterState(), getSupportersState()]);
  return {
    clicks: counter.clicks,
    donors: supporters.donors,
    configured: counter.configured && supporters.configured,
  };
}
