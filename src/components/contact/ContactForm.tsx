"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { calculateRackSummary, calculateTotalSummary } from "@/lib/rack/calculations";
import type { SharedRackConfig } from "@/lib/rack/share";
import { decodeSharedRackConfig } from "@/lib/rack/share";
import { formatEur } from "@/lib/format";

type Role = "owner" | "admin" | "engineer" | "student" | "other";

type FormState = {
  email: string;
  role: Role | "";
  name: string;
  company: string;
  phone: string;
  message: string;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; generatedEmail: string; mailtoHref: string; serverSent: boolean }
  | { kind: "error"; generatedEmail: string; mailtoHref: string; message: string };

function isValidEmail(value: string): boolean {
  // Pragmatic client-side validation; backend will do real checks later if added.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function buildMailtoHref(params: { to: string; subject: string; body: string }): string {
  const subject = encodeURIComponent(params.subject);
  const body = encodeURIComponent(params.body);
  return `mailto:${params.to}?subject=${subject}&body=${body}`;
}

function getSessionKey(token: string) {
  return `contactConfig:${token}`;
}

export function ContactForm() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const tConfigure = useTranslations("configure");
  const locale = useLocale();
  const numberLocale = locale === "de" ? "de-DE" : "en-IE";
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<SharedRackConfig[] | null>(null);
  const [configSource, setConfigSource] = useState<"query" | "session" | "missing">("missing");

  const [form, setForm] = useState<FormState>({
    email: "",
    role: "",
    name: "",
    company: "",
    phone: "",
    message: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    const c = searchParams.get("c");
    const token = searchParams.get("t");

    if (c) {
      const decoded = decodeSharedRackConfig(c);
      setConfig(decoded);
      setConfigSource(decoded ? "query" : "missing");
      return;
    }

    if (token) {
      try {
        const raw = sessionStorage.getItem(getSessionKey(token));
        if (!raw) {
          setConfig(null);
          setConfigSource("missing");
          return;
        }
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) {
          setConfig(null);
          setConfigSource("missing");
          return;
        }
        setConfig(parsed as SharedRackConfig[]);
        setConfigSource("session");
      } catch {
        setConfig(null);
        setConfigSource("missing");
      }
      return;
    }

    setConfig(null);
    setConfigSource("missing");
  }, [searchParams]);

  const totals = useMemo(() => (config ? calculateTotalSummary(config) : null), [config]);
  const contactEmail = tFooter("contact");

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.email.trim()) next.email = t("form.errors.required");
    else if (!isValidEmail(form.email)) next.email = t("form.errors.invalidEmail");
    if (!form.role) next.role = t("form.errors.required");
    if (!form.name.trim()) next.name = t("form.errors.required");
    return next;
  }, [form.email, form.role, form.name, t]);

  const canSubmit = Object.keys(errors).length === 0 && !!config?.length;
  const isSubmitting = submitState.kind === "sending";

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitState({ kind: "idle" });
    setCopyState("idle");
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  function buildGeneratedEmail(): { subject: string; body: string } {
    const rackCount = totals?.rackCount ?? 0;
    const subject = t("email.subject", { count: rackCount });

    const roleLabel =
      form.role === "owner"
        ? t("roles.owner")
        : form.role === "admin"
          ? t("roles.admin")
          : form.role === "engineer"
            ? t("roles.engineer")
            : form.role === "student"
              ? t("roles.student")
              : t("roles.other");

    const detailLines = [
      `${t("email.fields.email")}: ${form.email.trim()}`,
      `${t("email.fields.role")}: ${roleLabel}`,
      `${t("email.fields.name")}: ${form.name.trim()}`,
      form.company.trim() ? `${t("email.fields.company")}: ${form.company.trim()}` : null,
      form.phone.trim() ? `${t("email.fields.phone")}: ${form.phone.trim()}` : null,
    ].filter(Boolean) as string[];

    const messageLines = form.message.trim()
      ? [t("email.messageHeader"), form.message.trim()]
      : [t("email.messageHeader"), t("email.noMessage")];

    const configLines: string[] = [];
    if (config && totals) {
      configLines.push(t("email.configHeader"));
      configLines.push(tConfigure("overview.email.rackCount", { count: totals.rackCount }));
      configLines.push("");

      config.forEach((rack, idx) => {
        const summary = calculateRackSummary(rack);
        configLines.push(
          tConfigure("overview.email.rackHeader", { index: idx + 1, name: rack.name }),
        );
        configLines.push(
          `${tConfigure("overview.email.neededUnits")}: ${rack.neededUnits}U`,
        );
        configLines.push(
          `${tConfigure("overview.email.maxPowerKw")}: ${summary.maxPowerKw.toFixed(1)} ${tConfigure("power.kwUnit")}`,
        );
        configLines.push(
          `${tConfigure("overview.email.powerFeeds")}: ${summary.powerFeeds} ${tConfigure("power.feedsUnit")}`,
        );
        configLines.push(
          `${tConfigure("overview.email.totalPowerKwh")}: ${summary.totalPowerKwh} ${tConfigure("power.kwhUnit")}`,
        );
        configLines.push(
          `${tConfigure("overview.email.monthlySubtotal")}: ${formatEur(summary.totalMonthlyEur, numberLocale)}`,
        );
        configLines.push("");
      });

      configLines.push(tConfigure("overview.email.totalsHeader"));
      configLines.push(
        `${tConfigure("overview.email.totalRack")}: ${formatEur(totals.totalRackCostEur, numberLocale)}`,
      );
      configLines.push(
        `${tConfigure("overview.email.totalFeeds")}: ${formatEur(totals.totalFeedsCostEur, numberLocale)}`,
      );
      configLines.push(
        `${tConfigure("overview.email.grandTotal")}: ${formatEur(totals.totalMonthlyEur, numberLocale)}`,
      );
    }

    const body = [
      t("email.greeting"),
      "",
      t("email.detailsHeader"),
      ...detailLines,
      "",
      ...messageLines,
      "",
      ...configLines,
    ].join("\n");

    return { subject, body };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, role: true, name: true });
    if (!canSubmit) return;

    const { subject, body } = buildGeneratedEmail();
    const mailtoHref = buildMailtoHref({ to: contactEmail, subject, body });
    const generatedEmail = `To: ${contactEmail}\nSubject: ${subject}\n\n${body}`;

    setSubmitState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          company: form.company.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          config,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as null | { error?: string };
        const msg = data?.error || `Request failed (${res.status})`;
        setSubmitState({ kind: "error", generatedEmail, mailtoHref, message: msg });
        return;
      }

      setSubmitState({ kind: "success", generatedEmail, mailtoHref, serverSent: true });
    } catch {
      setSubmitState({
        kind: "error",
        generatedEmail,
        mailtoHref,
        message: t("error.network"),
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted">{t("subtitle")}</p>

        <div className="card-surface mt-8 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground">{t("form.title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("form.hint")}</p>

          {!config?.length && (
            <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="text-sm font-medium text-foreground">{t("missingConfig.title")}</p>
              <p className="mt-1 text-sm text-muted">{t("missingConfig.body")}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">{t("form.email")}</span>
                <input
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="mt-1.5 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground">{t("form.role")}</span>
                <select
                  value={form.role}
                  onChange={(e) => setField("role", e.target.value as FormState["role"])}
                  onBlur={() => markTouched("role")}
                  className="mt-1.5 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
                >
                  <option value="">{t("form.rolePlaceholder")}</option>
                  <option value="owner">{t("roles.owner")}</option>
                  <option value="admin">{t("roles.admin")}</option>
                  <option value="engineer">{t("roles.engineer")}</option>
                  <option value="student">{t("roles.student")}</option>
                  <option value="other">{t("roles.other")}</option>
                </select>
                {touched.role && errors.role && (
                  <p className="mt-1 text-xs text-danger">{errors.role}</p>
                )}
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  {t("form.name")}{" "}
                  <span className="text-muted">({t("form.required")})</span>
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  type="text"
                  autoComplete="name"
                  placeholder={t("form.namePlaceholder")}
                  className="mt-1.5 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
                />
                {touched.name && errors.name && (
                  <p className="mt-1 text-xs text-danger">{errors.name}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">{t("form.company")}</span>
                <input
                  value={form.company}
                  onChange={(e) => setField("company", e.target.value)}
                  type="text"
                  autoComplete="organization"
                  placeholder={t("form.companyPlaceholder")}
                  className="mt-1.5 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-foreground">{t("form.phone")}</span>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                type="tel"
                autoComplete="tel"
                placeholder={t("form.phonePlaceholder")}
                className="mt-1.5 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">{t("form.message")}</span>
              <textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                rows={5}
                placeholder={t("form.messagePlaceholder")}
                className="mt-1.5 w-full resize-y rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
              />
            </label>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">
                {t("form.configSource", {
                  source:
                    configSource === "query"
                      ? t("form.configSourceQuery")
                      : configSource === "session"
                        ? t("form.configSourceSession")
                        : t("form.configSourceMissing"),
                })}
              </p>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? t("form.submitSending") : t("form.submit")}
              </button>
            </div>
          </form>

          {submitState.kind === "success" && (
            <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-4">
              <p className="text-sm font-semibold text-foreground">{t("success.title")}</p>
              <p className="mt-1 text-sm text-muted">
                {submitState.serverSent ? t("success.bodyServer") : t("success.body")}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => copyToClipboard(submitState.generatedEmail)}
                  className="btn-ghost justify-center"
                >
                  {copyState === "copied"
                    ? t("success.copied")
                    : copyState === "failed"
                      ? t("success.copyFailed")
                      : t("success.copy")}
                </button>
                <a href={submitState.mailtoHref} className="btn-primary justify-center">
                  {t("success.openMail")}
                </a>
              </div>

              <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-card-border bg-background/60 p-3 text-xs leading-relaxed text-foreground/80">
                {submitState.generatedEmail}
              </pre>
            </div>
          )}

          {submitState.kind === "error" && (
            <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4">
              <p className="text-sm font-semibold text-foreground">{t("error.title")}</p>
              <p className="mt-1 text-sm text-muted">{t("error.body")}</p>
              <p className="mt-2 text-xs text-foreground/80">{submitState.message}</p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => copyToClipboard(submitState.generatedEmail)}
                  className="btn-ghost justify-center"
                >
                  {copyState === "copied"
                    ? t("success.copied")
                    : copyState === "failed"
                      ? t("success.copyFailed")
                      : t("success.copy")}
                </button>
                <a href={submitState.mailtoHref} className="btn-primary justify-center">
                  {t("success.openMail")}
                </a>
              </div>

              <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-card-border bg-background/60 p-3 text-xs leading-relaxed text-foreground/80">
                {submitState.generatedEmail}
              </pre>
            </div>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-6">
        <div className="card-surface p-5">
          <h2 className="text-base font-semibold text-foreground">{t("summary.title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("summary.hint")}</p>

          {totals ? (
            <>
              <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  {tConfigure("overview.grandTotal")}
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {formatEur(totals.totalMonthlyEur, numberLocale)}
                </p>
                <p className="mt-0.5 text-xs text-muted">{tConfigure("pricing.net")}</p>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted">{tConfigure("overview.rackTotal")}</span>
                  <span className="font-medium text-foreground">
                    {formatEur(totals.totalRackCostEur, numberLocale)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted">{tConfigure("overview.feedsTotal")}</span>
                  <span className="font-medium text-foreground">
                    {formatEur(totals.totalFeedsCostEur, numberLocale)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-card-border pt-4">
                {config!.map((rack) => {
                  const s = calculateRackSummary(rack);
                  return (
                    <div key={rack.id} className="rounded-xl border border-card-border bg-background/60 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{rack.name}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {rack.neededUnits}U · {s.maxPowerKw.toFixed(1)} {tConfigure("power.kwUnit")} ·{" "}
                            {s.powerFeeds} {tConfigure("power.feedsUnit")}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatEur(s.totalMonthlyEur, numberLocale)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-card-border bg-background/60 p-4">
              <p className="text-sm text-muted">{t("summary.empty")}</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

