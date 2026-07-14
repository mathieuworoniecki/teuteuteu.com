import { readFile } from "node:fs/promises";

const changedFilePath = process.argv[2];
const key = process.env.INDEXNOW_KEY?.trim();
const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.teuteuteu.com",
);

if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  console.log("IndexNow skipped: INDEXNOW_KEY is not configured.");
  process.exit(0);
}

if (!changedFilePath) {
  throw new Error(
    "Usage: node scripts/notify-indexnow.mjs <changed-files.txt>",
  );
}

const changedFiles = (await readFile(changedFilePath, "utf8"))
  .split(/\r?\n/)
  .map((file) => file.trim())
  .filter(Boolean);

let homeChanged = false;
let historyChanged = false;

for (const file of changedFiles) {
  if (
    /^(app\/(globals\.css|layout\.tsx|robots\.ts|sitemap\.ts|api\/og\/)|lib\/(i18n|seo)\.ts|next\.config\.ts|public\/(icon|manifest|sw\.js))/.test(
      file,
    )
  ) {
    homeChanged = true;
    historyChanged = true;
  } else if (/history|history-sources|llms\.txt/.test(file)) {
    historyChanged = true;
  } else if (
    /^(app\/(page|\[locale\]\/page)|components\/(home|teuteuteu|donor|support)|lib\/(support|format))/.test(
      file,
    )
  ) {
    homeChanged = true;
  } else if (/^(app|components|lib|public)\//.test(file)) {
    homeChanged = true;
    historyChanged = true;
  }
}

if (!homeChanged && !historyChanged) {
  console.log("IndexNow skipped: no public editorial URL changed.");
  process.exit(0);
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", siteUrl), {
  headers: { "User-Agent": "teuteuteu.com IndexNow deployment notifier" },
});
if (!sitemapResponse.ok) {
  throw new Error(`Unable to read sitemap: HTTP ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
  match[1]
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">"),
).filter((url) => {
  const pathname = new URL(url).pathname;
  if (pathname.endsWith("/history")) return historyChanged;
  return homeChanged;
});

const uniqueUrls = [...new Set(urls)];
if (uniqueUrls.length === 0) {
  console.log("IndexNow skipped: sitemap selection returned no URLs.");
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: siteUrl.host,
    key,
    keyLocation: new URL("/indexnow-key", siteUrl).toString(),
    urlList: uniqueUrls,
  }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(
    `IndexNow rejected the notification: HTTP ${response.status}`,
  );
}

console.log(
  `IndexNow accepted ${uniqueUrls.length} URL(s) after ${changedFiles.length} changed file(s).`,
);
