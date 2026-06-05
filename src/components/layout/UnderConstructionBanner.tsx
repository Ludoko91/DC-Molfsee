"use client";

import { useTranslations } from "next-intl";

export function UnderConstructionBanner() {
  const t = useTranslations("construction");

  return (
    <div
      role="status"
      className="border-b border-warning/30 bg-warning/10"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-warning/40 bg-warning/15 px-2.5 py-0.5 font-mono-label text-[10px] font-medium uppercase tracking-wider text-warning">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
          {t("banner")}
        </span>
        <p className="text-sm text-foreground-soft">{t("bannerDetail")}</p>
      </div>
    </div>
  );
}
