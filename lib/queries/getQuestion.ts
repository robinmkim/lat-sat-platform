import { prisma } from "lib/prisma";
import { QuestionWithRelations } from "types/question";

export async function getAllSectionsWithQuestions(testId: string) {
  const sections = await prisma.section.findMany({
    where: { testId },
    orderBy: { number: "asc" },
    include: {
      questions: {
        orderBy: { index: "asc" },
        include: {
          choices: {
            orderBy: { order: "asc" },
            include: {
              images: true,
            },
          },
          tables: true,
          images: true,
        },
      },
    },
  });

  return sections.map((section) => ({
    sectionId: section.id,
    sectionNumber: section.number,
    questions: section.questions.map(
      (question): QuestionWithRelations => ({
        id: question.id,
        sectionId: question.sectionId,
        index: question.index,
        question: question.question ?? "",
        passage: question.passage ?? "",
        answer: question.answer ?? "",
        type: question.type,
        showTable: question.showTable,
        showImage: question.showImage,
        score: question.score ?? 0,

        choices: question.choices.map((choice) => ({
          id: choice.id,
          order: choice.order,
          text: choice.text,
          images: choice.images.map((img) => ({
            id: img.id,
            url: img.url,
          })),
        })),

        table:
          question.tables.length > 0
            ? {
                id: question.tables[0].id,
                title: question.tables[0].title ?? "",
                data: JSON.parse(question.tables[0].data), // ✅ string → string[][]
              }
            : undefined,

        images: question.images.map((img) => ({
          id: img.id,
          url: img.url,
        })),
      })
    ),
  }));
}
