import "server-only";

type PreviewGlobal = typeof globalThis & {
  __teuteuteuPreviewClicks?: number | string | bigint;
};

const previewGlobal = globalThis as PreviewGlobal;

function currentPreviewClicks(): bigint {
  try {
    return BigInt(previewGlobal.__teuteuteuPreviewClicks ?? 0);
  } catch {
    return 0n;
  }
}

export function getPreviewClicks(): string {
  return currentPreviewClicks().toString();
}

export function incrementPreviewClicks(): string {
  const next = currentPreviewClicks() + 1n;
  previewGlobal.__teuteuteuPreviewClicks = next;
  return next.toString();
}
