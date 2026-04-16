export type GainBucket = {
  balance: number;
  gain: number;
};

export type Holding = {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainBucket;
  ltcg: GainBucket;
};

export type CapitalGainSplit = {
  profits: number;
  losses: number;
};

export type CapitalGains = {
  stcg: CapitalGainSplit;
  ltcg: CapitalGainSplit;
};