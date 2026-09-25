const PLACEHOLDER = "\u2014";
const UNICODE_MINUS = "\u2212";
const TIMES = "\u00d7";

const COMPACT_TIERS = [
  { div: 1e12, suffix: "T" },
  { div: 1e9, suffix: "B" },
  { div: 1e6, suffix: "M" },
  { div: 1e3, suffix: "K" },
] as const;

function unavailable(n: number): boolean {
  return typeof n !== "number" || !Number.isFinite(n);
}

function normalizeSignedZero(n: number): number {
  return Object.is(n, -0) ? 0 : n;
}

function groupInteger(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fractionDigits(digits: number | undefined): number {
  if (digits == null || !Number.isFinite(digits)) return 2;
  return Math.min(20, Math.max(0, Math.trunc(digits)));
}

function plainFixed(abs: number, digits: number): string {
  const fixed =
    abs < 1e21
      ? abs.toFixed(digits)
      : abs
          .toLocaleString("en-US", {
            useGrouping: false,
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
          })
          .replace(/[\u00a0\u202f\u2009 ]/g, "");
  return fixed;
}

function withGrouping(fixed: string): string {
  const [whole, frac] = fixed.split(".");
  const grouped = groupInteger(whole);
  return frac !== undefined ? `${grouped}.${frac}` : grouped;
}

function trimFractionZeros(fixed: string): string {
  if (!fixed.includes(".")) return fixed;
  const [whole, frac] = fixed.split(".");
  const trimmed = frac.replace(/0+$/, "");
  return trimmed.length > 0 ? `${whole}.${trimmed}` : whole;
}

function signed(negative: boolean, body: string): string {
  return negative ? `-${body}` : body;
}

function abbreviateCompact(abs: number): string {
  for (let i = 0; i < COMPACT_TIERS.length; i++) {
    const { div, suffix } = COMPACT_TIERS[i];
    if (abs < div) continue;
    let shown = (abs / div).toFixed(1);
    if (shown === "1000.0" && i > 0) {
      const next = COMPACT_TIERS[i - 1];
      shown = (abs / next.div).toFixed(1);
      return `${trimFractionZeros(withGrouping(shown))}${next.suffix}`;
    }
    return `${trimFractionZeros(withGrouping(shown))}${suffix}`;
  }
  return withGrouping(plainFixed(abs, 2));
}

export function formatUsd(
  n: number,
  opts?: { compact?: boolean; digits?: number },
): string {
  if (unavailable(n)) return PLACEHOLDER;
  n = normalizeSignedZero(n);
  const digits = fractionDigits(opts?.digits);
  const abs = Math.abs(n);
  if (opts?.compact && abs >= 10_000) {
    return signed(n < 0, `$${abbreviateCompact(abs)}`);
  }
  const fixed = plainFixed(abs, digits);
  if (Number(fixed) === 0) return `$${withGrouping(plainFixed(0, digits))}`;
  return signed(n < 0, `$${withGrouping(fixed)}`);
}

export function formatUsdPrice(n: number): string {
  if (unavailable(n)) return PLACEHOLDER;
  n = normalizeSignedZero(n);
  const abs = Math.abs(n);
  const fixed = plainFixed(abs, 2);
  if (Number(fixed) === 0) return "$0.00";
  const [whole, frac] = fixed.split(".");
  const showCents = Number(whole) < 1000 || frac !== "00";
  const body = showCents ? withGrouping(fixed) : groupInteger(whole);
  return signed(n < 0, `$${body}`);
}

export function formatPct(n: number): string {
  if (unavailable(n)) return PLACEHOLDER;
  n = normalizeSignedZero(n);
  const pct = n * 100;
  const fixed = plainFixed(Math.abs(pct), 2);
  if (Number(fixed) === 0) return "0.00%";
  const sign = pct > 0 ? "+" : UNICODE_MINUS;
  return `${sign}${withGrouping(fixed)}%`;
}

export function formatMultiple(n: number): string {
  if (unavailable(n)) return PLACEHOLDER;
  n = normalizeSignedZero(n);
  const fixed = plainFixed(Math.abs(n), 2);
  if (Number(fixed) === 0) return `0.00${TIMES}`;
  return `${signed(n < 0, withGrouping(fixed))}${TIMES}`;
}

export function formatCount(n: number): string {
  if (unavailable(n)) return PLACEHOLDER;
  n = normalizeSignedZero(n);
  const rounded = Math.round(Math.abs(n));
  if (rounded === 0) return "0";
  return signed(n < 0, groupInteger(String(rounded)));
}

export function formatToken(n: number): string {
  if (unavailable(n)) return PLACEHOLDER;
  n = normalizeSignedZero(n);
  const fixed = plainFixed(Math.abs(n), 2);
  if (Number(fixed) === 0) return "0";
  return signed(n < 0, trimFractionZeros(withGrouping(fixed)));
}
