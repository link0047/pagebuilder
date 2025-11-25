export function toCSSUnit(val: unknown): string | undefined {
  if (val == null || (typeof val !== "string" && typeof val !== "number")) return undefined;

  if (typeof val === "number") {
    if (Number.isNaN(val) || !Number.isFinite(val)) return undefined;
    return `${val}px`;
  }

  const str = val.trim();
  return (/^-?\d*\.?\d+$/.test(str)) ? `${str}px` : str;
}