import { historySourceLedger } from "@/lib/history-source-ledger";

export const dynamic = "force-static";

export function GET() {
  return Response.json(historySourceLedger(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Vercel-CDN-Cache-Control": "public, max-age=86400",
    },
  });
}
