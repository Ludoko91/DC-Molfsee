export type RackConfig = {
  id: string;
  name: string;
  neededUnits: number;
  powerKw: number;
};

export type RackSummary = {
  usedU: number;
  freeU: number;
  powerKw: number;
  uUtilizationPercent: number;
  pricing: PriceQuote;
};

export type PricingTier = "perU" | "half" | "full";

export type PriceQuote = {
  amountEur: number;
  tier: PricingTier;
};

export const RACK_HEIGHT_U = 47;
export const HALF_RACK_UNITS = 24;
export const FULL_RACK_PRICE_EUR = 350;
export const HALF_RACK_PRICE_EUR = 225;
export const PER_U_PRICE_EUR = 12;
export const SLOT_HEIGHT_PX = 11;
export const DEFAULT_NEEDED_UNITS = 10;
export const DEFAULT_POWER_KW = 5;
export const MIN_NEEDED_UNITS = 1;
export const MAX_NEEDED_UNITS = 47;
export const MIN_POWER_KW = 0.5;
export const MAX_POWER_KW = 20;
