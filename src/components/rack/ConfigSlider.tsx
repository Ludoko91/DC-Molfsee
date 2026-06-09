"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function ConfigSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  hint,
  disabled,
  onChange,
}: Props) {
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
