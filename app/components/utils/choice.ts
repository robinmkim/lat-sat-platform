// app/utils/mapChoices.ts

export type Choice = {
  id: string; // "A", "B", "C", ...
  text: string;
};

/**
 * Json 배열로 저장된 선택지(string[])를 Choice[]로 매핑
 */
export function mapStringArrayToChoices(input: unknown): Choice[] {
  if (!Array.isArray(input)) return [];

  return input.map((text, index) => ({
    id: String.fromCharCode(65 + index), // "A" ~ "Z"
    text: String(text),
  }));
}

// app/utils/parseStringChoices.ts

export function parseStringChoices(input: unknown): string[] {
  if (Array.isArray(input) && typeof input[0] === "string") {
    return input as string[];
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed) && typeof parsed[0] === "string") {
        return parsed;
      }
    } catch {
      console.warn("❌ choices JSON 파싱 실패:", input);
    }
  }

  return ["", "", "", ""]; // fallback
}
