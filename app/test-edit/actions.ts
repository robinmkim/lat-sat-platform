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
    if (!payload) return { error: "payload가 누락되었습니다." };

    const changedQuestions = JSON.parse(payload) as QuestionWithRelations[];

    for (const q of changedQuestions) {
      const sectionId = q.sectionId;

      await prisma.$transaction(
        async (tx) => {
          // 1. 기존 question 확인 또는 생성
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
          } else {
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

          // 2. 기존 이미지 제거 (조건부 삭제)
          const questionImageRemoved = !q.showImage || q.images.length === 0;
          const choiceImagesRemoved = q.choices.every(
            (c) => (c.images?.length ?? 0) === 0
          );

          if (questionImageRemoved || choiceImagesRemoved) {
            const oldChoices = await tx.choice.findMany({
              where: { questionId },
              select: { id: true },
            });

            const imageDeleteConditions = [
              questionImageRemoved ? { questionId } : null,
              choiceImagesRemoved
                ? { choiceId: { in: oldChoices.map((c) => c.id) } }
                : null,
            ].filter(
              (
                cond
              ): cond is
                | { questionId: string }
                | { choiceId: { in: string[] } } => cond !== null
            );

            await tx.image.deleteMany({
              where: {
                OR: imageDeleteConditions,
              },
            });
          }

          // 3. 기존 choice, table 제거
          await tx.choice.deleteMany({ where: { questionId } });
          await tx.table.deleteMany({ where: { questionId } });

          // 4. choices → createMany
          const choiceData = q.choices.map((choice, i) => ({
            questionId,
            order: i,
            text: choice.text,
          }));

          await tx.choice.createMany({
            data: choiceData,
            skipDuplicates: true,
          });

          // 5. inserted choices 다시 조회
          const insertedChoices = await tx.choice.findMany({
            where: { questionId },
            orderBy: { order: "asc" },
          });

          // 6. 이미지 삽입
          const imageInserts: {
            url: string;
            externalId: string;
            choiceId?: string;
            questionId?: string;
          }[] = [];

          // 선택지 이미지
          insertedChoices.forEach((choice, i) => {
            const images = q.choices[i]?.images ?? [];
            for (const img of images) {
              if (!img.url) continue;
              imageInserts.push({
                choiceId: choice.id,
                url: img.url,
                externalId: img.id ?? "",
              });
            }
          });

          // 본문 이미지
          if (q.showImage && q.images?.length) {
            for (const img of q.images ?? []) {
              if (!img.url) continue;
              imageInserts.push({
                questionId,
                url: img.url,
                externalId: img.id ?? "",
              });
            }
          }

          if (imageInserts.length > 0) {
            await tx.image.createMany({
              data: imageInserts,
              skipDuplicates: true,
            });
          }

          // 7. 테이블 삽입
          if (q.table && q.showTable) {
            await tx.table.create({
              data: {
                questionId,
                title: q.table.title ?? "",
                data: JSON.stringify(q.table.data ?? [[""]]),
              },
            });
          }
        },
        { timeout: 10000 }
      );
    }

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
