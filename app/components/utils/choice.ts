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
