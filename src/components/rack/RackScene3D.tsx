"use client";

import { useMemo } from "react";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import { decomposeNeededUnits, getAllocatedStartU } from "@/lib/rack/calculations";
import { RACK_HEIGHT_U, type RackConfig } from "@/lib/rack/types";

const UNIT_H = 0.038;
const TOTAL_H = RACK_HEIGHT_U * UNIT_H;
const WIDTH = 0.58;
const DEPTH = 0.72;
const RAIL_W = 0.028;
const FRAME = 0.018;

const CABINET = "#334155";
const CABINET_LIGHT = "#475569";
const CABINET_DARK = "#1e293b";
const ACCENT = "#0d5c5c";
const ACCENT_GLOW = "#22d3ee";
const SELECTED_LIGHT = "#4ade80";
const SELECTED_DARK = "#15803d";
const DIVIDER = "#cbd5e1";
const DIVIDER_DARK = "#060b12";
const BAY_WIDTH = WIDTH + FRAME * 4;
const RACK_PITCH = BAY_WIDTH;
const BAY_DIVIDER_X = RACK_PITCH / 2;

type Props = {
  rack: RackConfig;
};

type RackAssemblyProps = {
  rack?: RackConfig;
  empty?: boolean;
  highlighted?: boolean;
  connectedLeft?: boolean;
  connectedRight?: boolean;
};

