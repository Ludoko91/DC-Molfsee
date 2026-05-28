"use client";

import { useLocale, useTranslations } from "next-intl";
import { calculateTotalSummary } from "@/lib/rack/calculations";
import { formatEur } from "@/lib/format";
import type { RackConfig } from "@/lib/rack/types";

type Props = {
  racks: RackConfig[];
};

export function TotalOverview({ racks }: Props) {
  const t = useTranslations("configure");
  const locale = useLocale();
  const numberLocale = locale === "de" ? "de-DE" : "en-IE";
  const total = calculateTotalSummary(racks);

  return (
    <section className="mt-6 rounded-xl border border-card-border bg-card/50 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-foreground">{t("overview.title")}</h2>
          <p className="mt-1 text-xs text-muted">
            {t("overview.subtitle", { count: total.rackCount })}
          </p>
        </div>

        <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {t("overview.grandTotal")}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatEur(total.totalMonthlyEur, numberLocale)}
          </p>
          <p className="mt-0.5 text-xs text-muted">{t("pricing.net")}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-card-border pt-5 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted">{t("overview.rackTotal")}</span>
          <span className="font-medium text-foreground">
            {formatEur(total.totalRackCostEur, numberLocale)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted">{t("overview.powerTotal")}</span>
          <span className="font-medium text-foreground">
            {formatEur(total.totalPowerCostEur, numberLocale)}
          </span>
        </div>
      </div>

      {total.rackCount > 1 && (
        <ul className="mt-4 space-y-2 border-t border-card-border pt-4">
          {total.racks.map((line) => (
            <li
              key={line.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm"
            >
              <span className="text-muted">{line.name}</span>
              <span className="font-mono text-xs text-foreground/80 sm:text-sm">
                {formatEur(line.rackCostEur, numberLocale)}
                <span className="mx-1.5 text-muted">+</span>
                {formatEur(line.powerCostEur, numberLocale)}
                <span className="mx-1.5 text-muted">=</span>
                <span className="font-medium text-foreground">
                  {formatEur(line.totalMonthlyEur, numberLocale)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
