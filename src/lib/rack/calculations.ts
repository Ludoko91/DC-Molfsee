import {
  DEFAULT_NEEDED_UNITS,
  DEFAULT_POWER_KW,
  FULL_RACK_PRICE_EUR,
  HALF_RACK_PRICE_EUR,
  HALF_RACK_UNITS,
  PER_U_PRICE_EUR,
  RACK_HEIGHT_U,
  type PriceQuote,
  type RackConfig,
  type RackSummary,
} from "./types";
import { generateId } from "../utils";

/** Cheapest pricing tier that covers the requested units. */
export function calculatePrice(neededUnits: number): PriceQuote {
  const options: PriceQuote[] = [
    { amountEur: neededUnits * PER_U_PRICE_EUR, tier: "perU" },
  ];

  if (neededUnits <= HALF_RACK_UNITS) {
    options.push({ amountEur: HALF_RACK_PRICE_EUR, tier: "half" });
  }

  if (neededUnits <= RACK_HEIGHT_U) {
    options.push({ amountEur: FULL_RACK_PRICE_EUR, tier: "full" });
  }

  return options.reduce((best, option) =>
    option.amountEur < best.amountEur ? option : best,
  );
}

/** Bottom U position where allocated space starts, centered in the rack. */
export function getAllocatedStartU(neededUnits: number): number {
  return Math.floor((RACK_HEIGHT_U - neededUnits) / 2) + 1;
}

export function getOccupiedUnits(rack: RackConfig): Set<number> {
  const occupied = new Set<number>();
  const startU = getAllocatedStartU(rack.neededUnits);
  for (let u = startU; u < startU + rack.neededUnits; u++) {
    occupied.add(u);
  }
  return occupied;
}

export function calculateRackSummary(rack: RackConfig): RackSummary {
  const usedU = rack.neededUnits;
  const freeU = RACK_HEIGHT_U - usedU;

  return {
    usedU,
    freeU,
    powerKw: rack.powerKw,
    uUtilizationPercent:
      RACK_HEIGHT_U > 0 ? Math.round((usedU / RACK_HEIGHT_U) * 100) : 0,
    pricing: calculatePrice(usedU),
  };
}

export function createDefaultRack(index: number): RackConfig {
  return {
    id: generateId(),
    name: `Rack ${index}`,
    neededUnits: DEFAULT_NEEDED_UNITS,
    powerKw: DEFAULT_POWER_KW,
  };
}

export function createInitialState(): { racks: RackConfig[]; activeRackId: string } {
  const rack = createDefaultRack(1);
  return {
    racks: [rack],
    activeRackId: rack.id,
  };
}

export function createDefaultRackValues(): Pick<RackConfig, "neededUnits" | "powerKw"> {
  return {
    neededUnits: DEFAULT_NEEDED_UNITS,
    powerKw: DEFAULT_POWER_KW,
  };
}
