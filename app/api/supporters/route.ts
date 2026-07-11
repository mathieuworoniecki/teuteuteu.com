import { getSupportersState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getSupportersState(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Vercel-CDN-Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
