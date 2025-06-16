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

  const sorted = [...section.questions].sort((a, b) => a.index - b.index);
  const total = sorted.length;

  const inSection = sorted.some((q) => q.index === targetIndex);

  // ✅ 섹션 내부 이동
  if (inSection) {
    return `/test/${testId}/section/${sectionNumber}/question/${targetIndex}`;
  }

  // ✅ 섹션 밖으로 넘어갈 경우 (예: section1/review → section2/question/1)
  if (direction === "next" && (!inSection || targetIndex > total)) {
    const adjacentSection = await prisma.section.findFirst({
      where: {
        testId,
        number: { gt: sectionNumber },
      },
      orderBy: { number: "asc" },
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

  // ✅ 섹션 첫 문제 이전 → 이전 섹션의 마지막 문제
  if (direction === "prev" && targetIndex <= 0) {
    const prevSection = await prisma.section.findFirst({
      where: {
        testId,
        number: { lt: sectionNumber },
      },
      orderBy: { number: "desc" },
      include: {
        questions: true,
      },
    });

    if (prevSection) {
      const lastIndex = Math.max(...prevSection.questions.map((q) => q.index));
      return `/test/${testId}/section/${prevSection.number}/question/${lastIndex}`;
    }

    return null;
  }

  return null;
}