function RackFrame({
  dimmed = false,
  highlighted = false,
  connectedLeft = false,
  connectedRight = false,
  inRow = false,
}: {
  dimmed?: boolean;
  highlighted?: boolean;
  connectedLeft?: boolean;
  connectedRight?: boolean;
  inRow?: boolean;
}) {
  const halfW = WIDTH / 2;
  const halfD = DEPTH / 2;
  const cabinet = dimmed ? "#243040" : CABINET;
  const cabinetLight = dimmed ? "#334155" : CABINET_LIGHT;
  const cabinetDark = dimmed ? "#141d29" : CABINET_DARK;

  const corners = (
    [
      [-halfW, halfD, connectedLeft],
      [halfW, halfD, connectedRight],
      [-halfW, -halfD, connectedLeft],
      [halfW, -halfD, connectedRight],
    ] as const
  ).filter(([, , hidden]) => !hidden);

  return (
    <group>
      {/* Corner posts */}
      {corners.map(([x, z], i) => (
        <mesh key={i} position={[x, TOTAL_H / 2, z]} castShadow>
          <boxGeometry args={[FRAME * 2.2, TOTAL_H, FRAME * 2.2]} />
          <meshStandardMaterial color={cabinetDark} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}

      {!inRow && (
        <>
          {/* Top cap */}
          <mesh position={[0, TOTAL_H + FRAME, 0]} castShadow>
            <boxGeometry args={[WIDTH + FRAME * 4, FRAME * 2.5, DEPTH + FRAME * 4]} />
            <meshStandardMaterial
              color={highlighted ? ACCENT : cabinetLight}
              metalness={0.5}
              roughness={0.4}
              emissive={highlighted ? ACCENT : "#000000"}
              emissiveIntensity={highlighted ? 0.12 : 0}
            />
          </mesh>

          {/* Bottom plinth */}
          <mesh position={[0, -FRAME * 1.2, 0]} receiveShadow>
            <boxGeometry args={[WIDTH + FRAME * 3, FRAME * 2, DEPTH + FRAME * 3]} />
            <meshStandardMaterial color={cabinetDark} metalness={0.45} roughness={0.5} />
          </mesh>

          {/* Back panel */}
          <mesh position={[0, TOTAL_H / 2, -halfD - FRAME / 2]} castShadow>
            <boxGeometry args={[WIDTH, TOTAL_H, FRAME]} />
            <meshStandardMaterial color={cabinet} metalness={0.35} roughness={0.55} />
          </mesh>
        </>
      )}

      {/* Side panels */}
      {!connectedLeft && (
        <mesh position={[-halfW - FRAME / 2, TOTAL_H / 2, 0]} castShadow>
          <boxGeometry args={[FRAME, TOTAL_H, DEPTH]} />
          <meshStandardMaterial color={cabinet} metalness={0.4} roughness={0.5} />
        </mesh>
      )}
      {!connectedRight && (
        <mesh position={[halfW + FRAME / 2, TOTAL_H / 2, 0]} castShadow>
          <boxGeometry args={[FRAME, TOTAL_H, DEPTH]} />
          <meshStandardMaterial color={cabinet} metalness={0.4} roughness={0.5} />
        </mesh>
      )}

      {highlighted && (
        <mesh position={[0, TOTAL_H / 2, DEPTH / 2 + 0.004]}>
          <boxGeometry args={[WIDTH + 0.02, TOTAL_H + 0.02, 0.004]} />
          <meshStandardMaterial
            color={ACCENT_GLOW}
            emissive={ACCENT_GLOW}
            emissiveIntensity={0.25}
            transparent
            opacity={0.35}
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

function MountingRail({ x, dimmed = false }: { x: number; dimmed?: boolean }) {
  const holes = useMemo(
    () =>
      Array.from({ length: RACK_HEIGHT_U }, (_, i) => ({
        y: (i + 0.5) * UNIT_H,
        key: i,
      })),
    [],
  );

  return (
    <group position={[x, 0, DEPTH / 2 - 0.01]}>
      <mesh castShadow>
        <boxGeometry args={[RAIL_W, TOTAL_H, 0.012]} />
        <meshStandardMaterial
          color={dimmed ? "#2d3f52" : CABINET_LIGHT}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>
      {holes.map(({ y, key }) => (
        <mesh key={key} position={[0, y, 0.008]}>
          <sphereGeometry args={[0.003, 6, 6]} />
          <meshStandardMaterial color={CABINET_DARK} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function UnitGuides({
  occupiedUnits,
  dimmed = false,
}: {
  occupiedUnits: Set<number>;
  dimmed?: boolean;
}) {
  const lines = useMemo(
    () =>
      Array.from({ length: RACK_HEIGHT_U + 1 }, (_, i) => ({
        y: i * UNIT_H,
        isMajor: i % 5 === 0 || i === 0 || i === RACK_HEIGHT_U,
        unit: i + 1,
      })),
    [],
  );

  const bayW = WIDTH - RAIL_W * 2 - 0.04;

  return (
    <group position={[0, 0, DEPTH / 2 - 0.02]}>
      {lines.map(({ y, isMajor, unit }) => {
        const isOccupied = occupiedUnits.has(unit) || occupiedUnits.has(unit - 1);
        if (isOccupied) return null;
        return (
          <mesh key={unit} position={[0, y, 0]}>
            <boxGeometry args={[bayW, 0.001, 0.001]} />
            <meshBasicMaterial
              color={isMajor ? (dimmed ? "#2d3a4a" : "#475569") : (dimmed ? "#141d29" : "#1e293b")}
              transparent
              opacity={isMajor ? (dimmed ? 0.35 : 0.55) : (dimmed ? 0.15 : 0.25)}
            />
          </mesh>
        );
      })}
    </group>
  );
}

const EQUIPMENT_GAP = 0.003;
const FRONT_METAL = "#9aaab8";
const FRONT_METAL_DARK = "#6e7f8f";
const FRONT_METAL_HIGHLIGHT = "#c8d4e0";
const EQUIPMENT_MATTE = {
  metalness: 0.35,
  roughness: 0.72,
  envMapIntensity: 0,
  transparent: false as const,
  opacity: 1,
};

function EquipmentBlock({
  startU,
  heightU,
}: {
  startU: number;
  heightU: number;
}) {
  const blockH = heightU * UNIT_H - EQUIPMENT_GAP * 2;
  const blockY = (startU - 1) * UNIT_H + blockH / 2 + EQUIPMENT_GAP;
  const blockW = WIDTH - RAIL_W * 2 - 0.06;
  const blockD = DEPTH * 0.55;
  const showVents = heightU >= 2;
  const showSecondaryLeds = heightU >= 2;
  const ledScale = Math.min(1, heightU / 2);

  return (
    <group position={[0, blockY, DEPTH / 2 - blockD / 2 - 0.02]}>
      <RoundedBox
        args={[blockW, blockH, blockD]}
        radius={Math.min(0.006, blockH * 0.15)}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={SELECTED_DARK}
          emissive="#000000"
          {...EQUIPMENT_MATTE}
        />
      </RoundedBox>

      {/* Opaque brushed-metal front bezel */}
      <mesh position={[0, 0, blockD / 2 + 0.004]} castShadow receiveShadow>
        <boxGeometry args={[blockW - 0.02, blockH - 0.02, 0.012]} />
        <meshStandardMaterial
          color={FRONT_METAL}
          emissive="#000000"
          depthWrite
          {...EQUIPMENT_MATTE}
        />
      </mesh>

      {/* Front bezel edge trim */}
      <mesh position={[0, blockH / 2 - 0.003, blockD / 2 + 0.01]}>
        <boxGeometry args={[blockW - 0.03, 0.004, 0.003]} />
        <meshStandardMaterial color={FRONT_METAL_HIGHLIGHT} emissive="#000000" {...EQUIPMENT_MATTE} />
      </mesh>
      <mesh position={[0, -blockH / 2 + 0.003, blockD / 2 + 0.01]}>
        <boxGeometry args={[blockW - 0.03, 0.004, 0.003]} />
        <meshStandardMaterial color={FRONT_METAL_DARK} emissive="#000000" {...EQUIPMENT_MATTE} />
      </mesh>

      {showVents && (
        <>
          <mesh position={[0, blockH / 2 - 0.012, blockD / 2 + 0.011]}>
            <boxGeometry args={[blockW - 0.04, Math.min(0.014, blockH * 0.2), 0.003]} />
            <meshStandardMaterial color={FRONT_METAL_DARK} emissive="#000000" {...EQUIPMENT_MATTE} />
          </mesh>
          <mesh position={[0, -blockH / 2 + 0.012, blockD / 2 + 0.011]}>
            <boxGeometry args={[blockW - 0.04, Math.min(0.014, blockH * 0.2), 0.003]} />
            <meshStandardMaterial color={FRONT_METAL_DARK} emissive="#000000" {...EQUIPMENT_MATTE} />
          </mesh>
        </>
      )}

      {/* Status LEDs */}
      <mesh position={[-blockW / 2 + 0.03, 0, blockD / 2 + 0.012]}>
        <sphereGeometry args={[0.006 * ledScale, 12, 12]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={1.2}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      {showSecondaryLeds && (
        <>
          <mesh position={[-blockW / 2 + 0.05, 0.018 * ledScale, blockD / 2 + 0.012]}>
            <sphereGeometry args={[0.004 * ledScale, 12, 12]} />
            <meshStandardMaterial
              color={SELECTED_LIGHT}
              emissive={SELECTED_LIGHT}
              emissiveIntensity={0.9}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-blockW / 2 + 0.05, -0.018 * ledScale, blockD / 2 + 0.012]}>
            <sphereGeometry args={[0.004 * ledScale, 12, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.5} />
          </mesh>
        </>
      )}

      {/* Handle accent strip */}
      <mesh position={[blockW / 2 - 0.01, 0, blockD / 2 + 0.011]}>
        <boxGeometry args={[0.006, Math.max(blockH - 0.04, blockH * 0.5), 0.003]} />
        <meshStandardMaterial color={FRONT_METAL_HIGHLIGHT} emissive="#000000" {...EQUIPMENT_MATTE} />
      </mesh>
    </group>
  );
}

function RackAssembly({
  rack,
  empty = false,
  highlighted = false,
  connectedLeft = false,
  connectedRight = false,
}: RackAssemblyProps) {
  const halfW = WIDTH / 2;
  const startU = rack ? getAllocatedStartU(rack.neededUnits) : 0;

  const occupiedUnits = useMemo(() => {
    const set = new Set<number>();
    if (!rack || empty) return set;
    for (let u = startU; u < startU + rack.neededUnits; u++) {
      set.add(u);
    }
    return set;
  }, [rack, empty, startU]);

  const equipmentBlocks = useMemo(() => {
    if (!rack || empty || rack.neededUnits <= 0) return [];

    const sizes = decomposeNeededUnits(rack.neededUnits);
    let currentU = startU;

    return sizes.map((heightU, index) => {
      const block = { key: `${startU}-${index}`, startU: currentU, heightU };
      currentU += heightU;
      return block;
    });
  }, [rack, empty, startU]);

  return (
    <group>
      <RackFrame
        dimmed={empty}
        highlighted={highlighted}
        connectedLeft={connectedLeft}
        connectedRight={connectedRight}
        inRow
      />
      <MountingRail x={-halfW + RAIL_W / 2 + 0.02} dimmed={empty} />
      <MountingRail x={halfW - RAIL_W / 2 - 0.02} dimmed={empty} />
      <UnitGuides occupiedUnits={occupiedUnits} dimmed={empty} />
      {equipmentBlocks.map(({ key, startU: blockStartU, heightU }) => (
        <EquipmentBlock key={key} startU={blockStartU} heightU={heightU} />
      ))}
    </group>
  );
}

function RackBayDivider({ x }: { x: number }) {
  const halfD = DEPTH / 2;
  const postW = FRAME * 4;

  return (
    <group position={[x, 0, 0]}>
      {/* Junction posts */}
      {([-halfD, halfD] as const).map((z) => (
        <mesh key={z} position={[0, TOTAL_H / 2, z]} castShadow>
          <boxGeometry args={[postW, TOTAL_H, postW]} />
          <meshStandardMaterial
            color={DIVIDER}
            emissive={DIVIDER}
            emissiveIntensity={0.08}
            metalness={0.75}
            roughness={0.22}
          />
        </mesh>
      ))}

      {/* Recessed seam between bays */}
      <mesh position={[0, TOTAL_H / 2, 0]}>
        <boxGeometry args={[FRAME * 3, TOTAL_H, DEPTH + FRAME * 2]} />
        <meshStandardMaterial color={DIVIDER_DARK} metalness={0.55} roughness={0.45} />
      </mesh>

      {/* Front-facing seam highlight */}
      <mesh position={[0, TOTAL_H / 2, halfD + 0.008]}>
        <boxGeometry args={[FRAME * 2.2, TOTAL_H + FRAME * 1.5, 0.005]} />
        <meshStandardMaterial
          color={DIVIDER}
          emissive={DIVIDER}
          emissiveIntensity={0.35}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Top cap divider notch */}
      <mesh position={[0, TOTAL_H + FRAME, halfD - 0.01]}>
        <boxGeometry args={[FRAME * 2.4, FRAME * 2.4, DEPTH + FRAME * 3]} />
        <meshStandardMaterial color={DIVIDER_DARK} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function RackBayDividers() {
  return (
    <group>
      <RackBayDivider x={-BAY_DIVIDER_X} />
      <RackBayDivider x={BAY_DIVIDER_X} />
    </group>
  );
}

function RackRowBackdrop() {
  const halfD = DEPTH / 2;
  const rowWidth = RACK_PITCH * 3;

  return (
    <group>
      <mesh position={[0, TOTAL_H / 2, -halfD - FRAME]} receiveShadow castShadow>
        <boxGeometry args={[rowWidth, TOTAL_H, FRAME]} />
        <meshStandardMaterial color={CABINET_DARK} metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0, -FRAME * 1.2, 0]} receiveShadow>
        <boxGeometry args={[rowWidth, FRAME * 2, DEPTH + FRAME * 4]} />
        <meshStandardMaterial color={CABINET_DARK} metalness={0.45} roughness={0.5} />
      </mesh>
      <mesh position={[0, TOTAL_H + FRAME, 0]} castShadow>
        <boxGeometry args={[rowWidth, FRAME * 2.5, DEPTH + FRAME * 4]} />
        <meshStandardMaterial
          color={CABINET_LIGHT}
          metalness={0.5}
          roughness={0.4}
          emissive={ACCENT}
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* Divider lines on shared top cap */}
      {([-BAY_DIVIDER_X, BAY_DIVIDER_X] as const).map((x) => (
        <mesh key={x} position={[x, TOTAL_H + FRAME + 0.003, DEPTH / 2 - 0.01]}>
          <boxGeometry args={[FRAME * 2.2, FRAME * 2, DEPTH + FRAME * 2.5]} />
          <meshStandardMaterial
            color={DIVIDER}
            emissive={DIVIDER}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      ))}
      {/* Center bay accent on shared top cap */}
      <mesh position={[0, TOTAL_H + FRAME + 0.001, DEPTH / 2 - 0.01]}>
        <boxGeometry args={[BAY_WIDTH * 0.92, FRAME * 0.8, 0.006]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function RackRow({ rack }: Props) {
  return (
    <group>
      <RackRowBackdrop />
      <group position={[-RACK_PITCH, 0, 0]}>
        <RackAssembly empty connectedRight />
      </group>
      <group position={[0, 0, 0]}>
        <RackAssembly rack={rack} highlighted connectedLeft connectedRight />
      </group>
      <group position={[RACK_PITCH, 0, 0]}>
        <RackAssembly empty connectedLeft />
      </group>
      <RackBayDividers />
    </group>
  );
}

function StudioFloor() {
  const rowWidth = RACK_PITCH * 3 + 0.08;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow>
      <planeGeometry args={[rowWidth, DEPTH + FRAME * 6]} />
      <meshStandardMaterial color="#0b1220" metalness={0.15} roughness={0.85} />
    </mesh>
  );
}

export const RACK_CENTER_Y = TOTAL_H / 2;
export const RACK_DISPLAY_SCALE = 0.55;
export const RACK_DISPLAY_HEIGHT = (TOTAL_H + FRAME * 3.45) * RACK_DISPLAY_SCALE;
export const RACK_DISPLAY_CENTER_Y =
  ((TOTAL_H + FRAME * 1.05) / 2) * RACK_DISPLAY_SCALE;
export const RACK_CAMERA_FOV = 31;
const RACK_CAMERA_FIT_MARGIN = 0.99;
const RACK_CAMERA_ZOOM_OUT = 1.2;
export const RACK_CAMERA_Z =
  ((RACK_DISPLAY_HEIGHT * RACK_CAMERA_FIT_MARGIN) /
    (2 * Math.tan((RACK_CAMERA_FOV * Math.PI) / 360))) *
  RACK_CAMERA_ZOOM_OUT;
/** Slight look-at offset to sit the rack above the bottom label overlay. */
export const RACK_CAMERA_LOOK_Y = RACK_DISPLAY_CENTER_Y + RACK_DISPLAY_HEIGHT * 0.02;

export function RackScene3D({ rack }: Props) {
  return (
    <>
      <color attach="background" args={["#0b1220"]} />
      <fog attach="fog" args={["#0b1220", 3, 5.5]} />

      <ambientLight intensity={0.7} />
      <directionalLight
        position={[1.5, 3.5, 2.5]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2, 2, -1]} intensity={0.45} color="#b8e8e8" />
      <spotLight
        position={[0.4, 2, 1.4]}
        angle={0.45}
        penumbra={0.6}
        intensity={0.75}
        color={ACCENT_GLOW}
      />

      <StudioFloor />
      <group scale={RACK_DISPLAY_SCALE}>
        <RackRow rack={rack} />
      </group>

      <ContactShadows
        position={[0, -0.03, 0]}
        opacity={0.45}
        scale={2}
        blur={2.5}
        far={1.1}
      />
      <Environment preset="warehouse" />
    </>
  );
}
