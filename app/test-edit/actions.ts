"use server";

import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import type { QuestionWithRelations } from "types/question";

export async function saveQuestion(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const payload = formData.get("payload") as string;

    if (!payload) {
      return { error: "저장할 데이터가 없습니다." };
    }

    const changedQuestions = JSON.parse(payload) as QuestionWithRelations[];

    await prisma.$transaction(
      async (tx) => {
        for (const q of changedQuestions) {
          const sectionId = q.sectionId; // ✅ 각 문제에서 sectionId 직접 사용

          // ✅ 1. Question upsert
          const savedQuestion = await tx.question.upsert({
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

          // ✅ 2. 관련 데이터 삭제
          await Promise.all([
            tx.image.deleteMany({
              where: {
                OR: [{ questionId }, { choice: { questionId } }],
              },
            }),
            tx.choice.deleteMany({ where: { questionId } }),
            tx.table.deleteMany({ where: { questionId } }),
          ]);

          // ✅ 3. 선택지 + 이미지 삽입
          for (const [order, choice] of q.choices.entries()) {
            const created = await tx.choice.create({
              data: {
                questionId,
                order,
                text: choice.text,
              },
            });

            if (choice.images?.length) {
              await tx.image.createMany({
                data: choice.images.map((img) => ({
                  choiceId: created.id,
                  url: img.url,
                  externalId: img.id ?? "",
                })),
              });
            }
          }

          // ✅ 4. 본문 이미지 삽입
          if (q.images && q.images.length > 0) {
            await tx.image.deleteMany({
              where: { questionId },
            });

            await tx.image.createMany({
              data: q.images.map((img) => ({
                questionId,
                url: img.url,
                externalId: img.id ?? "",
              })),
            });
          }

          // ✅ 5. 테이블 삽입
          if (q.table && q.showTable) {
            await tx.table.create({
              data: {
                questionId,
                title: q.table.title ?? "",
                data: JSON.stringify(q.table.data ?? [[""]]),
              },
            });
          }
        }
      },
      { timeout: 15000 } // ⏱ 여유롭게 설정
    );

    // ✅ 저장 후 캐시 무효화
    revalidatePath("/test-list");

    return { success: true };
  } catch (err) {
    console.error("❌ saveQuestion error:", err);
    return { error: "문제 저장 중 오류가 발생했습니다." };
  }
}

export async function saveQuestionV2(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const payload = formData.get("payload") as string;

    if (!payload) {
      return { error: "payload가 누락되었습니다." };
    }

    const changedQuestions = JSON.parse(payload) as QuestionWithRelations[];

    await prisma.$transaction(async (tx) => {
      for (const q of changedQuestions) {
        const sectionId = q.sectionId; // ✅ 각 질문마다의 실제 sectionId 사용

        // ✅ 기존 Question 존재 여부 확인
        const existing = await tx.question.findUnique({
          where: {
            sectionId_index: {
              sectionId,
              index: q.index,
            },
          },
        });

        let savedQuestion;

        if (existing) {
          // ✅ update
          savedQuestion = await tx.question.update({
            where: { id: existing.id },
            data: {
              question: q.question,
              passage: q.passage,
              answer: q.answer,
              type: q.type,
              showTable: q.showTable,
              showImage: q.showImage,
              score: q.score ?? 1,
            },
          });

          // 기존 choices, tables, images 제거 후 다시 삽입
          const oldChoices = await tx.choice.findMany({
            where: { questionId: savedQuestion.id },
            select: { id: true },
          });
          const oldChoiceIds = oldChoices.map((c) => c.id);

          await tx.image.deleteMany({
            where: {
              OR: [
                { choiceId: { in: oldChoiceIds } },
                { questionId: savedQuestion.id },
              ],
            },
          });
          await tx.choice.deleteMany({
            where: { questionId: savedQuestion.id },
          });
          await tx.table.deleteMany({
            where: { questionId: savedQuestion.id },
          });
        } else {
          // ✅ create
          savedQuestion = await tx.question.create({
            data: {
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
          });
        }

        const questionId = savedQuestion.id;

        // ✅ choice 및 이미지 삽입
        for (const [order, choice] of q.choices.entries()) {
          const createdChoice = await tx.choice.create({
            data: {
              questionId,
              order,
              text: choice.text,
            },
          });

          if (choice.images?.length) {
            await tx.image.createMany({
              data: choice.images.map((img) => ({
                choiceId: createdChoice.id,
                url: img.url,
                externalId: img.id ?? "",
              })),
            });
          }
        }

        // ✅ question 본문 이미지 삽입
        if (q.images?.length) {
          await tx.image.createMany({
            data: q.images.map((img) => ({
              questionId,
              url: img.url,
              externalId: img.id ?? "",
            })),
          });
        }

        // ✅ 테이블 삽입
        if (q.table && q.showTable) {
          await tx.table.create({
            data: {
              questionId,
              title: q.table.title ?? "",
              data: JSON.stringify(q.table.data ?? [[""]]),
            },
          });
        }
      }
    });

    revalidatePath("/test-list");
    return { success: true };
  } catch (err) {
    console.error("❌ saveQuestion error:", err);
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
