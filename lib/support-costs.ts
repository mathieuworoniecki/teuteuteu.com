export type BillingPeriod = "month" | "year";

export type SupportCost = {
  name: "Vercel Pro" | "Domain" | "Supabase Pro";
  price: "$20" | "$25+" | "€16";
  period: BillingPeriod;
  optional: boolean;
};

export const supportCosts = [
  { name: "Vercel Pro", price: "$20", period: "month", optional: false },
  { name: "Domain", price: "€16", period: "year", optional: false },
  { name: "Supabase Pro", price: "$25+", period: "month", optional: false },
] as const satisfies readonly SupportCost[];

export const currentCostSummary = "$45+ / month + €16 / year";
export const SUPPORT_URL = "https://buymeacoffee.com/alzok";
