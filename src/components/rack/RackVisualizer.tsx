"use client";

import { useTranslations } from "next-intl";
import { getAllocatedStartU, getOccupiedUnits } from "@/lib/rack/calculations";
import { RACK_HEIGHT_U, SLOT_HEIGHT_PX, type RackConfig } from "@/lib/rack/types";
import { cn } from "@/lib/utils";
import { AllocatedSpaceBlock } from "./AllocatedSpaceBlock";

type Props = {
  rack: RackConfig;
};

function MountingRail() {
  return (
    <div
      className="w-3 shrink-0 border-x border-slate-600 bg-slate-800"
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, #1e293b 0px, #1e293b 3px, #475569 3px, #475569 4px, #1e293b 4px, #1e293b 11px)",
      }}
    />
  );
}

function RackSlotRow({
  unit,
  isOccupied,
  showLabel,
}: {
  unit: number;
  isOccupied: boolean;
  showLabel: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center border-b border-slate-700/80",
        isOccupied ? "bg-transparent" : "bg-slate-950/40",
      )}
      style={{ height: SLOT_HEIGHT_PX }}
    >
      <span className="w-5 shrink-0 text-center font-mono text-[8px] text-slate-500">
        {showLabel ? unit : ""}
      </span>
      <div className="relative flex-1">
        {!isOccupied && (
          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/60" />
        )}
      </div>
    </div>
  );
}

export function RackVisualizer({ rack }: Props) {
  const t = useTranslations("configure");
  const occupied = getOccupiedUnits(rack);
  const startU = getAllocatedStartU(rack.neededUnits);
  const endU = startU + rack.neededUnits - 1;
  const units = Array.from({ length: RACK_HEIGHT_U }, (_, i) => RACK_HEIGHT_U - i);
  const bayHeight = RACK_HEIGHT_U * SLOT_HEIGHT_PX;

  return (
    <div className="rounded-xl border border-card-border bg-card/50 p-4">
      <div className="mb-4">
        <h2 className="font-semibold text-foreground">
          {t("rack.title")} — {rack.name}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {rack.neededUnits > 0
            ? t("rack.schematicCentered", { start: startU, end: endU })
            : t("rack.schematic")}
        </p>
      </div>

      <div className="mx-auto max-w-xs">
        {/* Rack cabinet outer frame */}
        <div className="rounded-sm border-2 border-slate-500 bg-slate-900 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Top cap / roof */}
          <div className="flex h-5 items-center justify-center rounded-t-sm border border-slate-600 bg-gradient-to-b from-slate-600 to-slate-700">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-300">
              {t("rack.cabinetLabel", { height: RACK_HEIGHT_U })}
            </span>
          </div>

          {/* Main cabinet body */}
          <div className="flex border-x border-slate-600 bg-slate-950">
            <MountingRail />

            {/* Equipment bay */}
            <div className="relative flex-1 border-x border-slate-700/50 bg-slate-900/90">
              <div className="relative" style={{ height: bayHeight }}>
                <div className="flex flex-col">
                  {units.map((unit) => (
                    <RackSlotRow
                      key={unit}
                      unit={unit}
                      isOccupied={occupied.has(unit)}
                      showLabel={unit % 5 === 0 || unit === 1 || unit === RACK_HEIGHT_U}
                    />
                  ))}
                </div>

                {rack.neededUnits > 0 && (
                  <div
                    className="absolute left-5 right-1"
                    style={{
                      bottom: (startU - 1) * SLOT_HEIGHT_PX,
                      height: rack.neededUnits * SLOT_HEIGHT_PX,
                    }}
                  >
                    <AllocatedSpaceBlock heightU={rack.neededUnits} startU={startU} endU={endU} />
                  </div>
                )}
              </div>
            </div>

            <MountingRail />
          </div>

          {/* Bottom plinth / feet */}
          <div className="flex h-4 items-end justify-between rounded-b-sm border border-t-0 border-slate-600 bg-gradient-to-b from-slate-700 to-slate-800 px-3">
            <div className="h-2 w-4 rounded-b-sm bg-slate-900" />
            <div className="h-2 w-4 rounded-b-sm bg-slate-900" />
            <div className="h-2 w-4 rounded-b-sm bg-slate-900" />
            <div className="h-2 w-4 rounded-b-sm bg-slate-900" />
          </div>
        </div>

        {/* Dimension labels */}
        <div className="mt-3 flex justify-between text-[10px] text-muted">
          <span>{t("rack.bottom")}</span>
          <span>{t("rack.units", { height: RACK_HEIGHT_U })}</span>
          <span>{t("rack.top")}</span>
        </div>
      </div>
    </div>
  );
}
