export const dynamic = "force-dynamic";

import { prisma } from "lib/prisma";
import { notFound } from "next/navigation";
import TestSolveClient from "./TestSolveClient";
import { getNextQuestionRoute } from "@/action";
import { mapStringArrayToChoices } from "@/components/utils/choice";
import { parseChoices, parseTableData } from "@/components/utils/parser";

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
  const questionIndex = Number(questionId);

  const section = await prisma.section.findFirst({
    where: { testId, number: sectionNumber },
    include: { questions: true },
  });

  if (!section) return notFound();

  const sorted = [...section.questions].sort((a, b) => a.index - b.index);
  const question = sorted.find((q) => q.index === questionIndex);
  if (!question) return notFound();

  // ✅ 안전하게 choices, tableData 파싱
  const parsedChoices = parseChoices(question.choices);
  const choices = mapStringArrayToChoices(parsedChoices);
  const tableData = parseTableData(question.tableData);

  const prevRoute = await getNextQuestionRoute(
    testId,
    sectionNumber,
    questionIndex - 1,
    "prev"
  );
  const nextRoute = await getNextQuestionRoute(
    testId,
    sectionNumber,
    questionIndex + 1,
    "next"
  );

  return (
    <TestSolveClient
      testId={testId}
      sectionId={section.number}
      totalQuestions={sorted.length}
      question={{
        index: question.index,
        question: question.questionText ?? "",
        passage: question.passage ?? undefined,
        choices,
        type: question.type,
        tableTitle: question.tableTitle ?? undefined,
        tableData,
        imageUrl: question.imageUrl ?? undefined,
      }}
      prevRoute={prevRoute}
      nextRoute={nextRoute}
    />
  );
}
