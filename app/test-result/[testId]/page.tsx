export const dynamic = "force-dynamic";

import { prisma } from "lib/prisma";
import TestResultClient from "../TestResultClient";
import { notFound } from "next/navigation";
import type { Test, Section, Question } from "types/test";

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
                select: { text: true }, // ✅ choice.text만
              },
            },
          },
        },
      },
    },
  });

  if (!test) return notFound();

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
            choices: q.choices.map((c) => c.text),
          })
        ),
      })
    ),
  };

  return <TestResultClient test={sanitizedTest} />;
}
