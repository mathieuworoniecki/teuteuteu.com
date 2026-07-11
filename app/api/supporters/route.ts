import { getSupportersState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getSupportersState(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      "Vercel-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
