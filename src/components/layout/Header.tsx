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
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
          <LogoMark className="text-foreground" />
          <div className="flex flex-col">
            <span className="text-[15px] font-medium tracking-tight">{t("brand")}</span>
            <span className="font-mono-label text-[10px] text-muted">{t("coords")}</span>
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {sectionHashes.map((hash) => (
            <Link
              key={hash}
              href={{ pathname: "/", hash }}
              className="text-sm text-foreground/80 transition hover:text-foreground"
            >
              {sectionLabels[hash]}
            </Link>
          ))}
          <Link
            href="/configure"
            className={cn(
              "text-sm transition hover:text-accent-deep",
              isConfigure ? "text-accent-deep" : "text-foreground/80",
            )}
          >
            {t("configure")}
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-4">
          <Link href="/configure" className="btn-primary hidden text-sm sm:inline-flex">
            {t("book")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
