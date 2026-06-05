"use client";

import { useTranslations } from "next-intl";
import { getRequiredPowerFeeds } from "@/lib/rack/calculations";
import {
  MAX_MAX_POWER_KW,
  MAX_NEEDED_UNITS,
  MAX_TOTAL_POWER_KWH,
  MIN_MAX_POWER_KW,
  MIN_NEEDED_UNITS,
  MIN_TOTAL_POWER_KWH,
  POWER_FEED_EXTRA_PRICE_EUR,
  POWER_FEED_KW,
  RACK_HEIGHT_U,
  type RackConfig,
} from "@/lib/rack/types";
import { cn } from "@/lib/utils";

type Props = {
  rack: RackConfig;
  disabled?: boolean;
  onSetNeededUnits: (units: number) => void;
  onSetMaxPowerKw: (maxPowerKw: number) => void;
  onSetPowerFeeds: (powerFeeds: number) => void;
  onSetTotalPowerKwh: (totalPowerKwh: number) => void;
};

function ConfigSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  hint,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-50")}>
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
        disabled={disabled}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--background-3)] accent-accent disabled:cursor-not-allowed"
      />
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function ConfigurationSliders({
  rack,
  disabled = false,
  onSetNeededUnits,
  onSetMaxPowerKw,
  onSetPowerFeeds,
  onSetTotalPowerKwh,
}: Props) {
  const t = useTranslations("configure");
  const minFeeds = getRequiredPowerFeeds(rack.maxPowerKw);

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

      <div className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-muted">
        {t("rack.fixedHeight", { height: RACK_HEIGHT_U })}
      </div>

      <ConfigSlider
        label={t("sliders.neededUnits")}
        value={rack.neededUnits}
        min={MIN_NEEDED_UNITS}
        max={MAX_NEEDED_UNITS}
        unit="U"
        disabled={disabled}
        onChange={onSetNeededUnits}
      />

      <div className="space-y-4 border-t border-card-border pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {t("sliders.powerSection")}
        </p>

        <ConfigSlider
          label={t("sliders.maxPower")}
          value={rack.maxPowerKw}
          min={MIN_MAX_POWER_KW}
          max={MAX_MAX_POWER_KW}
          step={0.5}
          unit={t("power.kwUnit")}
          disabled={disabled}
          onChange={onSetMaxPowerKw}
        />

        <ConfigSlider
          label={t("sliders.powerFeeds")}
          value={rack.powerFeeds}
          min={minFeeds}
          max={10}
          step={1}
          unit={t("power.feedsUnit")}
          hint={t("sliders.powerFeedsHint", {
            kw: POWER_FEED_KW,
            free: 1,
            price: POWER_FEED_EXTRA_PRICE_EUR,
          })}
          disabled={disabled}
          onChange={onSetPowerFeeds}
        />

        <ConfigSlider
          label={t("sliders.totalPower")}
          value={rack.totalPowerKwh}
          min={MIN_TOTAL_POWER_KWH}
          max={MAX_TOTAL_POWER_KWH}
          step={10}
          unit={t("power.kwhUnit")}
          hint={t("sliders.totalPowerHint")}
          disabled={disabled}
          onChange={onSetTotalPowerKwh}
        />
      </div>
    </aside>
  );
}
