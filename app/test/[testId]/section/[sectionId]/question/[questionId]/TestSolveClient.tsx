"use client";

import { useState, useEffect } from "react";
import BookmarkToggle from "@/components/BookmarkToggle";
import MultipleChoice from "@/test/components/MultipleChoice";
import FractionInput from "@/components/FractionInput";
import { isEmptyTable, renderPassage } from "@/components/common/renderPassage";
import ShortAnswerInstruction from "@/test-edit/components/ShortAnswerInstruction";
import Image from "next/image";
import { ImageData } from "types/question";
import ImageChoice from "@/test/components/ImageChoice";
import { QuestionWithRelations } from "types/question";
import { renderInline } from "@/components/common/renderPassage";

export type Choice = {
  id: string;
  text: string;
  images: ImageData[];
};

type Props = {
  testId: string;
  sectionId: number;
  totalQuestions: number;
  currentIndex: number;
  questions: QuestionWithRelations[];
};

export default function TestSolveClient({
  testId,
  sectionId,
  currentIndex,
  questions,
}: Props) {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<
    Record<string, Record<number, string>>
  >({});

  const question = questions.find((q) => q.index === currentIndex);

  const bookmarkKey = `bookmark-${testId}-section-${sectionId}`;
  const answerKey = `answers-${testId}`;

  useEffect(() => {
    const stored = sessionStorage.getItem(bookmarkKey);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch {
        setBookmarks({});
      }
    }
  }, [bookmarkKey]);

  useEffect(() => {
    const stored =
      sessionStorage.getItem(answerKey) ??
      localStorage.getItem(`answers-backup-${testId}`);
    if (stored) {
      try {
        setAnswers(JSON.parse(stored));
      } catch {
        setAnswers({});
      }
    }
  }, [answerKey, testId]);

  useEffect(() => {
    localStorage.setItem(`answers-backup-${testId}`, JSON.stringify(answers));
  }, [answers, testId]);

  if (!question) {
    return <div className="p-4">문제를 불러오는 중입니다...</div>;
  }

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
      const next = { ...prev, [sectionKey]: updatedSection };
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

  const isMathSection = sectionId >= 3;
  const isMathMultiple = question.type === "MULTIPLE" && isMathSection;
  const isMathShort = question.type === "SHORT" && isMathSection;

  const showLeftBlock =
    !isMathMultiple &&
    (question.passage?.trim() ||
      question.table?.title?.trim() ||
      (question.table?.data && !isEmptyTable(question.table?.data)) ||
      question.images?.[0]?.url.trim());

  const currentAnswer = answers[`section${sectionId}`]?.[question.index] ?? "";

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full">
      <div className="flex flex-grow min-h-0 w-full overflow-hidden">
        {isMathShort ? (
          <div className="flex justify-center w-1/2 h-full p-5 overflow-hidden">
            <div className="flex flex-col w-full gap-4 overflow-y-auto max-h-full">
              <ShortAnswerInstruction />
            </div>
          </div>
        ) : (
          showLeftBlock && (
            <div className="flex justify-center w-1/2 h-full p-5 overflow-hidden">
              <div className="flex flex-col w-full gap-4 overflow-y-auto max-h-full">
                {question.images?.[0]?.url && (
                  <div className="w-full max-w-3xl mx-auto my-4 relative aspect-video">
                    <Image
                      src={question.images[0].url}
                      alt="문제 이미지"
                      fill
                      className="object-contain rounded-none"
                      sizes="100vw"
                    />
                  </div>
                )}

                {question.table?.title && (
                  <h3 className="text-lg font-semibold">
                    {question.table?.title}
                  </h3>
                )}

                {question.table?.data &&
                  question.table.data.length > 0 &&
                  !isEmptyTable(question.table.data) && (
                    <table className="table-auto border-2 border-gray-600 bg-white text-sm max-w-md mx-auto text-center">
                      <thead>
                        <tr>
                          {question.table.data[0].map((cell, idx) => (
                            <th
                              key={`head-${idx}`}
                              className="border-2 border-gray-600 px-3 py-2 font-bold"
                            >
                              {cell || "⠀"}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {question.table.data.slice(1).map((row, rowIdx) => (
                          <tr key={rowIdx}>
                            {row.map((cell, colIdx) => (
                              <td
                                key={colIdx}
                                className="border-2 border-gray-600 px-3 py-2 text-center"
                              >
                                {cell || "⠀"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                {question.passage && (
                  <div>{renderPassage(question.passage)}</div>
                )}
              </div>
            </div>
          )
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
          {/* 우측 블럭에 이미지 출력 (SHORT일 때 포함) */}
          {(isMathShort || !showLeftBlock) && question.images?.[0]?.url && (
            <div className="w-full max-w-3xl mx-auto my-4 relative aspect-video">
              <Image
                src={question.images[0].url}
                alt="문제 이미지"
                fill
                className="object-contain rounded-none"
                sizes="100vw"
              />
            </div>
          )}
          {isMathShort && question.table?.title && (
            <h3 className="text-lg font-semibold mb-2">
              {question.table?.title}
            </h3>
          )}
          {isMathShort &&
            question.table?.data &&
            !isEmptyTable(question.table.data) && (
              <table className="table-auto border-2 border-gray-600 bg-white text-sm max-w-md mx-auto text-center mb-4">
                <thead>
                  <tr>
                    {question.table.data[0].map((cell, idx) => (
                      <th
                        key={`head-${idx}`}
                        className="border-2 border-gray-600 px-3 py-2 font-bold"
                      >
                        {cell || "⠀"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.table.data.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          className="border-2 border-gray-600 px-3 py-2 text-center"
                        >
                          {cell || "⠀"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          <div className="mt-4 mb-2 whitespace-pre-wrap">
            {renderInline(question.question)}
          </div>

          {question.type === "MULTIPLE" &&
            question.choices &&
            (question.isImageChoice ? (
              <ImageChoice
                choices={question.choices.map((c) => ({
                  id: c.id,
                  text: c.text,
                  imageUrl: c.images?.[0]?.url ?? "",
                }))}
                selectedIndex={
                  currentAnswer !== "" ? parseInt(currentAnswer) : null
                }
                onAnswer={(index) =>
                  updateAnswer(sectionId, question.index, index.toString())
                }
              />
            ) : (
              <MultipleChoice
                choices={question.choices}
                selectedIndex={
                  currentAnswer !== "" ? parseInt(currentAnswer) : null
                }
                onAnswer={(index) =>
                  updateAnswer(sectionId, question.index, index.toString())
                }
              />
            ))}

          {question.type === "SHORT" && (
            <FractionInput
              value={currentAnswer}
              onAnswer={(text) => updateAnswer(sectionId, question.index, text)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
