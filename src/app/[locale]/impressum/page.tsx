import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impressum" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "impressum" });

  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm md:p-10">
          <p className="font-mono-label text-xs text-muted">{t("eyebrow")}</p>
          <h1 className="mt-3 text-balance font-serif-display text-3xl tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h1>

          <div className="prose prose-invert mt-8 max-w-none prose-p:text-foreground/80">
            <h2>{t("provider.title")}</h2>
            <p>{t("provider.body")}</p>

            <h2>{t("contact.title")}</h2>
            <p>{t("contact.body")}</p>

            <h2>{t("vat.title")}</h2>
            <p>{t("vat.body")}</p>

            <h2>{t("disclaimer.title")}</h2>
            <p>{t("disclaimer.body")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

