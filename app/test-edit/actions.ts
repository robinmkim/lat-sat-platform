"use server";

import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import type { QuestionWithRelations } from "types/question";

export async function saveQuestion(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const sectionId = formData.get("sectionId") as string;
    const payload = formData.get("payload") as string;

    if (!sectionId || !payload) {
      return { error: "필수 값이 누락되었습니다." };
    }

    const changedQuestions = JSON.parse(payload) as QuestionWithRelations[];

    for (const q of changedQuestions) {
      // ✅ Question upsert
      const savedQuestion = await prisma.question.upsert({
        where: {
          sectionId_index: {
            sectionId,
            index: q.index,
          },
        },
        create: {
          sectionId,
          index: q.index,
          question: q.question,
          passage: q.passage,
          answer: q.answer,
          type: q.type,
          showTable: q.showTable,
          showImage: q.showImage,
          score: q.score ?? 1,
        },
        update: {
          question: q.question,
          passage: q.passage,
          answer: q.answer,
          type: q.type,
          showTable: q.showTable,
          showImage: q.showImage,
          score: q.score ?? 1,
        },
      });

      const questionId = savedQuestion.id;

      // ✅ 기존 choice 및 관련 이미지 삭제
      const oldChoices = await prisma.choice.findMany({
        where: { questionId },
        select: { id: true },
      });

      const oldChoiceIds = oldChoices.map((c) => c.id);
      await prisma.image.deleteMany({
        where: { choiceId: { in: oldChoiceIds } },
      });
      await prisma.choice.deleteMany({ where: { questionId } });

      // ✅ Choice & 이미지 재삽입
      for (const [order, choice] of q.choices.entries()) {
        const created = await prisma.choice.create({
          data: {
            questionId,
            order,
            text: choice.text,
          },
        });

        if (choice.images?.length) {
          await prisma.image.createMany({
            data: choice.images.map((img) => ({
              choiceId: created.id,
              url: img.url,
              externalId: img.id,
            })),
          });
        }
      }

      // ✅ 기존 본문 이미지 삭제 및 재삽입
      await prisma.image.deleteMany({ where: { questionId } });
      if (q.images?.length) {
        await prisma.image.createMany({
          data: q.images.map((img) => ({
            questionId,
            url: img.url,
            externalId: img.id,
          })),
        });
      }

      // ✅ 기존 테이블 삭제 및 재삽입
      await prisma.table.deleteMany({ where: { questionId } });
      if (q.table && q.showTable) {
        await prisma.table.create({
          data: {
            questionId,
            title: q.table.title ?? "",
            data: q.table.data ?? [],
          },
        });
      }
    }

    // ✅ 캐시 무효화
    revalidatePath("/test-list");

    return { success: true };
  } catch (err) {
    console.error("saveQuestion error:", err);
    return { error: "문제 저장 중 오류가 발생했습니다." };
  }
}

export async function deleteTestById(testId: string) {
  // ✅ 1. 해당 테스트에 속한 모든 questionId, choiceId 추출
  const questions = await prisma.question.findMany({
    where: {
      section: {
        testId,
      },
    },
    select: {
      id: true,
      choices: {
        select: {
          id: true,
        },
      },
    },
  });

  // ✅ 2. questionId, choiceId 기준 이미지 ID 모으기
  const questionIds = questions.map((q) => q.id);
  const choiceIds = questions.flatMap((q) => q.choices.map((c) => c.id));

  const images = await prisma.image.findMany({
    where: {
      OR: [
        { questionId: { in: questionIds } },
        { choiceId: { in: choiceIds } },
      ],
    },
    select: {
      id: true,
    },
  });

  // ✅ 3. Cloudflare 이미지 삭제
  for (const image of images) {
    await deleteImageFromCloudflare(image.id);
  }

  // ✅ 4. 테스트 삭제 (Cascade 처리됨)
  await prisma.test.delete({
    where: { id: testId },
  });

  // ✅ 5. 캐시 무효화
  revalidatePath("/test-list");
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
