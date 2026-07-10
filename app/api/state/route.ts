import { getSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getSiteState();
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}
