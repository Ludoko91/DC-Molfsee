import { getTranslations, setRequestLocale } from "next-intl/server";
import { RackBuilder } from "@/components/rack/RackBuilder";
import { ConstructionNotice } from "@/components/rack/ConstructionNotice";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "configure" });

  return {
    title: t("title"),
  };
}

export default async function ConfigurePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="page-header">
      <div className="section-padding !pb-10 !pt-10">
        <ConfigureHeader />
        <ConstructionNotice />
        <RackBuilder />
      </div>
    </div>
  );
}

async function ConfigureHeader() {
  const t = await getTranslations("configure");

  return (
    <div className="mb-10 max-w-2xl">
      <div className="eyebrow">{t("title")}</div>
      <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-foreground-muted">{t("subtitle")}</p>
    </div>
  );
}
