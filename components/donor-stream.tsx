"use client";

import { useCallback, useEffect, useState } from "react";

import type { Donor } from "@/lib/types";
import type { SupportersState } from "@/lib/types";

type DonorStreamProps = { donors: Donor[]; label: string };

export function DonorStream({ donors, label }: DonorStreamProps) {
  const [currentDonors, setCurrentDonors] = useState(donors);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/supporters");
      if (!response.ok) return;
      const state = (await response.json()) as SupportersState;
      setCurrentDonors(state.donors);
    } catch {
      // Keep the latest supporter list when the network is temporarily unavailable.
    }
  }, []);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = window.setInterval(refreshWhenVisible, 60_000);
    const initialTimer = window.setTimeout(refresh, 0);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initialTimer);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refresh]);

  if (currentDonors.length === 0) return null;

  const loop = [...currentDonors, ...currentDonors];

  return (
    <aside className="donor-stream" aria-label={label}>
      <ul className="donor-stream__track">
        {loop.map((donor, index) => (
          <li aria-hidden={index >= currentDonors.length} key={`${donor.id}-${index}`}>
            {donor.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
