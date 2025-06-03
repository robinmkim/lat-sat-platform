export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import TestResultClient from "../TestResultClient";
import { notFound } from "next/navigation";

// 타입은 필요에 따라 조정
import type { Test, Section, Question } from "@/types/test";

export default async function TestResultPage({
  params,
}: {
  params: { testId: string };
}) {
  const { testId } = params;

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      sections: {
        include: { questions: true },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!test) return notFound();

  // ✅ Prisma 결과를 타입에 맞게 정제
  const sanitizedTest: Test = {
    id: test.id,
    sections: test.sections.map(
      (section): Section => ({
        number: section.number,
        type: section.type,
        questions: section.questions.map(
          (q): Question => ({
            index: q.index,
            answer: q.answer ?? "",
            type: q.type,
            score: q.score ?? 1,
            choices: Array.isArray(q.choices) ? q.choices : [],
          })
        ),
      })
    ),
  };

  return <TestResultClient test={sanitizedTest} />;
}
