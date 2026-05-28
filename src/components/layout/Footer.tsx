"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-card-border bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="text-sm text-foreground/80">{t("tagline")}</p>
          <p className="mt-2 font-mono-label text-xs text-muted">
            {t("copyright", { year })}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <p className="font-mono-label text-xs text-muted">{t("contact")}</p>
          <Link
            href="/impressum"
            className="font-mono-label text-xs text-muted transition hover:text-foreground/80"
          >
            {t("impressum")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
