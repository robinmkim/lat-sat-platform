// app/actions/getTestRoute.ts
"use server";

import { prisma } from "lib/prisma";

export async function getFirstSolveRoute(testId: string): Promise<string> {
  const section = await prisma.section.findFirst({
    where: {
      testId,
      number: 1,
    },
    include: {
      questions: {
        where: { index: 1 },
        take: 1,
        select: { index: true },
      },
    },
  });

  if (!section || section.questions.length === 0) {
    throw new Error("첫 섹션 또는 문제를 찾을 수 없습니다.");
  }

  const questionIndex = section.questions[0].index;
  return `/test/${testId}/section/1/question/${questionIndex}`;
}

export async function getNextQuestionRoute(
  testId: string,
  sectionNumber: number,
  targetIndex: number,
  direction: "next" | "prev"
): Promise<string | null> {
  const section = await prisma.section.findUnique({
    where: {
      testId_number: {
        testId,
        number: sectionNumber,
      },
    },
    include: {
      questions: true,
    },
  });

  if (!section) return null;

  const inSection = section.questions.some((q) => q.index === targetIndex);
  if (inSection) {
    return `/test/${testId}/section/${sectionNumber}/question/${targetIndex}`;
  }

  // next 섹션 또는 이전 섹션으로 넘어가야 하는 경우
  const adjacentSection = await prisma.section.findFirst({
    where: {
      testId,
      number:
        direction === "next" ? { gt: sectionNumber } : { lt: sectionNumber },
    },
    orderBy: {
      number: direction === "next" ? "asc" : "desc",
    },
    include: {
      questions: {
        where: { index: 1 },
        take: 1,
      },
    },
  });

  if (adjacentSection && adjacentSection.questions.length > 0) {
    return `/test/${testId}/section/${adjacentSection.number}/question/1`;
  }

  return null;
}
