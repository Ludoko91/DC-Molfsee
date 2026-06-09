"use client";

import { ConfigurationSliders } from "./ConfigurationSliders";
import { RackVisualizer } from "./RackVisualizer";
import { PowerSummary } from "./PowerSummary";
import { RackControls } from "./RackControls";
import { TotalOverview } from "./TotalOverview";
import { canConfigureRack } from "@/lib/rack/calculations";
import { useRackConfig } from "@/lib/rack/useRackConfig";

export function RackBuilder() {
  const { racks, activeRackId, activeRack, dispatch } = useRackConfig();
  const activeConfigurable = canConfigureRack(racks, activeRack.id);

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
        />

        <div className="space-y-4">
          <RackControls
            racks={racks}
            activeRackId={activeRackId}
            onSelectRack={(rackId) => dispatch({ type: "SET_ACTIVE_RACK", rackId })}
            onAddRack={() => dispatch({ type: "ADD_RACK" })}
            onRemoveRack={(rackId) => dispatch({ type: "REMOVE_RACK", rackId })}
            onClearRack={(rackId) => dispatch({ type: "CLEAR_RACK", rackId })}
          />
          <RackVisualizer rack={activeRack} />
        </div>

        <PowerSummary rack={activeRack} />
      </div>

      <TotalOverview racks={racks} />
    </div>
  );
}
