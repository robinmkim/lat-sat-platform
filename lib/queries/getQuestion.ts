import { prisma } from "@/lib/prisma";

export async function getQuestion(sectionId: string, index: number) {
  const question = await prisma.question.findUnique({
    where: {
      sectionId_index: {
        sectionId,
        index,
      },
    },
  });

  if (!question) return null;

  return {
    ...question,
    question: question.questionText ?? "",
    passage: question.passage ?? "",
    choices: Array.isArray(question.choices)
      ? question.choices
      : ["", "", "", ""],
    answer:
      typeof question.answer === "string"
        ? question.answer
        : String(question.answer ?? ""),
    type: question.type ?? "MULTIPLE",
    tableData: Array.isArray(question.tableData) ? question.tableData : [[""]],
    tableTitle: question.tableTitle ?? undefined, // ✅ 여기 추가됨
    imageUrl: question.imageUrl ?? "",
    imageId: question.imageId ?? "",
    showTable: question.showTable ?? true,
    showImage: question.showImage ?? true,
    score: question.score ?? 1,
  };
}
