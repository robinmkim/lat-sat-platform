"use client";

import { useRouter } from "next/navigation";
import QuestionForm from "@/app/test-edit/QuestionForm";
import { saveQuestion } from "@/app/test-edit/actions";

interface SectionEditClientProps {
  testId: string;
  sectionId: string;
  sectionNumber: number;
  questionIndex: number;
  initialQuestion: any | null;
}

export default function SectionEditClient({
  testId,
  sectionId,
  sectionNumber,
  questionIndex,
  initialQuestion,
}: SectionEditClientProps) {
  const router = useRouter();

  const handleNavigation = (targetSection: number, targetQuestion: number) => {
    router.push(
      `/test-edit/${testId}/section/${targetSection}/question/${targetQuestion}`
    );
  };
  console.log(sectionId, questionIndex);
  return (
    <form
      id="question-form"
      action={saveQuestion}
      className="w-full max-w-4xl flex flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold">문제 입력</h1>

      <input type="hidden" name="sectionId" value={sectionId} />
      <input type="hidden" name="index" value={questionIndex} />

      <QuestionForm
        sectionNumber={sectionNumber}
        questionIndex={questionIndex}
        initialQuestion={initialQuestion}
      />

      <div className="flex justify-between gap-2 mt-4">
        {questionIndex > 1 ? (
          <button
            type="button"
            onClick={() => handleNavigation(sectionNumber, questionIndex - 1)}
            className="px-4 py-2 border rounded"
          >
            ← 이전
          </button>
        ) : sectionNumber > 1 ? (
          <button
            type="button"
            onClick={() => handleNavigation(sectionNumber - 1, 27)}
            className="px-4 py-2 border rounded"
          >
            ← 이전 섹션
          </button>
        ) : (
          <div />
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          저장
        </button>

        {questionIndex < 27 ? (
          <button
            type="button"
            onClick={() => handleNavigation(sectionNumber, questionIndex + 1)}
            className="px-4 py-2 border rounded"
          >
            다음 →
          </button>
        ) : sectionNumber < 4 ? (
          <button
            type="button"
            onClick={() => handleNavigation(sectionNumber + 1, 1)}
            className="px-4 py-2 border rounded"
          >
            다음 섹션 →
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            완료 ✅
          </button>
        )}
      </div>
    </form>
  );
}
