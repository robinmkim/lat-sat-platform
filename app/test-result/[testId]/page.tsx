export const dynamic = "force-dynamic";

import { prisma } from "lib/prisma";
import TestResultClient from "../TestResultClient";
import { notFound } from "next/navigation";
import type { Test, Section, Question } from "types/test";

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

  // ✅ 타입에 맞게 정제
  const sanitizedTest: Test = {
    id: test.id,
    sections: test.sections.map(
      (section): Section => ({
        number: section.number,
        type: section.type,
        questions: section.questions.map(
          (q): Question => ({
            index: q.index,
            answer: q.answer ?? "", // 보통 "0", "1" 등으로 저장된 인덱스형 정답
            type: q.type,
            score: q.score ?? 1,
            choices: q.choices.map((c) => c.text), // text만 추출
          })
        ),
      })
    ),
  };

  return <TestResultClient test={sanitizedTest} />;
}
