// app/test-edit/utils/getLocalQuestion.ts
import type { SectionWithQuestions } from "types/question";

export function getLocalQuestion(
  testId: string,
  sectionNumber: number,
  questionIndex: number
) {
  const raw = localStorage.getItem(`edit-${testId}`);
  if (!raw) return null;

  try {
    const sections: SectionWithQuestions[] = JSON.parse(raw);
    const section = sections.find((s) => s.sectionNumber === sectionNumber);
    return section?.questions.find((q) => q.index === questionIndex) ?? null;
  } catch {
    return null;
  }
}
