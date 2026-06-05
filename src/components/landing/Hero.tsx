"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroRack } from "./HeroRack";

export function Hero() {
  const t = useTranslations("landing.hero");

  const stats = [
    { label: t("stats.facility.label"), value: t("stats.facility.value") },
    { label: t("stats.location.label"), value: t("stats.location.value") },
    { label: t("stats.available.label"), value: t("stats.available.value") },
    { label: t("stats.from.label"), value: t("stats.from.value") },
  ];

  return (
    <section className="hero-scene relative">
      <HeroBackdrop />

      <div className="section-padding relative pb-20 pt-14">
        <div className="grid min-h-[520px] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <div className="badge">{t("eyebrow")}</div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-foreground sm:text-6xl lg:text-[4.5rem]">
              {t("title1")}{" "}
              <em className="font-display not-italic text-accent">{t("title2")}</em>
              <br />
              {t("title3")}
            </h1>
            <p className="mt-4 text-lg font-medium text-accent">{t("tagline")}</p>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed text-foreground-muted sm:text-lg">
              {t("lede")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/configure" className="btn-primary">
                {t("cta")}
                <span aria-hidden>→</span>
              </Link>
              <a href="#pricing" className="btn-ghost">
                {t("secondary")}
              </a>
            </div>
          </div>

          <HeroRack />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 rounded-[var(--radius)] border border-card-border bg-background/80 p-6 backdrop-blur-sm sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-mono-label text-[10px] uppercase tracking-wider text-accent-muted">
                {stat.label}
              </div>
              <div className="mt-1.5 text-lg font-semibold tracking-tight text-accent-deep sm:text-xl">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
