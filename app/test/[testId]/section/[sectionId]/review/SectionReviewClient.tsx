"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Question = {
  id: string;
  index: number;
  question: string;
};

type Props = {
  testId: string;
  sectionId: number;
  questions: Question[];
  nextRoute: string | null;
};

export default function SectionReviewClient({
  testId,
  sectionId,
  questions,
  nextRoute,
}: Props) {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const bookmarkKey = `bookmark-${testId}-section-${sectionId}`;
  const answerKey = `answers-${testId}`;

  useEffect(() => {
    try {
      const storedBookmarks = sessionStorage.getItem(bookmarkKey);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }

      const storedAnswers = sessionStorage.getItem(answerKey);
      if (storedAnswers) {
        const allAnswers = JSON.parse(storedAnswers);
        setAnswers(allAnswers[`section${sectionId}`] || {});
      }
    } catch {
      setBookmarks({});
      setAnswers({});
    }
  }, [bookmarkKey, answerKey, sectionId]);

  return (
    <div className="flex flex-col items-center w-full h-[80vh] bg-white px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Check Your Work</h2>
      <p className="text-sm text-gray-600 max-w-xl text-center mb-6">
        On test day, you won’t be able to move on to the next module until time
        expires. <br />
        For these practice questions, you can click <strong>Next</strong> when
        you’re ready to move on.
      </p>

      <div className="bg-white border rounded-xl shadow max-w-2xl w-full px-6 py-4">
        <div className="text-base font-semibold mb-4">
          Section {sectionId}, Module 1: Reading and Writing Questions
        </div>

        <div className="grid grid-cols-10 gap-2">
          {questions.map((q) => {
            const marked = bookmarks[q.index];
            const rawAnswer = answers[q.index];
            const answered = rawAnswer !== undefined && rawAnswer.trim() !== "";

            return (
              <Link
                key={q.index}
                href={`/test/${testId}/section/${sectionId}/question/${q.index}`}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold relative ${
                  answered
                    ? "bg-blue-600 text-white"
                    : "border border-black text-black"
                }`}
              >
                {q.index}
                {marked && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-4 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-black" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500" />
            <span>For Review</span>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="flex justify-between w-full max-w-2xl mt-8">
        <Link
          href={`/test/${testId}/section/${sectionId}/question/1`}
          className="bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400 transition"
        >
          Back
        </Link>
        {nextRoute && (
          <Link
            href={nextRoute}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
