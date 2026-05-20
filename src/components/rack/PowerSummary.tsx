"use client";

import { useLocale, useTranslations } from "next-intl";
import { calculateRackSummary } from "@/lib/rack/calculations";
import {
  FULL_RACK_PRICE_EUR,
  HALF_RACK_PRICE_EUR,
  PER_U_PRICE_EUR,
  RACK_HEIGHT_U,
  type RackConfig,
} from "@/lib/rack/types";
import { cn } from "@/lib/utils";

type Props = {
  rack: RackConfig;
};

function UtilizationBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
      <div
        className={cn("h-full rounded-full bg-success transition-all")}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function formatEur(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function PowerSummary({ rack }: Props) {
  const t = useTranslations("configure");
  const locale = useLocale();
  const summary = calculateRackSummary(rack);
  const numberLocale = locale === "de" ? "de-DE" : "en-IE";

  return (
    <aside className="rounded-xl border border-card-border bg-card/50 p-4">
      <h2 className="font-semibold text-white">{t("power.title")}</h2>
      <p className="mt-1 text-xs text-muted">{rack.name}</p>

      <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          {t("pricing.title")}
        </p>
        <p className="mt-2 text-2xl font-bold text-white">
          {formatEur(summary.pricing.amountEur, numberLocale)}
        </p>
        <p className="mt-1 text-xs text-muted">{t("pricing.net")}</p>
        <p className="mt-2 text-sm text-foreground">
          {t(`pricing.tiers.${summary.pricing.tier}`)}
        </p>
      </div>

      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-xs text-muted">{t("power.usedSpace")}</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {summary.usedU}U / {RACK_HEIGHT_U}U
          </dd>
          <UtilizationBar percent={summary.uUtilizationPercent} />
        </div>

        <div>
          <dt className="text-xs text-muted">{t("power.freeSpace")}</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{summary.freeU}U</dd>
        </div>

        <div>
          <dt className="text-xs text-muted">{t("power.required")}</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {summary.powerKw.toFixed(1)} {t("power.budgetUnit")}
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-2 border-t border-card-border pt-4 text-xs text-muted">
        <p>{t("pricing.rates.full", { price: FULL_RACK_PRICE_EUR })}</p>
        <p>{t("pricing.rates.half", { price: HALF_RACK_PRICE_EUR })}</p>
        <p>{t("pricing.rates.perU", { price: PER_U_PRICE_EUR })}</p>
      </div>
    </aside>
  );
}
