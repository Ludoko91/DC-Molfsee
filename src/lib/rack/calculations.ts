import {
  canAddRack,
  canConfigureRack,
  DEFAULT_MAX_POWER_KW,
  DEFAULT_NEEDED_UNITS,
  DEFAULT_POWER_FEEDS,
  DEFAULT_TOTAL_POWER_KWH,
  FULL_RACK_PRICE_EUR,
  HALF_RACK_PRICE_EUR,
  HALF_RACK_UNITS,
  isRackFull,
  PER_U_PRICE_EUR,
  POWER_FEED_EXTRA_PRICE_EUR,
  POWER_FEED_KW,
  POWER_PRICE_EUR_PER_KWH,
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

export function calculatePowerCost(totalPowerKwh: number): number {
  return totalPowerKwh * POWER_PRICE_EUR_PER_KWH;
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
  const powerCostEur = calculatePowerCost(rack.totalPowerKwh);
  const feedsCostEur = calculateFeedsCost(rack.powerFeeds);
  // Monthly total: rack space + power feeds only (kWh consumption is excluded).
  const totalMonthlyEur = pricing.amountEur + feedsCostEur;

  return {
    usedU,
    freeU,
    maxPowerKw: rack.maxPowerKw,
    totalPowerKwh: rack.totalPowerKwh,
    powerCostEur,
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
    totalPowerKwh: DEFAULT_TOTAL_POWER_KWH,
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
  "neededUnits" | "maxPowerKw" | "totalPowerKwh" | "powerFeeds"
> {
  const maxPowerKw = DEFAULT_MAX_POWER_KW;
  const requiredFeeds = getRequiredPowerFeeds(maxPowerKw);
  return {
    neededUnits: DEFAULT_NEEDED_UNITS,
    maxPowerKw,
    totalPowerKwh: DEFAULT_TOTAL_POWER_KWH,
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
      powerCostEur: summary.powerCostEur,
      feedsCostEur: summary.feedsCostEur,
      totalMonthlyEur: summary.totalMonthlyEur,
    };
  });

  return {
    rackCount: racks.length,
    totalRackCostEur: lines.reduce((sum, line) => sum + line.rackCostEur, 0),
    totalPowerCostEur: lines.reduce((sum, line) => sum + line.powerCostEur, 0),
    totalFeedsCostEur: lines.reduce((sum, line) => sum + line.feedsCostEur, 0),
    totalPowerKwh: racks.reduce((sum, rack) => sum + rack.totalPowerKwh, 0),
    totalMonthlyEur: lines.reduce((sum, line) => sum + line.totalMonthlyEur, 0),
    racks: lines,
  };
}

export { canAddRack, canConfigureRack, isRackFull };
