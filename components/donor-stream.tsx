import type { Donor } from "@/lib/types";

type DonorStreamProps = { donors: Donor[] };

export function DonorStream({ donors }: DonorStreamProps) {
  if (donors.length === 0) return null;

  const loop = [...donors, ...donors];

  return (
    <aside className="donor-stream" aria-label="Donateurs">
      <ul className="donor-stream__track">
        {loop.map((donor, index) => (
          <li aria-hidden={index >= donors.length} key={`${donor.id}-${index}`}>
            {donor.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
