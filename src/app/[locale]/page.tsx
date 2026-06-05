import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/landing/Hero";
import { FacilitySection } from "@/components/landing/FacilitySection";
import { PricingSection } from "@/components/landing/PricingSection";
import { LocationSection } from "@/components/landing/LocationSection";
import { CtaSection } from "@/components/landing/CtaSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FacilitySection />
      <PricingSection />
      <LocationSection />
      <CtaSection />
    </>
  );
}
