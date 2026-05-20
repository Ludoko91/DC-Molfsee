"use client";

import { useTranslations } from "next-intl";
import { calculateRackSummary } from "@/lib/rack/calculations";
import { RACK_HEIGHT_U, type RackConfig } from "@/lib/rack/types";
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

export function PowerSummary({ rack }: Props) {
  const t = useTranslations("configure");
  const summary = calculateRackSummary(rack);

  return (
    <aside className="rounded-xl border border-card-border bg-card/50 p-4">
      <h2 className="font-semibold text-white">{t("power.title")}</h2>
      <p className="mt-1 text-xs text-muted">{rack.name}</p>

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
    </aside>
  );
}
