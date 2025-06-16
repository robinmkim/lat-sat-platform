"use client";

import { useState, useEffect } from "react";
import BookmarkToggle from "@/components/BookmarkToggle";
import TestHeader from "@/test/components/TestHeader";
import TestFooter from "@/test/components/TestFooter";
import MultipleChoice from "@/components/MultipleChoice";
import FractionInput from "@/components/FractionInput";
import { isEmptyTable, renderPassage } from "@/components/common/renderPassage";
import ShortAnswerInstruction from "@/test-edit/components/ShortAnswerInstruction";
import Image from "next/image";

export type Choice = {
  id: string;
  text: string;
};

type QuestionData = {
  index: number;
  question: string;
  passage?: string;
  choices?: Choice[];
  type: "MULTIPLE" | "SHORT";
  tableTitle?: string;
  tableData?: string[][];
  imageUrl?: string;
};

type Props = {
  testId: string;
  sectionId: number;
  totalQuestions: number;
  currentIndex: number;
  questions: QuestionData[];
};

export default function TestSolveClient({
  testId,
  sectionId,
  totalQuestions,
  currentIndex,
  questions,
}: Props) {
  const question = questions.find((q) => q.index === currentIndex)!;

  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<
    Record<string, Record<number, string>>
  >({});

  const bookmarkKey = `bookmark-${testId}-section-${sectionId}`;
  const answerKey = `answers-${testId}`;

  useEffect(() => {
    const stored = sessionStorage.getItem(bookmarkKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookmarks(parsed);
      } catch {
        setBookmarks({});
      }
    }
  }, [bookmarkKey]);

  useEffect(() => {
    const stored = sessionStorage.getItem(answerKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnswers(parsed);
      } catch {
        setAnswers({});
      }
    }
  }, [answerKey]);

  const updateAnswer = (
    sectionId: number,
    questionIndex: number,
    answer: string
  ) => {
    setAnswers((prev) => {
      const sectionKey = `section${sectionId}`;
      const updatedSection = {
        ...prev[sectionKey],
        [questionIndex]: answer,
      };
      const next = {
        ...prev,
        [sectionKey]: updatedSection,
      };
      sessionStorage.setItem(answerKey, JSON.stringify(next));
      return next;
    });
  };

  const toggleBookmark = (index: number) => {
    setBookmarks((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      sessionStorage.setItem(bookmarkKey, JSON.stringify(next));
      return next;
    });
  };

  const isMathMultiple = question.type === "MULTIPLE" && sectionId % 2 === 0;
  const isMathShort = question.type === "SHORT" && sectionId % 2 === 0;
  const showLeftBlock =
    isMathShort ||
    (!isMathMultiple &&
      (question.passage?.trim() ||
        question.tableTitle?.trim() ||
        !isEmptyTable(question.tableData) ||
        question.imageUrl?.trim()));

  const currentAnswer = answers[`section${sectionId}`]?.[question.index] ?? "";

  return (
    <div className="flex flex-col w-full h-[80vh] overflow-hidden">
      <TestHeader
        sectionNumber={sectionId}
        testId={testId}
        questionIndex={question.index}
      />
      <div className="flex flex-grow min-h-0 w-full">
        {showLeftBlock && (
          <div className="flex justify-center w-1/2 h-full p-5 overflow-hidden">
            <div className="flex flex-col w-full gap-4 overflow-y-auto max-h-full">
              {question.imageUrl && (
                <Image
                  src={question.imageUrl}
                  alt="문제 이미지"
                  className="max-w-full max-h-64 border rounded object-contain"
                />
              )}
              {isMathShort && <ShortAnswerInstruction />}
              {!isMathShort && question.tableTitle && (
                <h3 className="text-lg font-semibold">{question.tableTitle}</h3>
              )}
              {!isMathShort && !isEmptyTable(question.tableData) && (
                <table className="w-full table-auto border border-gray-400 bg-white text-sm">
                  <tbody>
                    {question.tableData!.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className="border border-gray-400 px-2 py-1"
                          >
                            {cell || "⠀"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!isMathShort && question.passage && (
                <div>{renderPassage(question.passage)}</div>
              )}
            </div>
          </div>
        )}

        {!isMathMultiple && <div className="w-1.5 bg-gray-400" />}

        <div
          className={`flex flex-col ${
            isMathMultiple ? "w-full" : "w-1/2"
          } p-5 overflow-y-auto min-h-0`}
        >
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

          <div className="mt-4 mb-2">{question.question}</div>

          {question.type === "MULTIPLE" && question.choices && (
            <MultipleChoice
              choices={question.choices}
              selectedIndex={
                currentAnswer !== "" ? parseInt(currentAnswer) : null
              }
              onAnswer={(index) =>
                updateAnswer(sectionId, question.index, index.toString())
              }
            />
          )}

          {question.type === "SHORT" && (
            <FractionInput
              value={currentAnswer}
              onAnswer={(text) => updateAnswer(sectionId, question.index, text)}
            />
          )}
        </div>
      </div>

      <TestFooter
        testId={testId}
        sectionId={sectionId}
        questionIndex={question.index}
        totalQuestions={totalQuestions}
        bookmarks={bookmarks}
      />
    </div>
  );
}
