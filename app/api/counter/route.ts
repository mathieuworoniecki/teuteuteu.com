import { getCounterState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getCounterState(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=2, stale-while-revalidate=8",
      "Vercel-CDN-Cache-Control": "public, s-maxage=2, stale-while-revalidate=8",
    },
  });
}
