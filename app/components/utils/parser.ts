// utils/parser.ts
export function parseChoices(raw: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseTableData(raw: string | null | undefined): string[][] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) && parsed.every((row) => Array.isArray(row))
      ? parsed
      : [[""]];
  } catch {
    return [[""]];
  }
}
