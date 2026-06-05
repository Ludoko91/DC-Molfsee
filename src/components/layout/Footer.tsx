"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "./LogoMark";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-card-border bg-[var(--background-2)]">
      <div className="mx-auto max-w-[1280px] px-6 py-14 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <LogoMark />
              <span className="text-sm font-semibold text-accent-deep">{tNav("brand")}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="font-mono-label text-[11px] uppercase tracking-wider text-accent-muted">
              {t("navTitle")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={{ pathname: "/", hash: "facility" }} className="text-muted transition hover:text-accent-deep">
                  {tNav("facility")}
                </Link>
              </li>
              <li>
                <Link href={{ pathname: "/", hash: "pricing" }} className="text-muted transition hover:text-accent-deep">
                  {tNav("pricing")}
                </Link>
              </li>
              <li>
                <Link href="/configure" className="text-muted transition hover:text-accent-deep">
                  {tNav("configure")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-label text-[11px] uppercase tracking-wider text-accent-muted">
              {t("contactTitle")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <a href={`mailto:${t("contact")}`} className="transition hover:text-accent-deep">
                  {t("contact")}
                </a>
              </li>
              <li>
                <Link href="/impressum" className="transition hover:text-accent-deep">
                  {t("impressum")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-card-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono-label text-xs text-muted">{t("copyright", { year })}</p>
          <p className="text-xs text-muted">{t("partOf")}</p>
        </div>
      </div>
    </footer>
  );
}
