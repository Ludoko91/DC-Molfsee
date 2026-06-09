"use client";

import { useTranslations } from "next-intl";
import { getRequiredPowerFeeds } from "@/lib/rack/calculations";
import {
  MAX_MAX_POWER_KW,
  MIN_MAX_POWER_KW,
  POWER_FEED_EXTRA_PRICE_EUR,
  POWER_FEED_KW,
  RACK_HEIGHT_U,
  type RackConfig,
} from "@/lib/rack/types";
import { ConfigSlider } from "./ConfigSlider";
import { RackSizeSelector } from "./RackSizeSelector";

export type ConfigurationStep = "size" | "power" | "feeds";

type Props = {
  step: ConfigurationStep;
  rack: RackConfig;
  disabled?: boolean;
  onSetNeededUnits: (units: number) => void;
  onSetMaxPowerKw: (maxPowerKw: number) => void;
  onSetPowerFeeds: (powerFeeds: number) => void;
};

export function ConfigurationStepPanel({
  step,
  rack,
  disabled = false,
  onSetNeededUnits,
  onSetMaxPowerKw,
  onSetPowerFeeds,
}: Props) {
  const t = useTranslations("configure");
  const minFeeds = getRequiredPowerFeeds(rack.maxPowerKw);

  if (step === "size") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-muted">
          {t("rack.fixedHeight", { height: RACK_HEIGHT_U })}
        </div>
        <RackSizeSelector
          value={rack.neededUnits}
          disabled={disabled}
          onChange={onSetNeededUnits}
        />
      </div>
    );
  }

  if (step === "power") {
    return (
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
    );
  }

  return (
    <ConfigSlider
      label={t("sliders.powerFeeds")}
      value={Math.max(rack.powerFeeds, minFeeds)}
      min={1}
      max={10}
      step={1}
      unit={t("power.feedsUnit")}
      hint={t("sliders.powerFeedsHint", {
        min: minFeeds,
        kw: POWER_FEED_KW,
        free: 1,
        price: POWER_FEED_EXTRA_PRICE_EUR,
      })}
      disabled={disabled}
      onChange={(feeds) => onSetPowerFeeds(Math.max(feeds, minFeeds))}
    />
  );
}
