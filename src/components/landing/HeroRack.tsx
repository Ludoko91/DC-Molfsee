"use client";

import { getAllocatedStartU } from "@/lib/rack/calculations";
import { PER_U_PRICE_EUR, RACK_HEIGHT_U } from "@/lib/rack/types";

const PREVIEW_UNITS = 10;

export function HeroRack() {
  const startU = getAllocatedStartU(PREVIEW_UNITS);
  const endU = startU + PREVIEW_UNITS - 1;
  const uHeight = 10;
  const drawWidth = 200;
  const padX = 36;
  const padY = 28;
  const totalHeight = RACK_HEIGHT_U * uHeight;
  const svgWidth = drawWidth + padX * 2;
  const svgHeight = totalHeight + padY * 2 + 40;

  const selTopY = padY + (RACK_HEIGHT_U - endU) * uHeight;
  const selHeight = PREVIEW_UNITS * uHeight;

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="card-surface relative overflow-hidden p-8">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-light) 0%, transparent 50%, var(--sea) 100%)",
          }}
        />

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="relative mx-auto w-full max-w-[260px]"
          aria-hidden
        >
          <text
            x={svgWidth / 2}
            y="24"
            textAnchor="middle"
            fontSize="9"
            fill="var(--accent-muted)"
            letterSpacing="2"
            className="font-mono-label"
          >
            FRONT ELEVATION · 47U
          </text>

          {Array.from({ length: RACK_HEIGHT_U }, (_, i) => {
            const u = RACK_HEIGHT_U - i;
            const y = padY + i * uHeight;
            const isMajor = u % 5 === 0 || u === 1 || u === RACK_HEIGHT_U;
            return isMajor ? (
              <g key={u}>
                <line
                  x1={padX - 14}
                  x2={padX - 4}
                  y1={y}
                  y2={y}
                  stroke="rgba(13,92,92,0.3)"
                  strokeWidth="0.5"
                />
                <text
                  x={padX - 18}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="7"
                  fill="rgba(13,92,92,0.45)"
                  className="font-mono-label"
                >
                  {u}
                </text>
              </g>
            ) : null;
          })}

          <rect
            x={padX}
            y={padY}
            width={drawWidth}
            height={totalHeight}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            rx="2"
          />

          <rect
            x={padX + 1}
            y={selTopY}
            width={drawWidth - 2}
            height={selHeight}
            fill="var(--accent-soft)"
            stroke="var(--accent)"
            strokeWidth="1"
            rx="1"
          />

          {Array.from({ length: RACK_HEIGHT_U + 1 }, (_, i) => {
            const y = padY + i * uHeight;
            return (
              <line
                key={i}
                x1={padX}
                x2={padX + drawWidth}
                y1={y}
                y2={y}
                stroke="rgba(13,92,92,0.08)"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        <div className="absolute -right-2 top-1/2 translate-x-1/4 rounded-[var(--radius)] bg-accent px-3 py-2 font-mono-label text-[10px] text-white shadow-[var(--shadow-md)] sm:right-2">
          <div className="opacity-80">U{startU} — U{endU}</div>
          <div className="font-medium">
            {PREVIEW_UNITS}U · {PREVIEW_UNITS * PER_U_PRICE_EUR} €/mo
          </div>
        </div>
      </div>
    </div>
  );
}
