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
      <div className="mx-auto w-full max-w-3xl">
        <div className="card-surface p-8 md:p-10">
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="font-display text-3xl tracking-tight text-accent-deep md:text-4xl">
            {t("title")}
          </h1>

          <div className="prose-cn mt-8">
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
