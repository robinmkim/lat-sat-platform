// app/actions/getQuestionsBySection.ts
"use server";

import { prisma } from "lib/prisma";
import type {
  SectionWithQuestions,
  QuestionWithRelations,
  ChoiceData,
  ImageData,
} from "types/question";

export async function getQuestionsBySection(
  testId: string,
  sectionNumber: number
): Promise<SectionWithQuestions | null> {
  const section = await prisma.section.findFirst({
    where: { testId, number: sectionNumber },
    include: {
      questions: {
        orderBy: { index: "asc" },
        include: {
          choices: {
            orderBy: { order: "asc" },
            include: { images: true },
          },
          images: true,
          tables: true,
        },
      },
    },
  });

  if (!section) return null;

  // 질문 배열 매핑
  const questions: QuestionWithRelations[] = section.questions.map((q) => ({
    id: q.id,
    sectionId: q.sectionId,
    index: q.index,
    question: q.question,
    passage: q.passage ?? "",
    answer: q.answer ?? "",
    type: q.type,
    showTable: q.showTable,
    showImage: q.showImage,
    score: q.score ?? 1,
    choices: q.choices.map(
      (c): ChoiceData => ({
        id: c.id,
        order: c.order,
        text: c.text,
        images: c.images.map(
          (img): ImageData => ({
            id: img.id,
            url: img.url,
          })
        ),
      })
    ),
    table:
      q.tables.length > 0
        ? {
            id: q.tables[0].id,
            title: q.tables[0].title ?? "",
            data: safeParseTableData(q.tables[0].data), // JSON 파싱해서 string[][] 반환
          }
        : undefined,
    images: q.images.map(
      (img): ImageData => ({
        id: img.id,
        url: img.url,
      })
    ),
    isImageChoice: false,
  }));

  return {
    sectionId: section.id,
    sectionNumber: section.number,
    questions,
  };
}

// 안전하게 JSON 파싱
function safeParseTableData(data: string): string[][] {
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    return [[]];
  } catch {
    return [[]];
  }
}
