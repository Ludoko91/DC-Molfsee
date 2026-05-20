"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import type { RackConfig } from "@/lib/rack/types";
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

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-card-border bg-card/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">{t("rack.selectRack")}:</span>
        {racks.map((rack) => (
          <button
            key={rack.id}
            type="button"
            onClick={() => onSelectRack(rack.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition",
              rack.id === activeRackId
                ? "bg-accent text-slate-950"
                : "bg-card text-muted hover:text-foreground",
            )}
          >
            {rack.name}
          </button>
        ))}
        <button
          type="button"
          onClick={onAddRack}
          className="inline-flex items-center gap-1 rounded-md border border-card-border px-3 py-1.5 text-sm text-muted transition hover:border-accent/40 hover:text-accent"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("rack.add")}
        </button>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onClearRack(activeRack.id)}
          className="inline-flex items-center gap-1 rounded-md border border-card-border px-3 py-1.5 text-sm text-muted transition hover:text-warning"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("rack.clear")}
        </button>

        {racks.length > 1 && (
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
  );
}
