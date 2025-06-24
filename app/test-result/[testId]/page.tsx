export const dynamic = "force-dynamic";

import { prisma } from "lib/prisma";
import TestResultClient from "../TestResultClient";
import { notFound } from "next/navigation";
import type { QuestionWithRelations, TestWithRelations } from "types/question";

export default async function TestResultPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      sections: {
        orderBy: { number: "asc" },
        include: {
          questions: {
            orderBy: { index: "asc" },
            include: {
              choices: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!test) return notFound();

  const parsedTest: TestWithRelations = {
    id: test.id,
    sections: test.sections.map((section) => ({
      number: section.number,
      type: section.type,
      questions: section.questions.map(
        (q): QuestionWithRelations => ({
          id: q.id,
          sectionId: q.sectionId,
          index: q.index,
          question: q.question,
          passage: q.passage ?? "",
          answer: q.answer ?? "",
          type: q.type === "MULTIPLE" ? "MULTIPLE" : "SHORT",
          score: q.score ?? 1,
          showTable: q.showTable ?? false,
          showImage: q.showImage ?? false,
          choices: q.choices.map((c) => ({
            id: c.id,
            order: c.order,
            text: c.text,
            images: [],
          })),
          table: undefined,
          images: [],
          isImageChoice: false,
        })
      ),
    })),
  };

  return <TestResultClient test={parsedTest} />;
}
