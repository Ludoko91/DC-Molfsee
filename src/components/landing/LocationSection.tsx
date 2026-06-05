"use client";

import { useTranslations } from "next-intl";
import { LocationMap } from "./LocationMap";

export function LocationSection() {
  const t = useTranslations("landing.location");
  const addressLines = [0, 1, 2, 3] as const;

  return (
    <section id="location" className="section-padding bg-background">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="eyebrow">{t("eyebrow")}</div>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground-muted">{t("lede")}</p>
          <address className="mt-8 space-y-1 rounded-[var(--radius)] border border-card-border bg-[var(--accent-light)]/40 p-5 font-mono-label not-italic text-sm leading-relaxed text-foreground-soft">
            {addressLines.map((i) => (
              <div key={i}>{t(`address.${i}`)}</div>
            ))}
          </address>
        </div>
        <div className="aspect-[6/5] min-h-[320px]">
          <LocationMap />
        </div>
      </div>
    </section>
  );
}
