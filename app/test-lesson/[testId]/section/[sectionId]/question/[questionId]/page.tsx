import { notFound } from "next/navigation";
import { prisma } from "lib/prisma";
import LessonSolveClient from "./LessonSolveClient";
import type { QuestionWithRelations } from "types/question";

function safeParseTableData(data: string | undefined): string[][] {
  if (!data) return [[""]];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [[""]];
  } catch {
    return [[""]];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ testId: string; sectionId: string; questionId: string }>;
}) {
  const { testId, sectionId, questionId } = await params;

  const sectionNumber = Number(sectionId);
  const currentIndex = Number(questionId);

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

  if (!section || section.questions.length === 0) return notFound();

  const parsedQuestions: QuestionWithRelations[] = section.questions.map(
    (q) => {
      const choices = q.choices.map((c) => ({
        id: c.id,
        order: c.order,
        text: c.text,
        images: c.images.map((img) => ({ id: img.id, url: img.url })),
      }));

      const hasImageChoice = choices.some((c) => c.images.length > 0);

      return {
        id: q.id,
        sectionId: q.sectionId,
        index: q.index,
        question: q.question,
        passage: q.passage ?? "",
        answer: q.answer ?? "",
        type: q.type === "MULTIPLE" ? "MULTIPLE" : "SHORT",
        showTable: q.showTable,
        showImage: q.showImage,
        score: q.score ?? 1,
        choices,
        table:
          q.tables.length > 0
            ? {
                id: q.tables[0].id,
                title: q.tables[0].title ?? "",
                data: safeParseTableData(q.tables[0].data),
              }
            : undefined,
        images: q.images.map((img) => ({ id: img.id, url: img.url })),
        isImageChoice: hasImageChoice,
      };
    }
  );

  return (
    <LessonSolveClient
      testId={testId}
      sectionId={sectionNumber}
      currentIndex={currentIndex}
      questions={parsedQuestions}
    />
  );
}
