import { DonorStream } from "@/components/donor-stream";
import { PwaRegistrar } from "@/components/pwa-registrar";
import { TeuteuteuMachine } from "@/components/teuteuteu-machine";
import { getSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialState = await getSiteState();

  return (
    <main className="site-shell">
      <DonorStream donors={initialState.donors} />
      <TeuteuteuMachine initialState={initialState} />
      <PwaRegistrar />
    </main>
  );
}
