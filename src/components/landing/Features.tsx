"use client";

import { useTranslations } from "next-intl";
import { Shield, Zap, Network, Headphones } from "lucide-react";

const featureKeys = ["power", "connectivity", "security", "support"] as const;
const icons = {
  power: Zap,
  connectivity: Network,
  security: Shield,
  support: Headphones,
};

export function Features() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="border-b border-card-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white">{t("title")}</h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureKeys.map((key) => {
            const Icon = icons[key];
            return (
              <article
                key={key}
                className="rounded-xl border border-card-border bg-card p-6 transition hover:border-accent/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{t(`${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`${key}.description`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
