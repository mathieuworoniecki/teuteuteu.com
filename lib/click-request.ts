export function isAllowedClickOrigin(request: Request, production = process.env.NODE_ENV === "production"): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return !production;

  try {
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const fetchSite = request.headers.get("sec-fetch-site");
    return (
      Boolean(requestHost) &&
      new URL(origin).host === requestHost &&
      (!fetchSite || fetchSite === "same-origin" || fetchSite === "same-site")
    );
  } catch {
    return false;
  }
}
