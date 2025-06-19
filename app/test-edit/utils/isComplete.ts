import type { QuestionWithRelations, ChoiceData } from "types/question";

export function isComplete(
  question: Partial<QuestionWithRelations> | null,
  sectionNumber: number
): boolean {
  if (!question) return false;

  const isMath = sectionNumber >= 3;

  const hasQuestion = !!question.question?.trim();
  const hasAnswer =
    typeof question.answer === "string" && question.answer.trim() !== "";
  const hasPassage = !!question.passage?.trim();
  const hasScore = typeof question.score === "number" && !isNaN(question.score);

  // ✅ choice 타입 명시적으로 지정
  const hasValidChoices =
    Array.isArray(question.choices) &&
    question.choices.length === 4 &&
    question.choices.every((choice: ChoiceData) => {
      const hasText = !!choice.text?.trim();
      const hasImage = Array.isArray(choice.images) && choice.images.length > 0;
      return hasText || hasImage;
    });

  if (!hasScore) return false;

  if (isMath) {
    if (question.type === "SHORT") {
      return hasQuestion && hasAnswer;
    } else {
      return hasQuestion && hasValidChoices && hasAnswer;
    }
  } else {
    return hasPassage && hasQuestion && hasValidChoices && hasAnswer;
  }
}
