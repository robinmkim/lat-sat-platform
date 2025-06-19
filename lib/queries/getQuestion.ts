import { prisma } from "lib/prisma";
import { QuestionWithRelations } from "types/question";

export async function getQuestion(
  sectionId: string,
  index: number
): Promise<QuestionWithRelations | null> {
  const question = await prisma.question.findUnique({
    where: {
      sectionId_index: {
        sectionId,
        index,
      },
    },
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
  });
  if (!question) return null;
  return {
    id: question.id,
    sectionId: question.sectionId,
    index: question.index,
    question: question.question ?? "",
    passage: question.passage ?? "",
    answer: question.answer ?? "",
    type: question.type,
    showTable: question.showTable,
    showImage: question.showImage,
    score: question.score,

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
            data: question.tables[0].data,
          }
        : undefined,

    images: question.images.map((img) => ({
      id: img.id,
      url: img.url,
    })),
  };
}

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
        score: question.score,

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
                data: question.tables[0].data,
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
