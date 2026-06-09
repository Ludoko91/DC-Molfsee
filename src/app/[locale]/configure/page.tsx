import { getTranslations, setRequestLocale } from "next-intl/server";
import { RackConfiguratorWizard } from "@/components/rack/RackConfiguratorWizard";

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
      <div className="section-padding !pb-10 !pt-4">
        <RackConfiguratorWizard />
      </div>
    </div>
  );
}
