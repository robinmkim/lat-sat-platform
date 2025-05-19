"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveQuestionResult {
  error?: string;
  success?: boolean;
}

export async function saveQuestion(
  _prevState: SaveQuestionResult,
  formData: FormData
): Promise<SaveQuestionResult> {
  const sectionId = formData.get("sectionId") as string;
  const index = Number(formData.get("index"));
  const payload = formData.get("payload") as string;

  const [question] = JSON.parse(payload);

  // ✅ 유효성 검사
  const isValid =
    (question.type === "MULTIPLE" && typeof question.answer === "number") ||
    (question.type === "SHORT" &&
      typeof question.answer === "string" &&
      question.answer.trim() !== "");

  if (!isValid) {
    return { error: "정답을 입력해 주세요." };
  }

  await prisma.question.upsert({
    where: {
      sectionId_index: {
        sectionId,
        index,
      },
    },
    update: {
      questionText: question.question,
      passage: question.passage,
      choices: question.choices,
      answer: question.answer,
      isMultipleChoice: question.type === "MULTIPLE",
      type: question.type,
      tableData: question.tableData,
      imageUrl: question.imageUrl,
    },
    create: {
      id: question.id,
      sectionId,
      index,
      questionText: question.question,
      passage: question.passage,
      choices: question.choices,
      answer: question.answer,
      isMultipleChoice: question.type === "MULTIPLE",
      type: question.type,
      tableData: question.tableData,
      imageUrl: question.imageUrl,
    },
  });

  revalidatePath(`/test-edit/${question.testId}`); // 선택 사항

  return { success: true };
}
export async function deleteTestById(testId: string) {
  await prisma.test.delete({ where: { id: testId } });
  revalidatePath("/test-list");
}
