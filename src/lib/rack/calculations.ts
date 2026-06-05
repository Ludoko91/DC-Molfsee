import {
  canAddRack,
  canConfigureRack,
  DEFAULT_MAX_POWER_KW,
  DEFAULT_NEEDED_UNITS,
  DEFAULT_POWER_FEEDS,
  FULL_RACK_PRICE_EUR,
  HALF_RACK_PRICE_EUR,
  HALF_RACK_UNITS,
  isRackFull,
  PER_U_PRICE_EUR,
  POWER_FEED_EXTRA_PRICE_EUR,
  POWER_FEED_KW,
  RACK_HEIGHT_U,
  type PriceQuote,
  type RackConfig,
  type RackSummary,
  type TotalSummary,
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

export function getRequiredPowerFeeds(maxPowerKw: number): number {
  return Math.max(1, Math.ceil(maxPowerKw / POWER_FEED_KW));
}

export function calculateFeedsCost(powerFeeds: number): number {
  return Math.max(0, powerFeeds - 1) * POWER_FEED_EXTRA_PRICE_EUR;
}

/** Bottom U position where allocated space starts, centered in the rack. */
export function getAllocatedStartU(neededUnits: number): number {
  return Math.floor((RACK_HEIGHT_U - neededUnits) / 2) + 1;
}

const EQUIPMENT_UNIT_SIZES = [4, 2, 1] as const;

/** Split needed rack units into visual equipment blocks of 4U, 2U, or 1U. */
export function decomposeNeededUnits(neededUnits: number): number[] {
  if (neededUnits <= 0) return [];

  const blocks: number[] = [];
  let remaining = neededUnits;

  while (remaining > 0) {
    const size = EQUIPMENT_UNIT_SIZES.find((s) => s <= remaining) ?? 1;
    blocks.push(size);
    remaining -= size;
  }

  return blocks;
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
  const pricing = calculatePrice(usedU);
  const feedsCostEur = calculateFeedsCost(rack.powerFeeds);
  const totalMonthlyEur = pricing.amountEur + feedsCostEur;

  return {
    usedU,
    freeU,
    maxPowerKw: rack.maxPowerKw,
    powerFeeds: rack.powerFeeds,
    feedsCostEur,
    uUtilizationPercent:
      RACK_HEIGHT_U > 0 ? Math.round((usedU / RACK_HEIGHT_U) * 100) : 0,
    pricing,
    totalMonthlyEur,
  };
}

export function createDefaultRack(index: number): RackConfig {
  const maxPowerKw = DEFAULT_MAX_POWER_KW;
  const requiredFeeds = getRequiredPowerFeeds(maxPowerKw);
  return {
    id: generateId(),
    name: `Rack ${index}`,
    neededUnits: DEFAULT_NEEDED_UNITS,
    maxPowerKw,
    powerFeeds: Math.max(requiredFeeds, DEFAULT_POWER_FEEDS),
  };
}

export function createInitialState(): { racks: RackConfig[]; activeRackId: string } {
  const rack = createDefaultRack(1);
  return {
    racks: [rack],
    activeRackId: rack.id,
  };
}

export function createDefaultRackValues(): Pick<
  RackConfig,
  "neededUnits" | "maxPowerKw" | "powerFeeds"
> {
  const maxPowerKw = DEFAULT_MAX_POWER_KW;
  const requiredFeeds = getRequiredPowerFeeds(maxPowerKw);
  return {
    neededUnits: DEFAULT_NEEDED_UNITS,
    maxPowerKw,
    powerFeeds: Math.max(requiredFeeds, DEFAULT_POWER_FEEDS),
  };
}

export function calculateTotalSummary(racks: RackConfig[]): TotalSummary {
  const lines = racks.map((rack) => {
    const summary = calculateRackSummary(rack);
    return {
      id: rack.id,
      name: rack.name,
      rackCostEur: summary.pricing.amountEur,
      feedsCostEur: summary.feedsCostEur,
      totalMonthlyEur: summary.totalMonthlyEur,
    };
  });

  return {
    rackCount: racks.length,
    totalRackCostEur: lines.reduce((sum, line) => sum + line.rackCostEur, 0),
    totalFeedsCostEur: lines.reduce((sum, line) => sum + line.feedsCostEur, 0),
    totalMonthlyEur: lines.reduce((sum, line) => sum + line.totalMonthlyEur, 0),
    racks: lines,
  };
}

export { canAddRack, canConfigureRack, isRackFull };
