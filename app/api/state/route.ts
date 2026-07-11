import { getSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  // Compatibility endpoint for service workers and clients deployed before the
  // counter/supporter reads were split. Both loaders are independently cheap.
  const state = await getSiteState();
  return Response.json(state, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Vercel-CDN-Cache-Control": "public, max-age=2, stale-while-revalidate=8",
    },
  });
}
