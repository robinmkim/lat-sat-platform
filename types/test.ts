// types/test.ts
export type Question = {
  index: number;
  answer: string;
  type: "MULTIPLE" | "SHORT";
  score?: number;
  choices?: string[];
};

export type Section = {
  number: number;
  type: "READING_WRITING" | "MATH";
  questions: Question[];
};

export type Test = {
  id: string;
  sections: Section[];
};
