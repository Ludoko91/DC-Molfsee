"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2, RotateCcw, Lock } from "lucide-react";
import { canAddRack, canConfigureRack, isRackFull } from "@/lib/rack/calculations";
import { MAX_RACKS, RACK_HEIGHT_U, type RackConfig } from "@/lib/rack/types";
import { cn } from "@/lib/utils";

type Props = {
  racks: RackConfig[];
  activeRackId: string;
  onSelectRack: (rackId: string) => void;
  onAddRack: () => void;
  onRemoveRack: (rackId: string) => void;
  onClearRack: (rackId: string) => void;
};

export function RackControls({
  racks,
  activeRackId,
  onSelectRack,
  onAddRack,
  onRemoveRack,
  onClearRack,
}: Props) {
  const t = useTranslations("configure");
  const activeRack = racks.find((r) => r.id === activeRackId)!;
  const allowAdd = canAddRack(racks);
  const activeConfigurable = canConfigureRack(racks, activeRack.id);
  const isLastRack = racks[racks.length - 1]?.id === activeRack.id;

  return (
    <div className="space-y-3 rounded-xl border border-card-border bg-card/50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{t("rack.selectRack")}:</span>
          {racks.map((rack) => {
            const configurable = canConfigureRack(racks, rack.id);
            const full = isRackFull(rack);
            return (
              <button
                key={rack.id}
                type="button"
                onClick={() => onSelectRack(rack.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition",
                  rack.id === activeRackId
                    ? "bg-accent text-slate-950"
                    : "bg-card text-muted hover:text-foreground",
                  !configurable && rack.id !== activeRackId && "opacity-60",
                )}
              >
                {!configurable && <Lock className="h-3 w-3" />}
                {rack.name}
                {full && (
                  <span className="rounded bg-success/20 px-1 text-[10px] uppercase text-success">
                    {t("rack.full")}
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onAddRack}
            disabled={!allowAdd}
            title={!allowAdd ? t("rack.addDisabledHint", { units: RACK_HEIGHT_U }) : undefined}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border border-card-border px-3 py-1.5 text-sm transition",
              allowAdd
                ? "text-muted hover:border-accent/40 hover:text-accent"
                : "cursor-not-allowed text-muted/40",
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("rack.add")}
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onClearRack(activeRack.id)}
            disabled={!activeConfigurable}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border border-card-border px-3 py-1.5 text-sm transition",
              activeConfigurable
                ? "text-muted hover:text-warning"
                : "cursor-not-allowed text-muted/40",
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("rack.clear")}
          </button>

          {racks.length > 1 && isLastRack && (
            <button
              type="button"
              onClick={() => onRemoveRack(activeRack.id)}
              className="inline-flex items-center gap-1 rounded-md border border-danger/30 px-3 py-1.5 text-sm text-danger transition hover:bg-danger/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("rack.remove")}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted">
        {t("rack.limit", { max: MAX_RACKS, units: RACK_HEIGHT_U })}
      </p>

      {!allowAdd && racks.length < MAX_RACKS && (
        <p className="text-xs text-warning">{t("rack.fillBeforeAdd", { units: RACK_HEIGHT_U })}</p>
      )}

      {!activeConfigurable && (
        <p className="text-xs text-warning">{t("rack.lockedHint", { units: RACK_HEIGHT_U })}</p>
      )}
    </div>
  );
}
