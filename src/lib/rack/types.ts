export type RackConfig = {
  id: string;
  name: string;
  neededUnits: number;
  maxPowerKw: number;
  powerFeeds: number;
};

export type RackSummary = {
  usedU: number;
  freeU: number;
  maxPowerKw: number;
  powerFeeds: number;
  feedsCostEur: number;
  uUtilizationPercent: number;
  pricing: PriceQuote;
  totalMonthlyEur: number;
};

export type PricingTier = "perU" | "half" | "full";

export type PriceQuote = {
  amountEur: number;
  tier: PricingTier;
};

export type RackPriceLine = {
  id: string;
  name: string;
  rackCostEur: number;
  feedsCostEur: number;
  totalMonthlyEur: number;
};

export type TotalSummary = {
  rackCount: number;
  totalRackCostEur: number;
  totalFeedsCostEur: number;
  totalMonthlyEur: number;
  racks: RackPriceLine[];
};

export const RACK_HEIGHT_U = 47;
export const HALF_RACK_UNITS = 24;
export const QUARTER_RACK_UNITS = Math.round(RACK_HEIGHT_U / 4);
export const EIGHTH_RACK_UNITS = Math.round(RACK_HEIGHT_U / 8);
export const THREE_QUARTER_RACK_UNITS = Math.round((RACK_HEIGHT_U * 3) / 4);

export const RACK_SIZE_PRESET_UNITS = [
  1,
  2,
  4,
  EIGHTH_RACK_UNITS,
  QUARTER_RACK_UNITS,
  HALF_RACK_UNITS,
  THREE_QUARTER_RACK_UNITS,
  RACK_HEIGHT_U,
] as const;
export const FULL_RACK_PRICE_EUR = 300;
export const HALF_RACK_PRICE_EUR = 180;
export const PER_U_PRICE_EUR = 12;
export const POWER_FEED_KW = 3.5;
export const POWER_FEED_EXTRA_PRICE_EUR = 200;
export const SLOT_HEIGHT_PX = 14;
export const DEFAULT_NEEDED_UNITS = 10;
export const DEFAULT_MAX_POWER_KW = 5;
export const DEFAULT_POWER_FEEDS = 2;
export const MIN_NEEDED_UNITS = 1;
export const MAX_NEEDED_UNITS = 47;
export const MIN_MAX_POWER_KW = 0.5;
export const MAX_MAX_POWER_KW = 20;
export const MAX_RACKS = 5;

export function isRackFull(rack: RackConfig): boolean {
  return rack.neededUnits >= RACK_HEIGHT_U;
}

export function canAddRack(racks: RackConfig[]): boolean {
  return racks.length < MAX_RACKS && racks.every(isRackFull);
}

export function canConfigureRack(racks: RackConfig[], rackId: string): boolean {
  const index = racks.findIndex((r) => r.id === rackId);
  if (index <= 0) return true;
  return racks.slice(0, index).every(isRackFull);
}

export function getRackIndex(racks: RackConfig[], rackId: string): number {
  return racks.findIndex((r) => r.id === rackId);
}
