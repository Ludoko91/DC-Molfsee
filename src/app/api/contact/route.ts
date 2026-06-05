import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { calculateTotalSummary } from "@/lib/rack/calculations";
import type { SharedRackConfig } from "@/lib/rack/share";
import type { RackConfig } from "@/lib/rack/types";

type Role = "owner" | "admin" | "engineer" | "student" | "other";

type ContactPayload = {
  name: string;
  email: string;
  role: Role;
  company?: string;
  phone?: string;
  message?: string;
  config: SharedRackConfig[];
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function requiredEnv(name: string): string | null {
  const v = process.env[name];
  if (!v || !v.trim()) return null;
  return v.trim();
}

function formatMoneyEur(amount: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = json as Partial<ContactPayload>;
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const role = data.role;
  const company = (data.company ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const message = (data.message ?? "").trim();
  const config = data.config;

  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (!role)
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  if (!["owner", "admin", "engineer", "student", "other"].includes(role))
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  if (!Array.isArray(config) || config.length === 0)
    return NextResponse.json({ error: "Missing config" }, { status: 400 });

  const host = requiredEnv("SMTP_HOST");
  const portRaw = requiredEnv("SMTP_PORT");
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS");
  const from = requiredEnv("SMTP_FROM") ?? user;

  if (!host || !portRaw || !user || !pass || !from) {
    return NextResponse.json(
      { error: "SMTP not configured (set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM)" },
      { status: 500 },
    );
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    return NextResponse.json({ error: "Invalid SMTP_PORT" }, { status: 500 });
  }

  const racks: RackConfig[] = config.map((r) => ({
    id: r.id,
    name: r.name,
    neededUnits: r.neededUnits,
    maxPowerKw: r.maxPowerKw,
    totalPowerKwh: r.totalPowerKwh,
    powerFeeds: r.powerFeeds,
  }));

  const totals = calculateTotalSummary(racks);
  const subject = `Contact form: ${totals.rackCount} rack${totals.rackCount === 1 ? "" : "s"} · ${name}`;

  const roleLabel =
    role === "owner"
      ? "Owner"
      : role === "admin"
        ? "Admin"
        : role === "engineer"
          ? "Engineer"
          : role === "student"
            ? "Student"
            : "Other";

  const lines: string[] = [];
  lines.push("New contact form submission");
  lines.push("");
  lines.push("Contact details");
  lines.push(`Name: ${name}`);
  lines.push(`Email: ${email}`);
  lines.push(`Role: ${roleLabel}`);
  if (company) lines.push(`Company: ${company}`);
  if (phone) lines.push(`Phone: ${phone}`);
  lines.push("");
  lines.push("Message");
  lines.push(message ? message : "(no message)");
  lines.push("");
  lines.push("Configuration");
  lines.push(`Racks: ${totals.rackCount}`);
  lines.push("");

  config.forEach((rack, idx) => {
    lines.push(`Rack ${idx + 1}: ${rack.name}`);
    lines.push(`- Needed units: ${rack.neededUnits}U`);
    lines.push(`- Max power: ${rack.maxPowerKw} kW`);
    lines.push(`- Power feeds: ${rack.powerFeeds}`);
    lines.push(`- Total power: ${rack.totalPowerKwh} kWh`);
    lines.push("");
  });

  lines.push("Totals (net / month)");
  lines.push(`- Rack total: ${formatMoneyEur(totals.totalRackCostEur)}`);
  lines.push(`- Feeds total: ${formatMoneyEur(totals.totalFeedsCostEur)}`);
  lines.push(`- Grand total: ${formatMoneyEur(totals.totalMonthlyEur)}`);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: "ludwig@m-workstations.de",
    replyTo: email,
    subject,
    text: lines.join("\n"),
  });

  return NextResponse.json({ ok: true });
}

