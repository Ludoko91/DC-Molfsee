export type RackConfig = {
  id: string;
  name: string;
  neededUnits: number;
  maxPowerKw: number;
  totalPowerKwh: number;
};

export type RackSummary = {
  usedU: number;
  freeU: number;
  maxPowerKw: number;
  totalPowerKwh: number;
  powerCostEur: number;
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
  powerCostEur: number;
  totalMonthlyEur: number;
};

export type TotalSummary = {
  rackCount: number;
  totalRackCostEur: number;
  totalPowerCostEur: number;
  totalPowerKwh: number;
  totalMonthlyEur: number;
  racks: RackPriceLine[];
};

export const RACK_HEIGHT_U = 47;
export const HALF_RACK_UNITS = 24;
export const FULL_RACK_PRICE_EUR = 300;
export const HALF_RACK_PRICE_EUR = 180;
export const PER_U_PRICE_EUR = 12;
export const POWER_PRICE_EUR_PER_KWH = 0.33;
export const SLOT_HEIGHT_PX = 14;
export const DEFAULT_NEEDED_UNITS = 10;
export const DEFAULT_MAX_POWER_KW = 5;
export const DEFAULT_TOTAL_POWER_KWH = 500;
export const MIN_NEEDED_UNITS = 1;
export const MAX_NEEDED_UNITS = 47;
export const MIN_MAX_POWER_KW = 0.5;
export const MAX_MAX_POWER_KW = 20;
export const MIN_TOTAL_POWER_KWH = 0;
export const MAX_TOTAL_POWER_KWH = 5000;
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
