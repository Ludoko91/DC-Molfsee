"use client";

import { useTranslations } from "next-intl";
import {
  MAX_NEEDED_UNITS,
  MAX_POWER_KW,
  MIN_NEEDED_UNITS,
  MIN_POWER_KW,
  RACK_HEIGHT_U,
  type RackConfig,
} from "@/lib/rack/types";

type Props = {
  rack: RackConfig;
  onSetNeededUnits: (units: number) => void;
  onSetPowerKw: (powerKw: number) => void;
};

function ConfigSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-mono text-accent">
          {step < 1 ? value.toFixed(1) : value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-accent"
      />
    </div>
  );
}

export function ConfigurationSliders({
  rack,
  onSetNeededUnits,
  onSetPowerKw,
}: Props) {
  const t = useTranslations("configure");

  return (
    <aside className="space-y-6 rounded-xl border border-card-border bg-card/50 p-4">
      <div>
        <h2 className="font-semibold text-white">{t("sliders.title")}</h2>
        <p className="mt-1 text-xs text-muted">{t("sliders.hint")}</p>
      </div>

      <div className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-muted">
        {t("rack.fixedHeight", { height: RACK_HEIGHT_U })}
      </div>

      <ConfigSlider
        label={t("sliders.neededUnits")}
        value={rack.neededUnits}
        min={MIN_NEEDED_UNITS}
        max={MAX_NEEDED_UNITS}
        unit="U"
        onChange={onSetNeededUnits}
      />

      <ConfigSlider
        label={t("sliders.power")}
        value={rack.powerKw}
        min={MIN_POWER_KW}
        max={MAX_POWER_KW}
        step={0.5}
        unit={t("power.budgetUnit")}
        onChange={onSetPowerKw}
      />
    </aside>
  );
}
