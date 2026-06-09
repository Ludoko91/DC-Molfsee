import {
  canAddRack,
  canConfigureRack,
  createDefaultRack,
  createDefaultRackValues,
  getRequiredPowerFeeds,
} from "@/lib/rack/calculations";
import { MAX_RACKS, type RackConfig } from "@/lib/rack/types";

export type RackState = {
  racks: RackConfig[];
  activeRackId: string;
  independentMultiRack?: boolean;
};

export type RackAction =
  | { type: "SET_ACTIVE_RACK"; rackId: string }
  | { type: "ADD_RACK" }
  | { type: "REMOVE_RACK"; rackId: string }
  | { type: "CLEAR_RACK"; rackId: string }
  | { type: "SET_NEEDED_UNITS"; rackId: string; neededUnits: number }
  | { type: "SET_MAX_POWER_KW"; rackId: string; maxPowerKw: number }
  | { type: "SET_POWER_FEEDS"; rackId: string; powerFeeds: number };

function canAdd(state: RackState): boolean {
  return state.independentMultiRack
    ? state.racks.length < MAX_RACKS
    : canAddRack(state.racks);
}

function canConfigure(state: RackState, rackId: string): boolean {
  return state.independentMultiRack
    ? true
    : canConfigureRack(state.racks, rackId);
}

export function rackReducer(state: RackState, action: RackAction): RackState {
  switch (action.type) {
    case "SET_ACTIVE_RACK":
      return { ...state, activeRackId: action.rackId };

    case "ADD_RACK": {
      if (!canAdd(state)) return state;
      const newRack = createDefaultRack(state.racks.length + 1);
      return {
        racks: [...state.racks, newRack],
        activeRackId: newRack.id,
      };
    }

    case "REMOVE_RACK": {
      if (state.racks.length <= 1) return state;
      const lastRack = state.racks[state.racks.length - 1];
      if (action.rackId !== lastRack.id) return state;
      const racks = state.racks.filter((r) => r.id !== action.rackId);
      const activeRackId =
        state.activeRackId === action.rackId ? racks[0].id : state.activeRackId;
      return { racks, activeRackId };
    }

    case "CLEAR_RACK": {
      if (!canConfigure(state, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? { ...rack, ...createDefaultRackValues() }
            : rack,
        ),
      };
    }

    case "SET_NEEDED_UNITS": {
      if (!canConfigure(state, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? { ...rack, neededUnits: action.neededUnits }
            : rack,
        ),
      };
    }

    case "SET_MAX_POWER_KW": {
      if (!canConfigure(state, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? {
                ...rack,
                maxPowerKw: action.maxPowerKw,
                powerFeeds: Math.max(
                  rack.powerFeeds,
                  getRequiredPowerFeeds(action.maxPowerKw),
                ),
              }
            : rack,
        ),
      };
    }

    case "SET_POWER_FEEDS": {
      if (!canConfigure(state, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? {
                ...rack,
                powerFeeds: Math.max(
                  action.powerFeeds,
                  getRequiredPowerFeeds(rack.maxPowerKw),
                ),
              }
            : rack,
        ),
      };
    }

    default:
      return state;
  }
}
