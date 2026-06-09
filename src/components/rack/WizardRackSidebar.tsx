"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { MAX_RACKS, RACK_HEIGHT_U, type RackConfig } from "@/lib/rack/types";
import { cn } from "@/lib/utils";

type Props = {
  racks: RackConfig[];
  activeRackId: string;
  canAdd: boolean;
  onSelectRack: (rackId: string) => void;
  onAddRack: () => void;
  onRemoveRack: (rackId: string) => void;
};

export function WizardRackSidebar({
  racks,
  activeRackId,
  canAdd,
  onSelectRack,
  onAddRack,
  onRemoveRack,
}: Props) {
  const t = useTranslations("configure");
  const activeRack = racks.find((r) => r.id === activeRackId)!;
  const isLastRack = racks[racks.length - 1]?.id === activeRackId;

  return (
    <aside className="card-surface flex min-w-0 flex-col p-3 sm:p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
        {t("rack.selectRack")}
      </p>

      <ul className="flex flex-1 flex-col gap-1.5">
        {racks.map((rack) => {
          const isActive = rack.id === activeRackId;

          return (
            <li key={rack.id}>
              <button
                type="button"
                onClick={() => onSelectRack(rack.id)}
                className={cn(
                  "w-full rounded-[var(--radius)] border px-3 py-2.5 text-left text-sm transition",
                  isActive
                    ? "border-accent bg-accent/10 font-medium text-accent-deep"
                    : "border-transparent bg-card text-foreground hover:border-card-border hover:bg-[var(--accent-light)]/40",
                )}
              >
                <span className="block">{rack.name}</span>
                <span className="mt-0.5 block font-mono text-xs text-muted">
                  {rack.neededUnits}U · {rack.maxPowerKw.toFixed(1)} kW
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 space-y-2 border-t border-card-border pt-3">
        <button
          type="button"
          onClick={onAddRack}
          disabled={!canAdd}
          title={!canAdd ? t("rack.limit", { max: MAX_RACKS, units: RACK_HEIGHT_U }) : t("rack.add")}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed px-3 py-2.5 text-sm transition",
            canAdd
              ? "border-accent/40 text-accent hover:border-accent hover:bg-accent/5"
              : "cursor-not-allowed border-card-border text-muted/40",
          )}
        >
          <Plus className="h-4 w-4" />
          {t("rack.add")}
        </button>

        {racks.length > 1 && isLastRack && (
          <button
            type="button"
            onClick={() => onRemoveRack(activeRack.id)}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-danger/30 px-3 py-2 text-sm text-danger transition hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("rack.remove")}
          </button>
        )}

        <p className="text-center text-[10px] text-muted">
          {t("rack.limit", { max: MAX_RACKS, units: RACK_HEIGHT_U })}
        </p>
      </div>
    </aside>
  );
}
