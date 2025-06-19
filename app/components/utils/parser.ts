import { TableData, TableRawData } from "types/question";
// utils/parser.ts
export function parseChoices(raw: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseTableData(rawData: string): string[][] {
  try {
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [[""]];
  } catch {
    return [[""]];
  }
}

/**
 * 앱 내부 TableData → DB 저장용 TableRawData 변환
 */
export function stringifyTableData(table: TableData): TableRawData {
  return {
    id: table.id,
    title: table.title,
    data: JSON.stringify(table.data),
  };
}
