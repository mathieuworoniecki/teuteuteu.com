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
