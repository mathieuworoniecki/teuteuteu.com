export type Donor = {
  id: string;
  name: string;
  receivedAt: string;
};

export type SiteState = {
  clicks: string;
  donors: Donor[];
  configured: boolean;
};

export type CounterState = Pick<SiteState, "clicks" | "configured"> & {
  updatedAt: string;
};

export type SupportersState = Pick<SiteState, "donors" | "configured">;
