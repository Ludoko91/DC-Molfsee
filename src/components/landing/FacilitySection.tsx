"use client";

import { useTranslations } from "next-intl";

const CARD_KEYS = ["power", "cooling", "network", "access"] as const;

export function FacilitySection() {
  const t = useTranslations("landing.facility");

  return (
    <section id="facility" className="section-padding bg-background">
      <div className="max-w-3xl">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">{t("lede")}</p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_KEYS.map((key, i) => (
          <article
            key={key}
            className="card-surface group p-7 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-light)] font-mono-label text-xs text-accent-deep">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="mt-5 font-mono-label text-[11px] uppercase tracking-wider text-accent-muted">
              {t(`cards.${key}.tag`)}
            </div>
            <div className="mt-2 text-xl font-semibold tracking-tight text-accent-deep">
              {t(`cards.${key}.value`)}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t(`cards.${key}.note`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
