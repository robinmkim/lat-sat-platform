// app/test/[testId]/section/[sectionId]/question/[questionId]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "lib/prisma";
import TestSolveClient from "./TestSolveClient";
import { parseChoices, parseTableData } from "@/components/utils/parser";
import { mapStringArrayToChoices } from "@/components/utils/choice";

export default async function Page({
  params,
}: {
  params: Promise<{
    testId: string;
    sectionId: string;
    questionId: string;
  }>;
}) {
  const { testId, sectionId, questionId } = await params;

  const sectionNumber = Number(sectionId);
  const currentIndex = Number(questionId);

  const section = await prisma.section.findFirst({
    where: {
      testId,
      number: sectionNumber,
    },
    include: {
      questions: {
        orderBy: { index: "asc" },
      },
    },
  });

  if (!section || section.questions.length === 0) return notFound();

  const parsedQuestions = section.questions.map((q) => ({
    id: q.id,
    index: q.index,
    question: q.questionText ?? "",
    passage: q.passage ?? undefined,
    choices: mapStringArrayToChoices(parseChoices(q.choices)),
    type: q.type,
    tableTitle: q.tableTitle ?? undefined,
    tableData: parseTableData(q.tableData),
    imageUrl: q.imageUrl ?? undefined,
  }));

  return (
    <TestSolveClient
      testId={testId}
      sectionId={sectionNumber}
      currentIndex={currentIndex}
      questions={parsedQuestions}
      totalQuestions={parsedQuestions.length}
    />
  );
}
