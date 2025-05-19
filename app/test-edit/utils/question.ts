export function normalizeAnswer(
  raw: unknown,
  type: "MULTIPLE" | "SHORT"
): string | number {
  if (type === "MULTIPLE") {
    return typeof raw === "number" ? raw : 0;
  }
  // SHORT
  return typeof raw === "string" ? raw : "";
}
