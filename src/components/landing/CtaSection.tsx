"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaSection() {
  const t = useTranslations("landing.cta");

  return (
    <section className="section-padding">
      <div className="relative overflow-hidden rounded-[var(--radius)] border border-card-border bg-gradient-to-br from-[var(--accent)] to-[var(--accent-deep)] px-8 py-16 text-center shadow-[var(--shadow-lg)] sm:px-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, white 0%, transparent 40%), radial-gradient(circle at 80% 20%, var(--sun) 0%, transparent 35%)",
          }}
        />
        <div className="relative">
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            {t("lede")}
          </p>
          <Link
            href="/configure"
            className="mt-10 inline-flex items-center gap-2 rounded-[var(--radius)] bg-white px-8 py-4 text-base font-semibold text-accent-deep shadow-md transition hover:bg-[var(--accent-light)]"
          >
            {t("button")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
