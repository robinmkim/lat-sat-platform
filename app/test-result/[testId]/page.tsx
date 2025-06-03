export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import TestResultClient from "../TestResultClient";
import { notFound } from "next/navigation";

// ✅ 타입 import (경로는 실제 위치에 맞게 조정해주세요)
import type { Test, Section, Question } from "@/types/test";

export default async function TestResultPage(
  props: Promise<{ searchParams: { testId?: string } }>
) {
  const { searchParams } = await props;
  const testId = searchParams.testId;
  if (!testId) return notFound();

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

  // ✅ Prisma 결과를 명시 타입으로 정제
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
