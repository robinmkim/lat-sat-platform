"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonNavigatorModal from "./LessonNavigatorModal";

const FINAL_SECTION = 4;

const sectionStructure = [
  { sectionId: 1, total: 27 },
  { sectionId: 2, total: 27 },
  { sectionId: 3, total: 22 },
  { sectionId: 4, total: 22 },
];

type Props = {
  testId: string;
  sectionId: number;
  currentIndex: number;
  totalQuestions: number;
};

export default function LessonFooter({
  testId,
  sectionId,
  currentIndex,
  totalQuestions,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleMove = (offset: number) => {
    const nextIndex = currentIndex + offset;

    // 이전 섹션으로 이동
    if (offset < 0 && nextIndex < 1) {
      const prevSectionIndex =
        sectionStructure.findIndex((s) => s.sectionId === sectionId) - 1;
      if (prevSectionIndex < 0) return;
      const prev = sectionStructure[prevSectionIndex];
      router.push(
        `/test-lesson/${testId}/section/${prev.sectionId}/question/${prev.total}`
      );
      return;
    }

    // 다음 섹션으로 이동
    if (offset > 0 && nextIndex > totalQuestions) {
      const nextSection = sectionId + 1;
      if (nextSection > FINAL_SECTION) {
        alert("Lesson complete! Returning to home page.");
        router.push("/");
        return;
      }
      router.push(`/test-lesson/${testId}/section/${nextSection}/question/1`);
      return;
    }

    if (nextIndex >= 1 && nextIndex <= totalQuestions) {
      router.push(
        `/test-lesson/${testId}/section/${sectionId}/question/${nextIndex}`
      );
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-between w-full h-[50px] shrink-0 bg-blue-100 border-t-2 border-dashed px-5">
        <div className="text-sm">Lesson Mode</div>

        <button
          onClick={() => setShowModal(true)}
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-fit h-fit bg-gray-900 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-gray-800 transition"
        >
          Question {currentIndex} of {totalQuestions} ⌄
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMove(-1)}
            className="px-4 py-1 rounded bg-gray-300 text-sm font-medium"
          >
            Back
          </button>
          <button
            onClick={() => handleMove(1)}
            className="px-4 py-1 rounded bg-blue-600 text-white text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <LessonNavigatorModal
          testId={testId}
          currentSection={sectionId}
          currentIndex={currentIndex}
          sections={sectionStructure}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
