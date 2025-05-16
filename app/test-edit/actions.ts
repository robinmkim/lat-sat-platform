"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveQuestion(formData: FormData) {
  const sectionId = formData.get("sectionId") as string;
  const index = Number(formData.get("index"));
  const payload = formData.get("payload") as string;

  const [question] = JSON.parse(payload);

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
      type: question.type, // ✅ 그대로 저장
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
      type: question.type, // ✅ 그대로 저장
      tableData: question.tableData,
      imageUrl: question.imageUrl,
    },
  });
}
export async function deleteTestById(testId: string) {
  await prisma.test.delete({ where: { id: testId } });
  revalidatePath("/test-list");
}
