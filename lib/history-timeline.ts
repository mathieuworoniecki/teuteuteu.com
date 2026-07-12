export type HistoryStatus = "confirmed" | "lead" | "context";
export type HistoryPeriod =
  "origins" | "viral" | "parking" | "blog" | "restoration";

export type HistoryEvent = {
  id: string;
  period: HistoryPeriod;
  status: HistoryStatus;
  dateLabel: string;
  dateTime?: string;
  title: string;
  evidence: readonly string[];
  sourceKeys: readonly (keyof typeof HISTORY_SOURCES)[];
  open?: boolean;
};

export const HISTORY_SOURCES = {
  bouletSwf: {
    label: "boulet.swf — Wayback",
    url: "https://web.archive.org/web/20060117124350id_/http://premierecompagnie.free.fr/boulet.swf",
    captured: "2006-01-17 12:43:50 UTC",
  },
  tuningo2005: {
    label: "Tuningo — Wayback",
    url: "https://web.archive.org/web/20050203215253id_/http://www.tuningo.com/",
    captured: "2005-02-03 21:52:53 UTC",
  },
  repondeur2005: {
    label: "Répondeur Téléphonique — Wayback",
    url: "https://web.archive.org/web/20050315004945id_/http://www.repondeurtelephonique.com/",
    captured: "2005-03-15 00:49:45 UTC",
  },
  originalSwf: {
    label: "www.teuteuteu.com.swf — Wayback",
    url: "https://web.archive.org/web/20060213195447id_/http://premierecompagnie.free.fr/www.teuteuteu.com.swf",
    captured: "2006-02-13 19:54:47 UTC",
  },
  frogSwf: {
    label: "www.lagrenouillefolle.com.swf — Wayback",
    url: "https://web.archive.org/web/20070226031747id_/http://premierecompagnie.free.fr/www.lagrenouillefolle.com.swf",
    captured: "2007-02-26 03:17:47 UTC",
  },
  archive2005: {
    label: "teuteuteu.com — Wayback",
    url: "https://web.archive.org/web/20050613235831id_/http://teuteuteu.com/",
    captured: "2005-06-13 23:58:31 UTC",
  },
  archive2006April: {
    label: "teuteuteu.com — Wayback",
    url: "https://web.archive.org/web/20060402222150id_/http://teuteuteu.com/",
    captured: "2006-04-02 22:21:50 UTC",
  },
  archive2006June: {
    label: "teuteuteu.com — Wayback",
    url: "https://web.archive.org/web/20060610164453id_/http://teuteuteu.com/",
    captured: "2006-06-10 16:44:53 UTC",
  },
  pcAstuces2006: {
    label: "PC Astuces",
    url: "https://forum.pcastuces.com/teuteuteu-f5s19492.htm?rep=1678040",
    captured: "2006-04-24",
  },
  ubuntu2006: {
    label: "Ubuntu-fr",
    url: "https://forum.ubuntu-fr.org/viewtopic.php?pid=285537",
    captured: "2006-05-05",
  },
  macUser2006: {
    label: "MacUser",
    url: "https://www.macuser.de/threads/wie-geht-das.183952/",
    captured: "2006-07-03",
  },
  gamekult2007: {
    label: "Gamekult",
    url: "https://www.gamekult.com/forum/t/teu-teu-teu-teuteuteu-teuteu/171639",
    captured: "2007-12-23",
  },
  freeInventory: {
    label: "premierecompagnie.free.fr — CDX",
    url: "https://web.archive.org/cdx/search/cdx?url=premierecompagnie.free.fr/*&output=json&fl=timestamp,original,statuscode,mimetype&filter=statuscode:200&collapse=urlkey",
    captured: "Internet Archive index",
  },
  parking2010: {
    label: "GoDaddy parking — Wayback",
    url: "https://web.archive.org/web/20100601235742id_/http://www.teuteuteu.com/",
    captured: "2010-06-01 23:57:42 UTC",
  },
  parking2012: {
    label: "GoDaddy parking — Wayback",
    url: "https://web.archive.org/web/20120622211004id_/http://www.teuteuteu.com/",
    captured: "2012-06-22 21:10:04 UTC",
  },
  parking2014: {
    label: "GoDaddy parking — Wayback",
    url: "https://web.archive.org/web/20140902084309id_/http://www.teuteuteu.com/",
    captured: "2014-09-02 08:43:09 UTC",
  },
  tomware2011: {
    label: "tomware — Hardware.fr",
    url: "https://forum.hardware.fr/hfr/Discussions/Viepratique/supers-bonnes-affaires-sujet_76038_1242.htm",
    captured: "2011-04-08",
  },
  tomware2012: {
    label: "tomware — Hardware.fr",
    url: "https://forum.hardware.fr/hfr/Discussions/Sports/bodybuilding-nouveau-olympia-sujet_6747_5268.htm",
    captured: "2012-01-31",
  },
  whoisHistory: {
    label: "Who.is Domain History",
    url: "https://who.is/history/teuteuteu.com",
    captured: "Snapshot: 2023-12-31 18:28:32 UTC",
  },
  legal2021: {
    label: "Archived legal notice",
    url: "https://web.archive.org/web/20210802192657id_/https://teuteuteu.com/mentions-legales/",
    captured: "2021-08-02 19:26:57 UTC",
  },
  rdap2026: {
    label: "Verisign RDAP",
    url: "https://rdap.verisign.com/com/v1/domain/teuteuteu.com",
    captured: "Registry record",
  },
} as const;

