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
};

export const RACK_HEIGHT_U = 47;
export const SLOT_HEIGHT_PX = 11;
export const DEFAULT_NEEDED_UNITS = 10;
export const DEFAULT_POWER_KW = 5;
export const MIN_NEEDED_UNITS = 1;
export const MAX_NEEDED_UNITS = 47;
export const MIN_POWER_KW = 0.5;
export const MAX_POWER_KW = 20;
