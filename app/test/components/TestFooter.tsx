"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { getNextQuestionRoute } from "@/app/action";
import QuestionNavigatorModal from "./QuestionNavigatiorModal";

type Props = {
  sectionId: number;
  questionIndex: number;
  testId: string;
  totalQuestions: number;
};

export default function TestFooter({
  sectionId,
  questionIndex,
  testId,
  totalQuestions,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleNavigate = (direction: "next" | "prev") => {
    const offset = direction === "next" ? 1 : -1;
    const targetIndex = questionIndex + offset;
    startTransition(async () => {
      const route = await getNextQuestionRoute(testId, sectionId, targetIndex);
      if (!route) {
        alert(
          direction === "next"
            ? "This is the last question."
            : "This is the first question."
        );
        return;
      }
      router.push(route);
    });
  };

  return (
    <>
      <div className="relative flex items-center justify-between w-full h-[50px] bg-blue-100 border-t-2 border-dashed px-5">
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
            disabled={isPending}
            className="flex items-center justify-center w-fit h-fit bg-gray-300 rounded-xl px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-400 transition disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => handleNavigate("next")}
            disabled={isPending}
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
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
