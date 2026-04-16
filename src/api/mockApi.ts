import { capitalGainsResponse } from "../data/capitalGains";
import { holdingsResponse } from "../data/holdings";
import type { CapitalGains, Holding } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCapitalGains = async (): Promise<CapitalGains> => {
  await delay(650);
  return structuredClone(capitalGainsResponse.capitalGains);
};

export const fetchHoldings = async (): Promise<Holding[]> => {
  await delay(900);
  return structuredClone(holdingsResponse);
};