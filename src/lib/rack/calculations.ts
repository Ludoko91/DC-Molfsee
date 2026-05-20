import {
  DEFAULT_NEEDED_UNITS,
  DEFAULT_POWER_KW,
  RACK_HEIGHT_U,
  type RackConfig,
  type RackSummary,
} from "./types";
import { generateId } from "../utils";

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
