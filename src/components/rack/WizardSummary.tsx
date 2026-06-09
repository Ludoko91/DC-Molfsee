"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  calculatePrice,
  calculateRackSummary,
  calculateTotalSummary,
} from "@/lib/rack/calculations";
import type { RackConfig } from "@/lib/rack/types";
import { formatEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WizardStep } from "./ConfigureProgressBar";

type Props = {
  racks: RackConfig[];
  activeRack: RackConfig;
  currentStep: WizardStep;
  className?: string;
};

function RackConfigLines({
  rack,
  currentStep,
  compact = false,
}: {
  rack: RackConfig;
  currentStep: WizardStep;
  compact?: boolean;
}) {
  const t = useTranslations("configure");
  const showSize = currentStep >= 1;
  const showPower = currentStep >= 2;
  const showFeeds = currentStep >= 3;

  return (
    <>
      {showSize && (
        <div className={cn("flex items-baseline justify-between gap-4", compact && "text-xs")}>
          <dt className="text-muted">{t("sliders.neededUnits")}</dt>
          <dd className="font-mono font-semibold text-foreground">{rack.neededUnits}U</dd>
        </div>
      )}
      {showPower && (
        <div className={cn("flex items-baseline justify-between gap-4", compact && "text-xs")}>
          <dt className="text-muted">{t("sliders.maxPower")}</dt>
          <dd className="font-mono font-semibold text-foreground">
            {rack.maxPowerKw.toFixed(1)} {t("power.kwUnit")}
          </dd>
        </div>
      )}
      {showFeeds && (
        <div className={cn("flex items-baseline justify-between gap-4", compact && "text-xs")}>
          <dt className="text-muted">{t("sliders.powerFeeds")}</dt>
          <dd className="font-mono font-semibold text-foreground">
            {rack.powerFeeds} {t("power.feedsUnit")}
          </dd>
        </div>
      )}
    </>
  );
}

export function WizardSummary({ racks, activeRack, currentStep, className }: Props) {
  const t = useTranslations("configure");
  const locale = useLocale();
  const numberLocale = locale === "de" ? "de-DE" : "en-IE";
  const showAllRacks = currentStep === 4 && racks.length > 1;

  const totalMonthlyEur =
    currentStep >= 3
      ? calculateTotalSummary(racks).totalMonthlyEur
      : racks.reduce((sum, rack) => sum + calculatePrice(rack.neededUnits).amountEur, 0);

  return (
    <aside className={cn("card-surface min-w-0 p-5", className)}>
      <h2 className="font-semibold text-foreground">{t("power.title")}</h2>

      <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          {t("pricing.totalTitle")}
        </p>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {formatEur(totalMonthlyEur, numberLocale)}
        </p>
        <p className="mt-1 text-xs text-muted">{t("pricing.net")}</p>
        {racks.length > 1 && (
          <p className="mt-2 text-xs text-muted">
            {t("overview.subtitle", { count: racks.length })}
          </p>
        )}
      </div>

      {showAllRacks ? (
        <ul className="mt-6 space-y-4 border-t border-card-border pt-4">
          {racks.map((rack) => {
            const summary = calculateRackSummary(rack);
            return (
              <li key={rack.id} className="space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-medium text-foreground">{rack.name}</p>
                  <p className="font-mono text-xs font-semibold text-foreground">
                    {formatEur(summary.totalMonthlyEur, numberLocale)}
                  </p>
                </div>
                <dl className="space-y-1.5">
                  <RackConfigLines rack={rack} currentStep={currentStep} compact />
                </dl>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6 border-t border-card-border pt-4">
          {racks.length > 1 && (
            <p className="mb-3 text-xs font-medium text-foreground">{activeRack.name}</p>
          )}
          <dl className="space-y-3">
            <RackConfigLines rack={activeRack} currentStep={currentStep} />
          </dl>
        </div>
      )}
    </aside>
  );
}
