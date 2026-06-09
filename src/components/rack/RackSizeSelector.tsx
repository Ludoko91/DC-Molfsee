"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  EIGHTH_RACK_UNITS,
  HALF_RACK_UNITS,
  MAX_NEEDED_UNITS,
  MIN_NEEDED_UNITS,
  QUARTER_RACK_UNITS,
  RACK_HEIGHT_U,
  THREE_QUARTER_RACK_UNITS,
} from "@/lib/rack/types";
import { cn } from "@/lib/utils";

type PresetKey =
  | "u1"
  | "u2"
  | "u4"
  | "eighth"
  | "quarter"
  | "half"
  | "threeQuarter"
  | "full";

const PRESETS: { key: PresetKey; units: number }[] = [
  { key: "u1", units: 1 },
  { key: "u2", units: 2 },
  { key: "u4", units: 4 },
  { key: "eighth", units: EIGHTH_RACK_UNITS },
  { key: "quarter", units: QUARTER_RACK_UNITS },
  { key: "half", units: HALF_RACK_UNITS },
  { key: "threeQuarter", units: THREE_QUARTER_RACK_UNITS },
  { key: "full", units: RACK_HEIGHT_U },
];

function clampUnits(value: number): number {
  return Math.min(MAX_NEEDED_UNITS, Math.max(MIN_NEEDED_UNITS, Math.round(value)));
}

type Props = {
  value: number;
  disabled?: boolean;
  onChange: (units: number) => void;
};

export function RackSizeSelector({ value, disabled = false, onChange }: Props) {
  const t = useTranslations("configure.rackSize");
  const activePreset = PRESETS.find((preset) => preset.units === value)?.key;
  const [customInput, setCustomInput] = useState(String(value));

  useEffect(() => {
    setCustomInput(String(value));
  }, [value]);

  function handlePresetClick(units: number) {
    if (disabled) return;
    onChange(units);
  }

  function handleCustomChange(raw: string) {
    setCustomInput(raw);
    if (raw === "") return;

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;

    onChange(clampUnits(parsed));
  }

  function handleCustomBlur() {
    if (customInput === "") {
      setCustomInput(String(value));
      return;
    }

    const parsed = Number(customInput);
    if (!Number.isFinite(parsed)) {
      setCustomInput(String(value));
      return;
    }

    const clamped = clampUnits(parsed);
    setCustomInput(String(clamped));
    if (clamped !== value) onChange(clamped);
  }

  return (
    <div className={cn("space-y-4", disabled && "opacity-50")}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.key;

          return (
            <button
              key={preset.key}
              type="button"
              disabled={disabled}
              aria-pressed={isActive}
              onClick={() => handlePresetClick(preset.units)}
              className={cn(
                "flex flex-col items-center rounded-[var(--radius)] border px-2 py-3 text-center transition",
                isActive
                  ? "border-accent bg-accent/10 text-accent-deep ring-2 ring-accent/20"
                  : "border-card-border bg-card text-foreground hover:border-accent/40 hover:bg-accent/5",
                disabled && "cursor-not-allowed",
              )}
            >
              <span className="text-sm font-medium">{t(preset.key)}</span>
              <span className="mt-1 font-mono text-xs text-muted">{preset.units}U</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <label htmlFor="rack-size-custom" className="text-sm text-foreground">
          {t("customLabel")}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="rack-size-custom"
            type="number"
            min={MIN_NEEDED_UNITS}
            max={MAX_NEEDED_UNITS}
            step={1}
            value={customInput}
            disabled={disabled}
            onChange={(e) => handleCustomChange(e.target.value)}
            onBlur={handleCustomBlur}
            className={cn(
              "w-full rounded-xl border bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10",
              activePreset === undefined
                ? "border-accent/60 ring-2 ring-accent/10"
                : "border-card-border",
            )}
          />
          <span className="shrink-0 text-sm text-muted">U</span>
        </div>
        <p className="text-[11px] text-muted">
          {t("customHint", { min: MIN_NEEDED_UNITS, max: MAX_NEEDED_UNITS })}
        </p>
      </div>
    </div>
  );
}
