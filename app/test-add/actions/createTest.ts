// app/test-add/actions/createTest.ts
"use server";

import { prisma } from "@/lib/prisma"; // or "../lib/prisma"
import { redirect } from "next/navigation";

export async function createTestWithSections(formData: FormData) {
  const title = formData.get("title")?.toString() ?? "Untitled Test";

  // 1. 시험 생성
  const test = await prisma.test.create({
    data: { name: title },
  });

  // 2. 타입 순서대로 섹션 생성
  const types = ["READING_WRITING", "MATH", "READING_WRITING", "MATH"] as const;

  for (let i = 0; i < 4; i++) {
    await prisma.section.create({
      data: {
        number: i + 1,
        type: types[i],
        testId: test.id,
      },
    });
  }

  // 3. 첫 섹션으로 이동
  redirect(`/test-edit/${test.id}/section/1`);
}
