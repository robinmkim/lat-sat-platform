// app/test-add/actions/createTest.ts
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createTestWithSections(formData: FormData) {
  const title = formData.get("title")?.toString().trim() || "Untitled Test";

  try {
    // ✅ 동일한 이름의 시험이 이미 존재하면 무시 (선택사항)
    const existing = await prisma.test.findFirst({
      where: { name: title },
    });

    if (existing) {
      redirect(`/test-edit/${existing.id}/section/1/question/1`);
    }

    // ✅ 1. 시험 생성
    const test = await prisma.test.create({
      data: { name: title },
    });

    // ✅ 2. 타입 순서대로 섹션 생성
    const types = [
      "READING_WRITING",
      "MATH",
      "READING_WRITING",
      "MATH",
    ] as const;

    for (let i = 0; i < 4; i++) {
      await prisma.section.create({
        data: {
          number: i + 1,
          type: types[i],
          testId: test.id,
        },
      });
    }

    // ✅ 3. 첫 섹션으로 이동
    redirect(`/test-edit/${test.id}/section/1/question/1`);
  } catch (e) {
    console.error("❌ 시험 생성 중 오류 발생:", e);
    throw new Error("시험 생성에 실패했습니다.");
  }
}
