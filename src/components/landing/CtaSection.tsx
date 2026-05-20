"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const t = useTranslations("landing.cta");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-card to-card p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-muted">{t("subtitle")}</p>
          <Link
            href="/configure"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent-muted"
          >
            {t("button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
