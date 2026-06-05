"use client";

import { useLocale, useTranslations } from "next-intl";
import { calculateRackSummary } from "@/lib/rack/calculations";
import {
  FULL_RACK_PRICE_EUR,
  HALF_RACK_PRICE_EUR,
  PER_U_PRICE_EUR,
  POWER_FEED_EXTRA_PRICE_EUR,
  POWER_FEED_KW,
  RACK_HEIGHT_U,
  type RackConfig,
} from "@/lib/rack/types";
import { formatEur } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  rack: RackConfig;
};

function UtilizationBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--background-3)]">
      <div
        className={cn("h-full rounded-full bg-success transition-all")}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

export function PowerSummary({ rack }: Props) {
  const t = useTranslations("configure");
  const locale = useLocale();
  const summary = calculateRackSummary(rack);
  const numberLocale = locale === "de" ? "de-DE" : "en-IE";

  return (
    <aside className="card-surface p-5">
      <h2 className="font-semibold text-foreground">{t("power.title")}</h2>
      <p className="mt-1 text-xs text-muted">{rack.name}</p>

      <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          {t("pricing.totalTitle")}
        </p>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {formatEur(summary.totalMonthlyEur, numberLocale)}
        </p>
        <p className="mt-1 text-xs text-muted">{t("pricing.net")}</p>
      </div>

      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-xs text-muted">{t("power.usedSpace")}</dt>
          <dd className="mt-1 text-lg font-semibold text-foreground">
            {summary.usedU}U / {RACK_HEIGHT_U}U
          </dd>
          <UtilizationBar percent={summary.uUtilizationPercent} />
        </div>

        <div>
          <dt className="text-xs text-muted">{t("power.freeSpace")}</dt>
          <dd className="mt-1 text-lg font-semibold text-foreground">{summary.freeU}U</dd>
        </div>

        <div>
          <dt className="text-xs text-muted">{t("power.maxPower")}</dt>
          <dd className="mt-1 text-lg font-semibold text-foreground">
            {summary.maxPowerKw.toFixed(1)} {t("power.kwUnit")}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted">{t("power.totalPower")}</dt>
          <dd className="mt-1 text-lg font-semibold text-foreground">
            {summary.totalPowerKwh} {t("power.kwhUnit")}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted">{t("power.powerFeeds")}</dt>
          <dd className="mt-1 text-lg font-semibold text-foreground">
            {summary.powerFeeds} {t("power.feedsUnit")}
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-3 border-t border-card-border pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted">{t("pricing.rackLine")}</span>
          <span className="font-medium text-foreground">
            {formatEur(summary.pricing.amountEur, numberLocale)}
          </span>
        </div>
        <p className="text-xs text-muted">{t(`pricing.tiers.${summary.pricing.tier}`)}</p>

        <div className="flex justify-between gap-4">
          <span className="text-muted">{t("pricing.feedsLine")}</span>
          <span className="font-medium text-foreground">
            {formatEur(summary.feedsCostEur, numberLocale)}
          </span>
        </div>
        <p className="text-xs text-muted">
          {t("pricing.feedsCalc", {
            feeds: summary.powerFeeds,
            kw: POWER_FEED_KW,
            free: 1,
            price: POWER_FEED_EXTRA_PRICE_EUR,
          })}
        </p>
      </div>

      <div className="mt-6 space-y-2 border-t border-card-border pt-4 text-xs text-muted">
        <p>{t("pricing.rates.full", { price: FULL_RACK_PRICE_EUR })}</p>
        <p>{t("pricing.rates.half", { price: HALF_RACK_PRICE_EUR })}</p>
        <p>{t("pricing.rates.perU", { price: PER_U_PRICE_EUR })}</p>
      </div>
    </aside>
  );
}
