export type BillingPeriod = "month" | "year";

export type SupportCost = {
  name: "Vercel Pro" | "Supabase Free" | "Domain" | "Supabase Pro";
  price: "$0" | "$20" | "$25" | "€16";
  period: BillingPeriod;
  optional: boolean;
};

export const supportCosts = [
  { name: "Vercel Pro", price: "$20", period: "month", optional: false },
  { name: "Supabase Free", price: "$0", period: "month", optional: false },
  { name: "Domain", price: "€16", period: "year", optional: false },
  { name: "Supabase Pro", price: "$25", period: "month", optional: true },
] as const satisfies readonly SupportCost[];

export const currentCostSummary = "$20 / month + €16 / year";
export const SUPPORT_URL = "https://buymeacoffee.com/alzok";
