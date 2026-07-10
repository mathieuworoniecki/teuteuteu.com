type ClickValue = string | number | bigint;

function clickBigInt(value: ClickValue): bigint {
  try {
    const parsed = BigInt(value);
    return parsed < 0n ? 0n : parsed;
  } catch {
    return 0n;
  }
}

export function incrementClicks(value: ClickValue): string {
  return (clickBigInt(value) + 1n).toString();
}

export function formatClicks(value: ClickValue): string {
  return new Intl.NumberFormat("fr-FR").format(clickBigInt(value));
}

export function formatClicksDisplay(value: ClickValue): string {
  const clicks = clickBigInt(value);
  if (clicks < 1_000_000_000n) return new Intl.NumberFormat("fr-FR").format(clicks);
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(clicks);
}

export function normaliseDonorName(value: string): string | null {
  const name = value.replace(/\s+/g, " ").trim().slice(0, 64);
  return name.length > 0 ? name : null;
}