export const EARLIEST_DOCUMENTED_DATE = "2005-06-13";
export const RESTORATION_DATE = "2026-07-10";

export const HISTORY_EVENTS: readonly HistoryEvent[] = [
  {
    id: "2005-free-account",
    period: "origins",
    status: "context",
    dateLabel: "21 Jan 2005",
    dateTime: "2005-01-21",
    title: "boulet.swf · premierecompagnie.free.fr",
    evidence: [
      "Last-Modified: Fri, 21 Jan 2005 09:15:13 GMT",
      "Flash 6 · 800 × 600 · 12 fps",
    ],
    sourceKeys: ["bouletSwf"],
  },
  {
    id: "2005-mobile-ecosystem",
    period: "origins",
    status: "context",
    dateLabel: "3 Feb – 15 Mar 2005",
    title: "Tuningo · Répondeur Téléphonique · Magikmobile",
    evidence: ["Extreme-DM: soneries", "repondeurtelephonique.magikmobile.com"],
    sourceKeys: ["tuningo2005", "repondeur2005"],
  },
  {
    id: "2005-swf",
    period: "origins",
    status: "confirmed",
    dateLabel: "7 May 2005",
    dateTime: "2005-05-07",
    title: "www.teuteuteu.com.swf",
    evidence: [
      "Last-Modified: Sat, 07 May 2005 09:31:01 GMT",
      "SHA-256: 74da8efc7fa5f64b1f038863fb097ea7d1dca13942b1e0ad90c68b9d376068b5",
      "Flash 6 · 550 × 400 · 60 fps · 4,494 frames · 166 shake calls",
      "MP3 · 44.1 kHz · stereo · 128 kbit/s",
    ],
    sourceKeys: ["originalSwf"],
    open: true,
  },
  {
    id: "2005-frog-swf",
    period: "origins",
    status: "context",
    dateLabel: "30 May 2005",
    dateTime: "2005-05-30",
    title: "www.lagrenouillefolle.com.swf",
    evidence: [
      "Last-Modified: Mon, 30 May 2005 10:29:46 GMT",
      "Flash 6 · 400 × 300 · 12 fps · 2,061 frames",
    ],
    sourceKeys: ["frogSwf"],
  },
  {
    id: "2005-html",
    period: "origins",
    status: "confirmed",
    dateLabel: "9 Jun 2005",
    dateTime: "2005-06-09",
    title: "teuteuteu.com · HTML + JavaScript",
    evidence: [
      "Last-Modified: Thu, 09 Jun 2005 21:43:40 GMT",
      "shake_xy · shake_x · shake_y",
      "Extreme-DM: tututete",
      "Pop-under: tuningo.com",
    ],
    sourceKeys: ["archive2005"],
    open: true,
  },
  {
    id: "2005-first-capture",
    period: "origins",
    status: "confirmed",
    dateLabel: "13 Jun 2005",
    dateTime: EARLIEST_DOCUMENTED_DATE,
    title: "Earliest surviving public capture",
    evidence: [
      "Memento-Datetime: Mon, 13 Jun 2005 23:58:31 GMT",
      "HTTP 200 · text/html",
      "SWF host: premierecompagnie.free.fr",
    ],
    sourceKeys: ["archive2005"],
    open: true,
  },
  {
    id: "2006-commercial-removal",
    period: "viral",
    status: "confirmed",
    dateLabel: "Mar – May 2006",
    title: "Tuningo → removed · Répondeur Téléphonique → removed",
    evidence: [
      "14 Mar 2006: Tuningo pop-under absent",
      "13 May 2006: Répondeur Téléphonique link absent",
      "Core SWF experience preserved",
    ],
    sourceKeys: ["archive2006April", "archive2006June"],
  },
  {
    id: "2006-viral-circulation",
    period: "viral",
    status: "context",
    dateLabel: "2006–2007",
    title: "Contemporary forum circulation",
    evidence: [
      "Music identified as Scooter — Maria (I Like It Loud)",
      "Window shaking discussed as Flash + JavaScript",
    ],
    sourceKeys: ["pcAstuces2006", "ubuntu2006", "macUser2006", "gamekult2007"],
  },
  {
    id: "2008-games",
    period: "viral",
    status: "context",
    dateLabel: "Nov 2008",
    dateTime: "2008-11",
    title: "premierecompagnie.free.fr/jeux/",
    evidence: [
      "Dozens of archived SWF and Adobe Director files",
      "Collection evidence, not an author portfolio",
    ],
    sourceKeys: ["freeInventory"],
  },
  {
    id: "2010-parking",
    period: "parking",
    status: "confirmed",
    dateLabel: "2010–2014",
    title: "GoDaddy domain parking",
    evidence: [
      "2010: parked page",
      "2012: parked page + domain sale prompt",
      "2014: mcc.godaddy.com parking infrastructure",
    ],
    sourceKeys: ["parking2010", "parking2012", "parking2014"],
  },
  {
    id: "2011-tomware",
    period: "parking",
    status: "lead",
    dateLabel: "2011–2012",
    title: "tomware → premierecompagnie.free.fr",
    evidence: [
      "2011: first-person desk photos hosted on the Free.fr account",
      "2012: personal image hosted on the same account",
      "Hardware.fr account registered 21 Apr 2004",
      "Later access does not establish 2005 authorship",
    ],
    sourceKeys: ["tomware2011", "tomware2012"],
  },
  {
    id: "2020-registration",
    period: "blog",
    status: "confirmed",
    dateLabel: "7 Dec 2020",
    dateTime: "2020-12-07",
    title: "New registry cycle",
    evidence: [
      "Created: 2020-12-07T09:52:13Z",
      "Registrar: Internet Domain Service BS Corp. · IANA 2487",
      "Nameservers: ns1.ibspark.com · ns2.ibspark.com",
    ],
    sourceKeys: ["whoisHistory"],
  },
  {
    id: "2021-blog",
    period: "blog",
    status: "confirmed",
    dateLabel: "2021–2023",
    title: "Unrelated French editorial blog",
    evidence: [
      "Publisher: Pig Web · RCS Évreux 848 781 845",
      "Host named in legal notice: OVH",
      "Publisher does not prove domain ownership",
    ],
    sourceKeys: ["legal2021"],
  },
  {
    id: "2023-whois",
    period: "blog",
    status: "confirmed",
    dateLabel: "31 Dec 2023",
    dateTime: "2023-12-31",
    title: "Privacy-protected WHOIS snapshot",
    evidence: [
      "Registrant proxy: Whois Privacy Corp.",
      "Updated: 2023-12-08T11:14:41Z",
      "Expires: 2024-12-07T09:52:13Z",
      "DNSSEC: unsigned",
    ],
    sourceKeys: ["whoisHistory"],
  },
  {
    id: "2026-registration",
    period: "restoration",
    status: "confirmed",
    dateLabel: "10 Jul 2026",
    dateTime: RESTORATION_DATE,
    title: "New Verisign registry cycle",
    evidence: [
      "Registration: 2026-07-10T09:36:01Z",
      "Registrar: Tucows Domains Inc.",
      "DNS: Vercel",
    ],
    sourceKeys: ["rdap2026"],
  },
  {
    id: "2026-restoration",
    period: "restoration",
    status: "confirmed",
    dateLabel: "Jul 2026",
    dateTime: RESTORATION_DATE,
    title: "Modern preservation",
    evidence: [
      "Next.js · React · Web Audio",
      "Original button assets, audio and 166-event shake sequence",
      "Accessibility · 51 locales · global counter · supporter stream",
    ],
    sourceKeys: ["archive2005", "originalSwf", "rdap2026"],
  },
] as const;
