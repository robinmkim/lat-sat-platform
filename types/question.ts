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

export type TableData = {
  id: string;
  title: string;
  data: string; // JSON string (예: stringified 2D array)
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
