"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveQuestion(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const sectionId = formData.get("sectionId") as string;
    const payload = formData.get("payload") as string;

    if (!sectionId || !payload) {
      return { error: "필수 값이 누락되었습니다." };
    }

    const allQuestions = JSON.parse(payload);

    for (const question of allQuestions) {
      const commonData = {
        sectionId,
        index: question.index,
        questionText: question.question,
        passage: question.passage,
        choices: question.choices
          ? JSON.stringify(question.choices)
          : undefined, // ✅
        answer: question.answer != null ? String(question.answer) : null,
        type: question.type,
        tableTitle: question.tableTitle,
        tableData: question.tableData
          ? JSON.stringify(question.tableData)
          : undefined, // ✅
        imageUrl: question.imageUrl,
        showTable: question.showTable,
        showImage: question.showImage,
        score: question.score ?? 1,
      };

      await prisma.question.upsert({
        where: {
          sectionId_index: {
            sectionId,
            index: question.index,
          },
        },
        update: commonData,
        create: commonData,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("saveQuestion error:", err);
    return { error: "문제 저장 중 오류가 발생했습니다." };
  }
}

async function deleteImageFromCloudflare(imageId: string) {
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );
  } catch (e) {
    console.warn("Cloudflare 이미지 삭제 실패:", imageId, e);
  }
}

export async function deleteTestById(testId: string) {
  // ✅ 해당 테스트의 모든 이미지 ID 조회
  const questionsWithImages = await prisma.question.findMany({
    where: {
      section: {
        testId,
      },
      imageId: {
        not: null,
      },
    },
    select: {
      imageId: true,
    },
  });

  // ✅ Cloudflare 이미지 삭제
  for (const { imageId } of questionsWithImages) {
    if (imageId) await deleteImageFromCloudflare(imageId);
  }

  // ✅ 테스트 삭제
  await prisma.test.delete({ where: { id: testId } });

  // ✅ 캐시 무효화
  revalidatePath("/test-list");
}
