import type { RackConfig } from "./types";

export type SharedRackConfig = Pick<
  RackConfig,
  "id" | "name" | "neededUnits" | "maxPowerKw" | "totalPowerKwh" | "powerFeeds"
>;

type SharedConfigPayloadV1 = {
  v: 1;
  racks: SharedRackConfig[];
};

function toBase64Url(base64: string): string {
  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(base64url: string): string {
  const base64 = base64url.replaceAll("-", "+").replaceAll("_", "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  return base64 + "=".repeat(padLen);
}

function encodeBase64(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }
  // Browser fallback
  return btoa(unescape(encodeURIComponent(input)));
}

function decodeBase64(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64").toString("utf8");
  }
  // Browser fallback
  return decodeURIComponent(escape(atob(input)));
}

export function encodeSharedRackConfig(racks: SharedRackConfig[]): string {
  const payload: SharedConfigPayloadV1 = { v: 1, racks };
  const json = JSON.stringify(payload);
  return toBase64Url(encodeBase64(json));
}

export function decodeSharedRackConfig(encoded: string): SharedRackConfig[] | null {
  try {
    const json = decodeBase64(fromBase64Url(encoded));
    const data = JSON.parse(json) as Partial<SharedConfigPayloadV1>;
    if (data?.v !== 1 || !Array.isArray(data.racks)) return null;
    return data.racks.filter(Boolean) as SharedRackConfig[];
  } catch {
    return null;
  }
}

