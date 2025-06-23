"use client";

import { useState } from "react";

export default function QuestionFooter({
  sectionNumber,
  questionIndex,
  onNavigate,
  onSingleSave, // ✅ 새로 추가
}: {
  testId: string;
  sectionNumber: number;
  questionIndex: number;
  onNavigate: (section: number, index: number) => void;
  onSingleSave: () => Promise<void>; // ✅ 새로 추가
}) {
  const [isSaving, setIsSaving] = useState(false);

  const totalQuestionsBySection: Record<number, number> = {
    1: 27,
    2: 27,
    3: 22,
    4: 22,
  };

  const totalCurrentSection = totalQuestionsBySection[sectionNumber];
  const isLastSection = sectionNumber === 4;
  const isFirstSection = sectionNumber === 1;

  const isLastQuestion = questionIndex === totalCurrentSection && isLastSection;
  const hasPrev = questionIndex > 1 || !isFirstSection;
  const hasNext = !isLastQuestion;

  let prev: [number, number];
  if (questionIndex > 1) {
    prev = [sectionNumber, questionIndex - 1];
  } else {
    const prevSection = sectionNumber - 1;
    const prevTotal = totalQuestionsBySection[prevSection] ?? 27;
    prev = [prevSection, prevTotal];
  }

  let next: [number, number];
  if (questionIndex < totalCurrentSection) {
    next = [sectionNumber, questionIndex + 1];
  } else {
    const nextSection = sectionNumber + 1;
    next = [nextSection, 1];
  }

  const handleSaveCurrent = async () => {
    setIsSaving(true);
    try {
      await onSingleSave(); // ✅ 핵심: 외부에서 전달받은 저장 함수 실행
    } catch (e) {
      console.error("❌ 저장 중 오류:", e);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative mt-12 h-16 flex items-center justify-center">
      {hasPrev && (
        <button
          type="button"
          onClick={() => onNavigate(...prev)}
          className="absolute left-0 border rounded px-4 py-2 hover:bg-gray-100 transition"
        >
          ⬅ Back
        </button>
      )}

      <button
        type="button"
        onClick={handleSaveCurrent}
        disabled={isSaving}
        className="border rounded bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "💾 저장"}
      </button>

      {hasNext ? (
        <button
          type="button"
          onClick={() => onNavigate(...next)}
          className="absolute right-0 border rounded px-4 py-2 hover:bg-gray-100 transition"
        >
          Next ➡
        </button>
      ) : (
        <button
          type="submit"
          form="question-form"
          className="absolute right-0 border rounded bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition"
        >
          Finish ✅
        </button>
      )}
    </div>
  );
}
