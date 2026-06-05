"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogoMark } from "./LogoMark";
import { cn } from "@/lib/utils";

const sectionHashes = ["facility", "pricing", "location"] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isConfigure =
    pathname === "/configure" || pathname.startsWith("/configure/");

  const sectionLabels: Record<(typeof sectionHashes)[number], string> = {
    facility: t("facility"),
    pricing: t("pricing"),
    location: t("location"),
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-card-border bg-[var(--accent-light)]/60">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs text-muted sm:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <a href={`mailto:${t("email")}`} className="transition hover:text-accent-deep">
              {t("email")}
            </a>
            <span className="hidden text-card-border sm:inline">·</span>
            <span className="hidden sm:inline">{t("hours")}</span>
          </div>
          <span className="font-mono-label text-[10px] uppercase tracking-wider text-accent-muted">
            {t("availability")}
          </span>
        </div>
      </div>

      <div className="border-b border-card-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <LogoMark />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-tight text-accent-deep">
                {t("brand")}
              </span>
              <span className="font-mono-label text-[10px] text-muted">{t("coords")}</span>
            </div>
          </Link>

          <nav className="hidden items-center justify-center gap-7 md:flex">
            {sectionHashes.map((hash) => (
              <Link
                key={hash}
                href={{ pathname: "/", hash }}
                className="text-sm text-foreground/75 transition hover:text-accent-deep"
              >
                {sectionLabels[hash]}
              </Link>
            ))}
            <Link
              href="/configure"
              className={cn(
                "text-sm font-medium transition hover:text-accent-deep",
                isConfigure ? "text-accent-deep" : "text-foreground/75",
              )}
            >
              {t("configure")}
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link href="/configure" className="btn-primary hidden text-sm sm:inline-flex">
              {t("book")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
