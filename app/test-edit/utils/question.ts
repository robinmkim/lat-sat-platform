import type {
  SectionWithQuestions,
  QuestionWithRelations,
} from "types/question";

export function normalizeAnswer(
  raw: unknown,
  type: "MULTIPLE" | "SHORT"
): string | number {
  if (type === "MULTIPLE") {
    return typeof raw === "number" ? raw : 0;
  }
  // SHORT
  return typeof raw === "string" ? raw : "";
}

type UploadedImage = { imageUrl: string; imageId: string };

// 외부: 업로드 함수
async function uploadImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("이미지 업로드 실패");

  const result = await res.json();
  if (!result.imageUrl || !result.imageId)
    throw new Error("잘못된 업로드 응답");

  return { imageUrl: result.imageUrl, imageId: result.imageId };
}

// ✅ 핵심: 변경된 문제 추출 및 이미지 업로드 적용
export async function prepareChangedQuestions(
  originalSection: SectionWithQuestions | undefined,
  updatedSection: SectionWithQuestions,
  uploadedMap: Map<string, File>
): Promise<QuestionWithRelations[]> {
  const changedQuestions: QuestionWithRelations[] = [];

  for (const updated of updatedSection.questions) {
    const original = originalSection?.questions.find(
      (q) => q.index === updated.index
    );
    const isChanged =
      !original || JSON.stringify(original) !== JSON.stringify(updated);
    if (!isChanged) continue;

    // ✅ 본문 이미지 업로드
    const questionImageKey = `q${updated.index}`;
    const images: { id: string; url: string }[] = [];
    if (uploadedMap.has(questionImageKey)) {
      const file = uploadedMap.get(questionImageKey)!;
      const { imageUrl, imageId } = await uploadImage(file);
      images.push({ id: imageId, url: imageUrl });
    }

    // ✅ 선택지 이미지 업로드
    const updatedChoices = await Promise.all(
      updated.choices.map(async (choice, i) => {
        const choiceKey = `q${updated.index}-choice-${i}`;
        if (uploadedMap.has(choiceKey)) {
          const file = uploadedMap.get(choiceKey)!;
          const { imageUrl, imageId } = await uploadImage(file);
          return {
            ...choice,
            images: [{ id: imageId, url: imageUrl }],
          };
        }
        return choice;
      })
    );

    changedQuestions.push({
      ...updated,
      images,
      choices: updatedChoices,
    });
  }

  return changedQuestions;
}
