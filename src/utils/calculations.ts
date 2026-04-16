import type { CapitalGains, Holding } from "../types";

export const getNetGain = (split: { profits: number; losses: number }): number =>
  split.profits - split.losses;

export const getRealisedGains = (gains: CapitalGains): number =>
  getNetGain(gains.stcg) + getNetGain(gains.ltcg);

const applyGainToSplit = (
  split: { profits: number; losses: number },
  gain: number
): { profits: number; losses: number } => {
  if (gain >= 0) {
    return { ...split, profits: split.profits + gain };
  }

  return { ...split, losses: split.losses + Math.abs(gain) };
};

export const calculateHarvestedGains = (
  baseGains: CapitalGains,
  selectedHoldings: Holding[]
): CapitalGains => {
  return selectedHoldings.reduce<CapitalGains>((acc, holding) => {
    const updatedStcg = applyGainToSplit(acc.stcg, holding.stcg.gain);
    const updatedLtcg = applyGainToSplit(acc.ltcg, holding.ltcg.gain);

    return {
      stcg: updatedStcg,
      ltcg: updatedLtcg
    };
  }, structuredClone(baseGains));
};