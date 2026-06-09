"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type WizardStep = 1 | 2 | 3 | 4;

const STEPS: WizardStep[] = [1, 2, 3, 4];

const STEP_KEYS = ["size", "power", "feeds", "review"] as const;

type Props = {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
};

export function ConfigureProgressBar({ currentStep, onStepClick }: Props) {
  const t = useTranslations("configure.wizard");

  return (
    <div className="sticky top-[148px] z-40 border-b border-card-border bg-background/95 py-4 backdrop-blur-md sm:top-[140px] max-sm:top-[188px]">
      <p className="mb-3 text-center text-xs text-muted sm:hidden">
        {t("stepOf", { current: currentStep, total: STEPS.length })}
      </p>

      <div className="mx-auto flex w-full max-w-6xl items-start px-6 sm:px-10">
        {STEPS.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isUpcoming = step > currentStep;
          const isClickable = isCompleted;
          const label = t(`steps.${STEP_KEYS[index]}`);

          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors",
                      isCompleted || isActive ? "bg-accent" : "bg-[var(--background-3)]",
                    )}
                  />
                )}

                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted &&
                      "border-accent bg-accent text-white hover:bg-accent-deep cursor-pointer",
                    isActive && "border-accent bg-background text-accent ring-4 ring-accent/20",
                    isUpcoming &&
                      "border-[var(--background-3)] bg-background text-muted cursor-default",
                    !isClickable && !isActive && "cursor-default",
                  )}
                >
                  {isCompleted ? (
                    <svg
                      aria-hidden
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    step
                  )}
                </button>

                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors",
                      isCompleted ? "bg-accent" : "bg-[var(--background-3)]",
                    )}
                  />
                )}
              </div>

              <span
                className={cn(
                  "mt-2 hidden max-w-[5.5rem] text-center text-[11px] leading-tight sm:block",
                  isActive && "font-medium text-foreground",
                  isCompleted && "text-foreground-muted",
                  isUpcoming && "text-muted",
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-center text-xs font-medium text-foreground sm:hidden">
        {t(`steps.${STEP_KEYS[currentStep - 1]}`)}
      </p>
    </div>
  );
}
