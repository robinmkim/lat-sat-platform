"use server";

import { prisma } from "lib/prisma";

export async function createTestWithSections(title: string) {
  const test = await prisma.test.create({
    data: { name: title },
  });

  const types = ["READING_WRITING", "READING_WRITING", "MATH", "MATH"] as const;
  const counts = [27, 27, 22, 22];

  for (let i = 0; i < 4; i++) {
    const section = await prisma.section.create({
      data: {
        number: i + 1,
        type: types[i],
        testId: test.id,
      },
    });

    const total = counts[i];
    await prisma.question.createMany({
      data: Array.from({ length: total }, (_, j) => ({
        sectionId: section.id,
        index: j + 1,
        question: "",
        passage: null,
        answer: "",
        type: "MULTIPLE",
      })),
    });
  }

  return test.id; // ✅ testId 반환
}
