"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MAX_RACKS } from "@/lib/rack/types";
import { cn } from "@/lib/utils";
import { useRackConfig } from "@/lib/rack/useRackConfig";
import { ConfigureProgressBar, type WizardStep } from "./ConfigureProgressBar";
import { ConfigurationStepPanel, type ConfigurationStep } from "./ConfigurationStepPanel";
import { ConstructionNotice } from "./ConstructionNotice";
import { WizardRackSidebar } from "./WizardRackSidebar";
import { WizardSummary } from "./WizardSummary";
import { TotalOverview } from "./TotalOverview";

const WIZARD_WIDTH = "mx-auto w-full max-w-6xl";
const WIZARD_GRID =
  "grid gap-4 sm:gap-6 lg:grid-cols-[12rem_minmax(0,1fr)_17.5rem] lg:items-start";

const STEP_TO_PANEL: Record<1 | 2 | 3, ConfigurationStep> = {
  1: "size",
  2: "power",
  3: "feeds",
};

const DESCRIPTION_KEYS = {
  1: "sizeDescription",
  2: "powerDescription",
  3: "feedsDescription",
} as const;

const STEP_LABEL_KEYS = {
  1: "size",
  2: "power",
  3: "feeds",
} as const;

type WizardContentProps = {
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
  racks: ReturnType<typeof useRackConfig>["racks"];
  activeRack: ReturnType<typeof useRackConfig>["activeRack"];
  activeRackId: ReturnType<typeof useRackConfig>["activeRackId"];
  dispatch: ReturnType<typeof useRackConfig>["dispatch"];
};

function WizardContent({
  currentStep,
  onStepChange,
  racks,
  activeRack,
  activeRackId,
  dispatch,
}: WizardContentProps) {
  const t = useTranslations("configure.wizard");
  const canAdd = racks.length < MAX_RACKS;
  const isReview = currentStep === 4;

  function goBack() {
    if (currentStep > 1) onStepChange((currentStep - 1) as WizardStep);
  }

  function goNext() {
    if (currentStep < 4) onStepChange((currentStep + 1) as WizardStep);
  }

  const sidebar = (
    <WizardRackSidebar
      racks={racks}
      activeRackId={activeRackId}
      canAdd={canAdd}
      onSelectRack={(rackId) => dispatch({ type: "SET_ACTIVE_RACK", rackId })}
      onAddRack={() => dispatch({ type: "ADD_RACK" })}
      onRemoveRack={(rackId) => dispatch({ type: "REMOVE_RACK", rackId })}
    />
  );

  const summary = (
    <WizardSummary
      racks={racks}
      activeRack={activeRack}
      currentStep={currentStep}
      className={isReview ? "lg:col-span-2" : undefined}
    />
  );

  const stepTitle = isReview ? (
    <>
      <h2 className="font-display text-2xl text-foreground">{t("steps.review")}</h2>
      <p className="mt-2 text-sm text-muted">{t("reviewDescription")}</p>
    </>
  ) : (
    <>
      <h2 className="font-display text-2xl text-foreground">
        {t(`steps.${STEP_LABEL_KEYS[currentStep]}`)}
      </h2>
      <p className="mt-2 text-sm text-muted">{t(DESCRIPTION_KEYS[currentStep])}</p>
    </>
  );

  return (
    <div className="space-y-6">
      <div className={WIZARD_WIDTH}>{stepTitle}</div>

      <div className={cn(WIZARD_WIDTH, WIZARD_GRID)}>
        {sidebar}

        {!isReview && (
          <div className="card-surface min-w-0 p-5 sm:p-6">
            <ConfigurationStepPanel
              step={STEP_TO_PANEL[currentStep]}
              rack={activeRack}
              onSetNeededUnits={(neededUnits) =>
                dispatch({ type: "SET_NEEDED_UNITS", rackId: activeRack.id, neededUnits })
              }
              onSetMaxPowerKw={(maxPowerKw) =>
                dispatch({ type: "SET_MAX_POWER_KW", rackId: activeRack.id, maxPowerKw })
              }
              onSetPowerFeeds={(powerFeeds) =>
                dispatch({ type: "SET_POWER_FEEDS", rackId: activeRack.id, powerFeeds })
              }
            />
          </div>
        )}

        {summary}
      </div>

      {isReview && (
        <div className={WIZARD_WIDTH}>
          <TotalOverview racks={racks} className="mt-0" />
        </div>
      )}

      <div className={cn(WIZARD_WIDTH, "flex items-center justify-between gap-4")}>
        {currentStep > 1 ? (
          <button type="button" onClick={goBack} className="btn-ghost">
            {t("back")}
          </button>
        ) : (
          <Link href="/configure/classic" className="text-sm text-muted transition hover:text-accent-deep">
            {t("classicLink")}
          </Link>
        )}

        {!isReview && (
          <button type="button" onClick={goNext} className="btn-primary">
            {t("next")}
          </button>
        )}

        {isReview && (
          <Link href="/configure/classic" className="text-sm text-muted transition hover:text-accent-deep">
            {t("classicLink")}
          </Link>
        )}
      </div>
    </div>
  );
}

function ConfigureWizardHeader() {
  const t = useTranslations("configure");

  return (
    <div className={cn(WIZARD_WIDTH, "mb-8")}>
      <div className="eyebrow">{t("title")}</div>
      <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-base text-foreground-muted">{t("wizard.subtitle")}</p>
    </div>
  );
}

export function RackConfiguratorWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const { racks, activeRack, activeRackId, dispatch } = useRackConfig({
    independentMultiRack: true,
  });

  function handleStepClick(step: WizardStep) {
    if (step < currentStep) setCurrentStep(step);
  }

  return (
    <div>
      <ConfigureProgressBar currentStep={currentStep} onStepClick={handleStepClick} />
      <div className="mt-8">
        <ConfigureWizardHeader />
        <div className={WIZARD_WIDTH}>
          <ConstructionNotice />
        </div>
        <WizardContent
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          racks={racks}
          activeRack={activeRack}
          activeRackId={activeRackId}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
