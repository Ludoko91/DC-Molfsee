"use client";

import { useTranslations } from "next-intl";

export function ConstructionNotice() {
  const t = useTranslations("construction");

  return (
    <div
      role="note"
      className="mb-8 rounded-[var(--radius)] border border-warning/35 bg-warning/10 px-5 py-4"
    >
      <p className="font-mono-label text-[11px] font-medium uppercase tracking-wider text-warning">
        {t("configuratorTitle")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground-soft">
        {t("configuratorBody")}
      </p>
    </div>
  );
}
