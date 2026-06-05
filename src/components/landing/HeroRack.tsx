"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  DEFAULT_MAX_POWER_KW,
  DEFAULT_NEEDED_UNITS,
  DEFAULT_POWER_FEEDS,
  type RackConfig,
} from "@/lib/rack/types";
import {
  RACK_CAMERA_FOV,
  RACK_CAMERA_LOOK_Y,
  RACK_CAMERA_Z,
  RackScene3D,
} from "@/components/rack/RackScene3D";

const HERO_RACK: RackConfig = {
  id: "hero-preview",
  name: "Preview",
  neededUnits: DEFAULT_NEEDED_UNITS,
  maxPowerKw: DEFAULT_MAX_POWER_KW,
  powerFeeds: DEFAULT_POWER_FEEDS,
};

export function HeroRack() {
  const rack = useMemo(() => HERO_RACK, []);

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="card-surface relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-light) 0%, transparent 50%, var(--sea) 100%)",
          }}
        />

        <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] border border-card-border bg-[#0b1220] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 50% 35%, rgba(34,211,238,0.14) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(13,92,92,0.25) 0%, transparent 55%)",
            }}
          />
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
        </div>
      </div>
    </div>
  );
}
