"use server";

import { prisma } from "lib/prisma";
import { redirect } from "next/navigation";

export async function createTestWithSections(formData: FormData) {
  const title = formData.get("title")?.toString().trim() || "Untitled Test";

  // ✅ 오류 발생 가능성이 있는 부분만 try로 감싼다
  let testId: string;
  try {
    // 시험 생성
    const test = await prisma.test.create({
      data: { name: title },
    });
    testId = test.id;

    // 섹션 생성
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
  } catch (e) {
    console.error("❌ 시험 생성 중 오류 발생:", e);
    throw new Error("시험 생성에 실패했습니다.");
  }

  // ✅ try-catch 바깥에서 redirect 실행
  redirect(`/test-edit/${testId}/section/1/question/1`);
}
