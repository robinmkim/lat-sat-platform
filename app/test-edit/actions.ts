"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveQuestion(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const sectionId = formData.get("sectionId") as string;
    const payload = formData.get("payload") as string;

    if (!sectionId || !payload) {
      return { error: "필수 값이 누락되었습니다." };
    }

    const allQuestions = JSON.parse(payload);

    for (const question of allQuestions) {
      const commonData = {
        sectionId,
        index: question.index,
        questionText: question.question,
        passage: question.passage,
        choices: question.choices,
        answer: question.answer,
        type: question.type,
        tableData: question.tableData,
        imageUrl: question.imageUrl,
        showTable: question.showTable,
        showImage: question.showImage,
      };

      await prisma.question.upsert({
        where: {
          sectionId_index: {
            sectionId,
            index: question.index,
          },
        },
        update: commonData,
        create: commonData,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("saveQuestion error:", err);
    return { error: "문제 저장 중 오류가 발생했습니다." };
  }
}

export async function deleteTestById(testId: string) {
  await prisma.test.delete({ where: { id: testId } });
  revalidatePath("/test-list");
}
