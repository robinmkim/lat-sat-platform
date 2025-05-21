"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MultipleChoice from "@/app/components/MultipleChoice";
import BookmarkToggle from "@/app/components/BookmarkToggle";
import QuestionNavigatorModal from "@/app/test/components/QuestionNavigatiorModal";
import TestHeader from "@/app/test/components/TestHeader";

type Choice = {
  id: string;
  text: string;
};

type Props = {
  testId: string;
  sectionId: number;
  totalQuestions: number;
  question: {
    index: number;
    questionText: string;
    passage?: string | null;
    choices: Choice[];
  };
  prevRoute: string | null;
  nextRoute: string | null;
};

export default function TestSolveClient({
  testId,
  sectionId,
  totalQuestions,
  question,
  prevRoute,
  nextRoute,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [isRestored, setIsRestored] = useState(false); // ✅ 복원 완료 여부
  const storageKey = `bookmark-${testId}-section-${sectionId}`;

  // ✅ 복원: mount 시 1회
  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    console.log("🔄 [복원 시도]", storageKey, stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("✅ [복원 성공]", parsed);
        setBookmarks(parsed);
      } catch (err) {
        console.warn("❌ [복원 실패]", err);
        setBookmarks({});
      }
    } else {
      console.log("🚫 [복원 없음]");
      setBookmarks({});
    }
    setIsRestored(true); // ✅ 복원 완료 표시
  }, [storageKey]);

  // ✅ 저장: 복원 후에만 저장
  useEffect(() => {
    if (!isRestored) return;
    console.log("💾 [저장]", storageKey, bookmarks);
    sessionStorage.setItem(storageKey, JSON.stringify(bookmarks));
  }, [bookmarks, isRestored]);

  const toggleBookmark = (index: number) => {
    console.log("🔖 [토글 요청]", index);
    setBookmarks((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      console.log("➡️ [북마크 상태]", next);
      return next;
    });
  };

  return (
    <div className="flex flex-col w-full h-[80vh]">
      <TestHeader sectionNumber={sectionId} testId={testId} />

      <div className="flex flex-grow items-stretch w-full">
        <div className="flex justify-center w-1/2 overflow-y-auto p-5">
          <span>{question.passage ?? "No passage provided."}</span>
        </div>

        <div className="w-1.5 bg-gray-400" />

        <div className="flex flex-col w-1/2 overflow-y-auto p-5">
          <div className="flex w-full border-b-2 border-dashed items-center justify-between">
            <div className="w-8 bg-black text-white text-center py-1">
              {question.index}
            </div>
            <div className="flex-1 bg-gray-300 pl-2 py-1">
              <BookmarkToggle
                index={question.index}
                marked={bookmarks[question.index] ?? false}
                onToggle={toggleBookmark}
              />
            </div>
          </div>

          <div className="mt-4 mb-2">{question.questionText}</div>
          <MultipleChoice choices={question.choices} />
        </div>
      </div>

      <div className="relative flex items-center justify-between w-full h-[50px] bg-blue-100 border-t-2 border-dashed px-5">
        <div className="text-sm">Minseob Kim</div>

        <button
          onClick={() => setShowModal(true)}
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-fit h-fit bg-gray-900 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-gray-800 transition"
        >
          Question {question.index} of {totalQuestions} ⌄
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={prevRoute ?? "#"}
            aria-disabled={!prevRoute}
            className={`flex items-center justify-center w-fit h-fit bg-gray-300 rounded-xl px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-400 transition ${
              !prevRoute ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Back
          </Link>
          <Link
            href={nextRoute ?? "#"}
            aria-disabled={!nextRoute}
            className={`flex items-center justify-center w-fit h-fit bg-blue-700 rounded-xl px-3 py-1 text-sm text-white font-medium hover:bg-blue-800 transition ${
              !nextRoute ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Next
          </Link>
        </div>
      </div>

      {showModal && (
        <QuestionNavigatorModal
          testId={testId}
          sectionId={sectionId}
          total={totalQuestions}
          current={question.index}
          bookmarks={bookmarks}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
