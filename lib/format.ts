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

export function maxClicks(first: ClickValue, second: ClickValue): string {
  const left = clickBigInt(first);
  const right = clickBigInt(second);
  return (left > right ? left : right).toString();
}

export function formatClicks(value: ClickValue, locale = "en"): string {
  return new Intl.NumberFormat(locale).format(clickBigInt(value));
}

export function formatClicksDisplay(value: ClickValue, locale = "en"): string {
  const clicks = clickBigInt(value);
  if (clicks < 1_000_000_000n) return new Intl.NumberFormat(locale).format(clicks);
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(clicks);
}

export function normaliseDonorName(value: string): string | null {
  const name = value.replace(/\s+/g, " ").trim().slice(0, 64);
  return name.length > 0 ? name : null;
}
