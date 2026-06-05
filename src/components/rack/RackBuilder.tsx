"use client";

import { useReducer } from "react";
import { ConfigurationSliders } from "./ConfigurationSliders";
import { RackVisualizer } from "./RackVisualizer";
import { PowerSummary } from "./PowerSummary";
import { RackControls } from "./RackControls";
import { TotalOverview } from "./TotalOverview";
import {
  canAddRack,
  canConfigureRack,
  createDefaultRack,
  createDefaultRackValues,
  createInitialState,
  getRequiredPowerFeeds,
} from "@/lib/rack/calculations";
import type { RackConfig } from "@/lib/rack/types";

type State = {
  racks: RackConfig[];
  activeRackId: string;
};

type Action =
  | { type: "SET_ACTIVE_RACK"; rackId: string }
  | { type: "ADD_RACK" }
  | { type: "REMOVE_RACK"; rackId: string }
  | { type: "CLEAR_RACK"; rackId: string }
  | { type: "SET_NEEDED_UNITS"; rackId: string; neededUnits: number }
  | { type: "SET_MAX_POWER_KW"; rackId: string; maxPowerKw: number }
  | { type: "SET_TOTAL_POWER_KWH"; rackId: string; totalPowerKwh: number }
  | { type: "SET_POWER_FEEDS"; rackId: string; powerFeeds: number };

function rackReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ACTIVE_RACK":
      return { ...state, activeRackId: action.rackId };

    case "ADD_RACK": {
      if (!canAddRack(state.racks)) return state;
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
      if (!canConfigureRack(state.racks, action.rackId)) return state;
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
      if (!canConfigureRack(state.racks, action.rackId)) return state;
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
      if (!canConfigureRack(state.racks, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? {
                ...rack,
                maxPowerKw: action.maxPowerKw,
                powerFeeds: Math.max(rack.powerFeeds, getRequiredPowerFeeds(action.maxPowerKw)),
              }
            : rack,
        ),
      };
    }

    case "SET_TOTAL_POWER_KWH": {
      if (!canConfigureRack(state.racks, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? { ...rack, totalPowerKwh: action.totalPowerKwh }
            : rack,
        ),
      };
    }

    case "SET_POWER_FEEDS": {
      if (!canConfigureRack(state.racks, action.rackId)) return state;
      return {
        ...state,
        racks: state.racks.map((rack) =>
          rack.id === action.rackId
            ? {
                ...rack,
                powerFeeds: Math.max(action.powerFeeds, getRequiredPowerFeeds(rack.maxPowerKw)),
              }
            : rack,
        ),
      };
    }

    default:
      return state;
  }
}

export function RackBuilder() {
  const [state, dispatch] = useReducer(rackReducer, undefined, createInitialState);
  const activeRack = state.racks.find((r) => r.id === state.activeRackId)!;
  const activeConfigurable = canConfigureRack(state.racks, activeRack.id);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px]">
        <ConfigurationSliders
          rack={activeRack}
          disabled={!activeConfigurable}
          onSetNeededUnits={(neededUnits) =>
            dispatch({ type: "SET_NEEDED_UNITS", rackId: activeRack.id, neededUnits })
          }
          onSetMaxPowerKw={(maxPowerKw) =>
            dispatch({ type: "SET_MAX_POWER_KW", rackId: activeRack.id, maxPowerKw })
          }
          onSetPowerFeeds={(powerFeeds) =>
            dispatch({ type: "SET_POWER_FEEDS", rackId: activeRack.id, powerFeeds })
          }
          onSetTotalPowerKwh={(totalPowerKwh) =>
            dispatch({
              type: "SET_TOTAL_POWER_KWH",
              rackId: activeRack.id,
              totalPowerKwh,
            })
          }
        />

        <div className="space-y-4">
          <RackControls
            racks={state.racks}
            activeRackId={state.activeRackId}
            onSelectRack={(rackId) => dispatch({ type: "SET_ACTIVE_RACK", rackId })}
            onAddRack={() => dispatch({ type: "ADD_RACK" })}
            onRemoveRack={(rackId) => dispatch({ type: "REMOVE_RACK", rackId })}
            onClearRack={(rackId) => dispatch({ type: "CLEAR_RACK", rackId })}
          />
          <RackVisualizer rack={activeRack} />
        </div>

        <PowerSummary rack={activeRack} />
      </div>

      <TotalOverview racks={state.racks} />
    </div>
  );
}
