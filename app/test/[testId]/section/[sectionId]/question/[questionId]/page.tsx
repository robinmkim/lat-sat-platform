export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { mapStringArrayToChoices } from "@/app/components/utils/choice";
import TestSolveClient from "./TestSolveClient";
import { getNextQuestionRoute } from "@/app/action";

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

  const choices = mapStringArrayToChoices(question.choices ?? []);

  const prevRoute = await getNextQuestionRoute(
    testId,
    sectionNumber,
    questionIndex - 1
  );
  const nextRoute = await getNextQuestionRoute(
    testId,
    sectionNumber,
    questionIndex + 1
  );

  return (
    <TestSolveClient
      testId={testId}
      sectionId={section.number}
      totalQuestions={sorted.length}
      question={{
        index: question.index,
        questionText: question.questionText,
        passage: question.passage,
        choices,
      }}
      prevRoute={prevRoute}
      nextRoute={nextRoute}
    />
  );
}
