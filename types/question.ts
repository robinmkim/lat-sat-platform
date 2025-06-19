export type ImageData = {
  id: string;
  url: string;
};

export type ChoiceData = {
  id: string;
  order: number; // 0 = A, 1 = B ...
  text: string;
  images: ImageData[];
};

// DB 저장용 타입 (Prisma 모델에서 가져오는 원시 타입)
export type TableRawData = {
  id: string;
  title?: string;
  data: string; // JSON 문자열로 저장됨
};

// 앱 내부, 클라이언트에서 사용하는 파싱된 타입
export type TableData = {
  id: string;
  title?: string;
  data: string[][]; // 파싱된 2차원 배열
};

export type QuestionWithRelations = {
  id: string;
  sectionId: string;
  index: number;
  question: string;
  passage: string;
  answer: string;
  type: "MULTIPLE" | "SHORT";
  showTable: boolean;
  showImage: boolean;
  score: number;

  choices: ChoiceData[];
  table?: TableData;
  images: ImageData[];

  // ✅ 클라이언트 전용 필드 추가
  isImageChoice?: boolean;
};

export type SectionWithQuestions = {
  sectionId: string;
  sectionNumber: number;
  questions: QuestionWithRelations[];
};

// 안전하게 JSON 파싱 (실패 시 빈 2차원 배열 반환)
export function parseTableData(rawData: string): string[][] {
  try {
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) return parsed;
    return [[]];
  } catch {
    return [[]];
  }
}

// 앱 내부 객체를 DB 저장용으로 변환 (stringify)
export function stringifyTableData(table: TableData): TableRawData {
  return {
    ...table,
    data: JSON.stringify(table.data),
  };
}
