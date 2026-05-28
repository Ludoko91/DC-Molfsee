import { getTranslations, setRequestLocale } from "next-intl/server";
import { RackBuilder } from "@/components/rack/RackBuilder";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ConfigureHeader />
      <RackBuilder />
    </div>
  );
}

async function ConfigureHeader() {
  const t = await getTranslations("configure");

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("subtitle")}</p>
    </div>
  );
}
