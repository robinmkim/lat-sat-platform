"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getNextQuestionRoute } from "@/action";
import QuestionNavigatorModal from "./QuestionNavigatiorModal";

export default function TestFooter() {
  const router = useRouter();
  const pathname = usePathname();

  const [testId, setTestId] = useState("");
  const [sectionId, setSectionId] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const match = pathname.match(
      /\/test\/(.+?)\/section\/(\d+)(?:\/question\/(\d+))?/
    );

    if (match) {
      const testId = match[1];
      const sectionNum = Number(match[2]);
      const questionNum = match[3] != null ? Number(match[3]) : null;
      const total = sectionNum <= 2 ? 27 : 22;

      setTestId(testId);
      setSectionId(sectionNum);
      setTotalQuestions(total);

      // ✅ review 페이지에서는 항상 마지막 문제 index로 설정
      if (pathname.endsWith("/review")) {
        setQuestionIndex(total);
      } else if (questionNum != null) {
        setQuestionIndex(questionNum);
      }

      const bookmarkKey = `bookmark-${testId}-section-${sectionNum}`;
      const stored = sessionStorage.getItem(bookmarkKey);
      setBookmarks(stored ? JSON.parse(stored) : {});
    }
  }, [pathname]);

  const isFirstQuestion = questionIndex === 1;
  const isLastQuestionInSection =
    (sectionId <= 2 && questionIndex === 27) ||
    (sectionId >= 3 && questionIndex === 22);
  const isLastSection = sectionId === 4;
  const isFinalQuestion = isLastSection && isLastQuestionInSection;

  const autoSaveEmptyAnswer = () => {
    try {
      const answerKey = `answers-${testId}`;
      const sectionKey = `section${sectionId}`;
      const stored = sessionStorage.getItem(answerKey);
      const parsed = stored ? JSON.parse(stored) : {};
      const sectionAnswers = parsed[sectionKey] || {};

      if (sectionAnswers[questionIndex] === undefined) {
        sectionAnswers[questionIndex] = "";
        parsed[sectionKey] = sectionAnswers;
        sessionStorage.setItem(answerKey, JSON.stringify(parsed));
      }
    } catch {
      // 무시
    }
  };

  const handleNavigate = async (direction: "next" | "prev") => {
    autoSaveEmptyAnswer();
    setIsLoading(true);

    // ✅ review 페이지인 경우
    if (pathname.endsWith("/review")) {
      if (direction === "next") {
        const confirmNext = confirm("다음 섹션으로 이동할까요?");
        if (!confirmNext) {
          setIsLoading(false);
          return;
        }

        // ✅ 현재 섹션의 마지막 index보다 1 큰 값으로 넘겨야 다음 섹션으로 이동함
        const lastIndex = sectionId <= 2 ? 27 : 22;
        const targetIndex = lastIndex + 1;

        const route = await getNextQuestionRoute(
          testId,
          sectionId,
          targetIndex,
          "next"
        );

        if (route) {
          router.push(route);
        } else {
          router.push(`/test-result/${testId}`);
        }

        setIsLoading(false);
        return;
      }
    }

    // ✅ 마지막 문제인 경우 → review 페이지로 이동
    if (direction === "next" && isLastQuestionInSection) {
      if (isFinalQuestion) {
        router.push(`/test-result/${testId}`);
      } else {
        router.push(`/test/${testId}/section/${sectionId}/review`);
      }
      setIsLoading(false);
      return;
    }

    // ✅ 일반적인 prev/next 이동
    const offset = direction === "next" ? 1 : -1;
    const targetIndex = questionIndex + offset;

    const route = await getNextQuestionRoute(
      testId,
      sectionId,
      targetIndex,
      direction
    );

    if (!route) {
      alert(
        direction === "prev"
          ? "This is the first question."
          : "다음 문제를 찾을 수 없습니다."
      );
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
            disabled={
              isLoading || (isFirstQuestion && !pathname.endsWith("/review"))
            }
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
