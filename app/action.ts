// app/actions/getTestRoute.ts
"use server";

import { prisma } from "@/lib/prisma";

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
  questionIndex: number
): Promise<string | null> {
  // 현재 섹션 조회
  const section = await prisma.section.findFirst({
    where: { testId, number: sectionNumber },
  });

  if (!section) return null;

  // 현재 섹션 내 다음 문제 시도
  const targetQuestion = await prisma.question.findFirst({
    where: {
      sectionId: section.id,
      index: questionIndex,
    },
  });

  if (targetQuestion) {
    return `/test/${testId}/section/${sectionNumber}/question/${targetQuestion.index}`;
  }

  // 다음 섹션 존재 여부 확인
  const nextSection = await prisma.section.findFirst({
    where: {
      testId,
      number: sectionNumber + 1,
    },
    include: {
      questions: {
        where: { index: 1 },
        take: 1,
      },
    },
  });

  if (nextSection && nextSection.questions.length > 0) {
    return `/test/${testId}/section/${nextSection.number}/question/1`;
  }

  // 다음 섹션이 없거나 문제 없음 → 종료
  return null;
}
