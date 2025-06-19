"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  testId: string;
  sectionId: number;
  nextRoute: string | null;
};

export default function SectionReviewClient({ testId, sectionId }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});

  const answerKey = `answers-${testId}`;
  const bookmarkKey = `bookmark-${testId}-section-${sectionId}`;

  useEffect(() => {
    const rawAns = sessionStorage.getItem(answerKey);
    if (rawAns) {
      try {
        const parsed = JSON.parse(rawAns);
        const secAns = parsed[`section${sectionId}`];
        setAnswers(typeof secAns === "object" ? secAns : {});
      } catch {}
    }

    const rawBm = sessionStorage.getItem(bookmarkKey);
    if (rawBm) {
      try {
        const parsed = JSON.parse(rawBm);
        setBookmarks(typeof parsed === "object" ? parsed : {});
      } catch {}
    }
  }, [answerKey, bookmarkKey, sectionId]);

  // answers 키에 포함된 질문 번호들을 가져와 정렬
  const questionIndexes = Object.keys(answers)
    .map((k) => Number(k))
    .sort((a, b) => a - b);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="mb-10">Review Your Answers</h2>

      <div className="grid grid-cols-10 gap-2 mb-6 w-full max-w-2xl">
        {questionIndexes.map((idx) => (
          <Link
            key={idx}
            href={`/test/${testId}/section/${sectionId}/question/${idx}`}
            className={`
              flex items-center justify-center w-10 h-10 rounded text-sm font-semibold relative
              ${
                answers[idx]?.trim()
                  ? "bg-blue-600 text-white"
                  : "border border-black text-black"
              }
            `}
          >
            {idx}
            {bookmarks[idx] && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
