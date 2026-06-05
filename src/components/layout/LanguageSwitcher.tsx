"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-1 rounded-[var(--radius)] border border-card-border bg-background px-2 py-1 font-mono-label text-xs">
      {(["en", "de"] as const).map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-card-border">/</span>}
          <button
            type="button"
            onClick={() => switchLocale(loc)}
            className={
              locale === loc
                ? "rounded px-1.5 py-0.5 font-medium text-accent-deep"
                : "rounded px-1.5 py-0.5 text-muted transition hover:text-accent-deep"
            }
            aria-current={locale === loc ? "true" : undefined}
            aria-label={t(loc)}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
