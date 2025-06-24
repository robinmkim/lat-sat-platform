import type { QuestionWithRelations, ChoiceData } from "types/question";

export function isComplete(
  question: Partial<QuestionWithRelations> | null,
  sectionNumber: number
): boolean {
  if (!question) {
    console.log("❌ 누락: question 객체 없음");
    return false;
  }

  const isMath = sectionNumber >= 3;
  const isMultiple = question.type === "MULTIPLE";
  const isShort = question.type === "SHORT";

  const hasQuestion = !!question.question?.trim();
  const hasPassage = !!question.passage?.trim();
  const hasScore = typeof question.score === "number" && !isNaN(question.score);

  const hasValidChoices =
    isMultiple &&
    Array.isArray(question.choices) &&
    question.choices.length === 4 &&
    question.choices.every((choice: ChoiceData) => {
      const hasText = !!choice.text?.trim();
      const hasImage = Array.isArray(choice.images) && choice.images.length > 0;
      return hasText || hasImage;
    });

  if (!hasScore) {
    console.log(
      `❌ 누락: score - section ${sectionNumber}, question ${question.index}`
    );
    return false;
  }

  if (isMath) {
    if (isShort) {
      if (!hasQuestion) {
        console.log(`❌ 누락: question (MA SHORT) - index ${question.index}`);
        return false;
      }
    } else {
      if (!hasQuestion) {
        console.log(
          `❌ 누락: question (MA MULTIPLE) - index ${question.index}`
        );
        return false;
      }
      if (!hasValidChoices) {
        console.log(`❌ 누락: choices (MA MULTIPLE) - index ${question.index}`);
        return false;
      }
    }
  } else {
    if (!hasPassage) {
      console.log(`❌ 누락: passage (RW) - index ${question.index}`);
      return false;
    }
    if (!hasQuestion) {
      console.log(`❌ 누락: question (RW) - index ${question.index}`);
      return false;
    }
    if (!hasValidChoices) {
      console.log(`❌ 누락: choices (RW) - index ${question.index}`);
      return false;
    }
  }

  return true;
}
