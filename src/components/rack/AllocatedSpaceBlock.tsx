"use client";

import { useTranslations } from "next-intl";

type Props = {
  heightU: number;
  startU: number;
  endU: number;
};

export function AllocatedSpaceBlock({ heightU, startU, endU }: Props) {
  const t = useTranslations("configure");

  return (
    <div className="h-full overflow-hidden rounded-sm border border-cyan-300/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
      <div className="flex h-full flex-col bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800">
        <div className="h-2 shrink-0 border-b border-black/30 bg-[repeating-linear-gradient(90deg,#334155_0px,#334155_2px,transparent_2px,transparent_4px)]" />

        <div className="flex flex-1 items-center gap-2 px-2">
          <div className="flex flex-col gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          </div>

          <div className="min-w-0">
            <span className="block truncate text-[9px] font-medium uppercase tracking-wide text-slate-200">
              {t("rack.allocated", { units: heightU })}
            </span>
            <span className="block font-mono text-[8px] text-cyan-300/80">
              U{startU}–U{endU}
            </span>
          </div>

          <div className="ml-auto h-6 w-1.5 shrink-0 rounded-sm border border-slate-500/60 bg-slate-900/60" />
        </div>

        <div className="h-2 shrink-0 border-t border-black/30 bg-[repeating-linear-gradient(90deg,#334155_0px,#334155_2px,transparent_2px,transparent_4px)]" />
      </div>
    </div>
  );
}
