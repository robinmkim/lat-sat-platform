"use client";

import { useState } from "react";
import { saveQuestion } from "../actions"; // ✅ 경로 확인 필요
import { getLocalQuestion } from "../utils/getLocalQuestion";

export default function QuestionFooter({
  testId,
  sectionNumber,
  questionIndex,
  onNavigate,
}: {
  testId: string;
  sectionNumber: number;
  questionIndex: number;
  onNavigate: (section: number, index: number) => void;
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
      const question = getLocalQuestion(testId, sectionNumber, questionIndex);
      if (!question) {
        alert("저장할 문제 데이터를 찾을 수 없습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("payload", JSON.stringify([question]));

      const result = await saveQuestion(formData);
      if (result.success) {
        alert("문제가 저장되었습니다.");
      } else {
        alert(result.error ?? "저장 실패");
      }
    } catch (e) {
      console.error("❌ 저장 중 오류:", e);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative mt-12 h-16 flex items-center justify-center">
      {/* ⬅ Back 버튼: 왼쪽에 고정 */}
      {hasPrev && (
        <button
          type="button"
          onClick={() => onNavigate(...prev)}
          className="absolute left-0 border rounded px-4 py-2 hover:bg-gray-100 transition"
        >
          ⬅ Back
        </button>
      )}

      {/* 💾 저장 버튼: 항상 정중앙 */}
      <button
        type="button"
        onClick={handleSaveCurrent}
        disabled={isSaving}
        className="border rounded bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "💾 저장"}
      </button>

      {/* ➡ Next or ✅ Finish 버튼: 오른쪽에 고정 */}
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
