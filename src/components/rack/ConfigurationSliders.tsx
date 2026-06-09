"use client";

import { useTranslations } from "next-intl";
import { RACK_HEIGHT_U, type RackConfig } from "@/lib/rack/types";
import { ConfigurationStepPanel } from "./ConfigurationStepPanel";

type Props = {
  rack: RackConfig;
  disabled?: boolean;
  onSetNeededUnits: (units: number) => void;
  onSetMaxPowerKw: (maxPowerKw: number) => void;
  onSetPowerFeeds: (powerFeeds: number) => void;
};

export function ConfigurationSliders({
  rack,
  disabled = false,
  onSetNeededUnits,
  onSetMaxPowerKw,
  onSetPowerFeeds,
}: Props) {
  const t = useTranslations("configure");

  return (
    <aside className="card-surface space-y-6 p-5">
      <div>
        <h2 className="font-semibold text-foreground">{t("sliders.title")}</h2>
        <p className="mt-1 text-xs text-muted">{t("sliders.hint")}</p>
      </div>

      {disabled && (
        <p className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
          {t("rack.lockedHint", { units: RACK_HEIGHT_U })}
        </p>
      )}

      <ConfigurationStepPanel
        step="size"
        rack={rack}
        disabled={disabled}
        onSetNeededUnits={onSetNeededUnits}
        onSetMaxPowerKw={onSetMaxPowerKw}
        onSetPowerFeeds={onSetPowerFeeds}
      />

      <div className="space-y-4 border-t border-card-border pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {t("sliders.powerSection")}
        </p>

        <ConfigurationStepPanel
          step="power"
          rack={rack}
          disabled={disabled}
          onSetNeededUnits={onSetNeededUnits}
          onSetMaxPowerKw={onSetMaxPowerKw}
          onSetPowerFeeds={onSetPowerFeeds}
        />

        <ConfigurationStepPanel
          step="feeds"
          rack={rack}
          disabled={disabled}
          onSetNeededUnits={onSetNeededUnits}
          onSetMaxPowerKw={onSetMaxPowerKw}
          onSetPowerFeeds={onSetPowerFeeds}
        />
      </div>
    </aside>
  );
}
