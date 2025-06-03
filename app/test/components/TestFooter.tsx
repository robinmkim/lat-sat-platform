"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getNextQuestionRoute } from "@/app/action";
import QuestionNavigatorModal from "./QuestionNavigatiorModal";

type Props = {
  sectionId: number;
  questionIndex: number;
  testId: string;
  totalQuestions: number;
  bookmarks: Record<number, boolean>;
};

export default function TestFooter({
  sectionId,
  questionIndex,
  testId,
  totalQuestions,
  bookmarks,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isFirstQuestion = questionIndex === 1;
  const isLastQuestionInSection = questionIndex === totalQuestions;
  const isLastSection = sectionId === 4;
  const isFinalQuestion = isLastSection && isLastQuestionInSection;

  console.log(questionIndex);

  const handleNavigate = async (direction: "next" | "prev") => {
    setIsLoading(true);
    const offset = direction === "next" ? 1 : -1;
    const targetIndex = questionIndex + offset;

    // ✅ 4-27 → test-result 이동
    if (direction === "next" && isFinalQuestion) {
      setIsLoading(true); // ✅ optional: 로딩 상태 표시
      router.push(`/test-result/${testId}`);
      return;
    }

    const route = await getNextQuestionRoute(
      testId,
      sectionId,
      targetIndex,
      direction
    );

    if (!route) {
      if (direction === "prev") {
        alert("This is the first question.");
      } else {
        alert("다음 문제를 찾을 수 없습니다.");
      }
      setIsLoading(false);
      return;
    }

    router.push(route);
    setIsLoading(false);
  };
  return (
    <>
      <div className="relative flex items-center justify-between w-full h-[50px] shrink-0 bg-blue-100 border-t-2 border-dashed px-5">
        <div className="text-sm">Minseob Kim</div>

        <button
          onClick={() => setShowModal(true)}
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-fit h-fit bg-gray-900 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-gray-800 transition"
        >
          Question {questionIndex} of {totalQuestions} ⌄
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigate("prev")}
            disabled={isLoading || isFirstQuestion}
            className="flex items-center justify-center w-fit h-fit bg-gray-300 rounded-xl px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-400 transition disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => handleNavigate("next")}
            disabled={isLoading}
            className="flex items-center justify-center w-fit h-fit bg-blue-700 rounded-xl px-3 py-1 text-sm text-white font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <QuestionNavigatorModal
          testId={testId}
          sectionId={sectionId}
          total={totalQuestions}
          current={questionIndex}
          bookmarks={bookmarks}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
