"use client";

import { useTranslations } from "next-intl";
import {
  FULL_RACK_PRICE_EUR,
  HALF_RACK_PRICE_EUR,
  HALF_RACK_UNITS,
  PER_U_PRICE_EUR,
  RACK_HEIGHT_U,
} from "@/lib/rack/types";

const TIER_KEYS = ["perU", "half", "full"] as const;

export function PricingSection() {
  const t = useTranslations("landing.pricing");

  const tierMeta = {
    perU: { price: PER_U_PRICE_EUR },
    half: { price: HALF_RACK_PRICE_EUR },
    full: { price: FULL_RACK_PRICE_EUR },
  };

  return (
    <section id="pricing" className="section-alt section-padding">
      <div className="max-w-3xl">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">{t("lede")}</p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {TIER_KEYS.map((key) => {
          const meta = tierMeta[key];
          const isPopular = key === "half";
          return (
            <div
              key={key}
              className={`card-surface rounded-[var(--radius)] p-8 transition ${
                isPopular ? "card-surface-featured" : ""
              }`}
            >
              <div className="mb-4 flex h-7 items-center">
                {isPopular ? (
                  <span className="badge-featured">{t("popular")}</span>
                ) : null}
              </div>
              <div className="font-mono-label text-sm text-muted">{t(`tiers.${key}.size`)}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl text-accent-deep">{meta.price}</span>
                <span className="font-mono-label text-sm text-muted">€ / {t("month")}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{t(`tiers.${key}.note`)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {(["power", "bandwidth", "ipv4"] as const).map((key) => (
          <div
            key={key}
            className="rounded-[var(--radius)] border border-card-border bg-background/80 p-6"
          >
            <div className="font-mono-label text-[11px] uppercase tracking-wide text-accent-muted">
              {t(`extras.${key}.label`)}
            </div>
            <div className="mt-2 text-lg font-semibold text-accent-deep">
              {t(`extras.${key}.value`)}
            </div>
            <p className="mt-1 text-sm text-muted">{t(`extras.${key}.note`)}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 font-mono-label text-xs text-muted">
        {t("footnote", {
          perU: PER_U_PRICE_EUR,
          half: HALF_RACK_PRICE_EUR,
          halfU: HALF_RACK_UNITS,
          full: FULL_RACK_PRICE_EUR,
          fullU: RACK_HEIGHT_U,
        })}
      </p>
    </section>
  );
}
