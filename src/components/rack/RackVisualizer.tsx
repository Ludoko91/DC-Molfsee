"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import { getAllocatedStartU } from "@/lib/rack/calculations";
import { RACK_HEIGHT_U, type RackConfig } from "@/lib/rack/types";
import {
  RACK_CAMERA_FOV,
  RACK_CAMERA_LOOK_Y,
  RACK_CAMERA_Z,
  RackScene3D,
} from "./RackScene3D";

type Props = {
  rack: RackConfig;
};

function RackCanvas({ rack }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, RACK_CAMERA_LOOK_Y, RACK_CAMERA_Z],
        fov: RACK_CAMERA_FOV,
        near: 0.1,
        far: 20,
      }}
      onCreated={({ camera }) => {
        camera.lookAt(0, RACK_CAMERA_LOOK_Y, 0);
      }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <RackScene3D rack={rack} />
      </Suspense>
    </Canvas>
  );
}

export function RackVisualizer({ rack }: Props) {
  const t = useTranslations("configure");
  const startU = getAllocatedStartU(rack.neededUnits);
  const endU = startU + rack.neededUnits - 1;

  return (
    <div className="card-surface p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-foreground">
          {t("rack.title")} — {rack.name}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {rack.neededUnits > 0
            ? t("rack.schematicCentered", { start: startU, end: endU })
            : t("rack.schematic")}
        </p>
      </div>

      <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--radius)] border border-card-border bg-[#0b1220]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(34,211,238,0.14) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(13,92,92,0.25) 0%, transparent 55%)",
          }}
        />
        <RackCanvas rack={rack} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-4 pb-3 pt-8">
          <div className="flex items-end justify-between text-[10px] text-slate-400">
            <span>{t("rack.bottom")}</span>
            <span className="rounded-full border border-slate-600/60 bg-slate-900/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-300">
              {t("rack.cabinetLabel", { height: RACK_HEIGHT_U })}
            </span>
            <span>{t("rack.top")}</span>
          </div>
        </div>
      </div>

      {rack.neededUnits > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>
            {t("rack.allocated", { units: rack.neededUnits })} · U{startU}–U{endU}
          </span>
        </div>
      )}
    </div>
  );
}
