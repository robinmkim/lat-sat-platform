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
    const stored = sessionStorage.getItem(answerKey);
    if (stored) {
      try {
        setAnswers(JSON.parse(stored));
      } catch {
        setAnswers({});
      }
    }
  }, [answerKey]);

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

  // ✅ 수정된 RW/RW/M/M 기준
  const isMathSection = sectionId >= 3;
  const isMathMultiple = question.type === "MULTIPLE" && isMathSection;
  const isMathShort = question.type === "SHORT" && isMathSection;

  const showLeftBlock =
    isMathShort ||
    (!isMathMultiple &&
      (question.passage?.trim() ||
        question.table?.title?.trim() ||
        (question.table?.data && !isEmptyTable(question.table?.data)) ||
        question.images?.[0]?.url.trim()));

  const currentAnswer = answers[`section${sectionId}`]?.[question.index] ?? "";

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full">
      <div className="flex flex-grow min-h-0 w-full overflow-hidden">
        {showLeftBlock && (
          <div className="flex justify-center w-1/2 h-full p-5 overflow-hidden">
            <div className="flex flex-col w-full gap-4 overflow-y-auto max-h-full">
              {!question.isImageChoice && question.images?.[0]?.url && (
                <div className="relative w-full h-64 border rounded overflow-hidden">
                  <Image
                    src={question.images[0].url}
                    alt="문제 이미지"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}

              {isMathShort && <ShortAnswerInstruction />}

              {!isMathShort && question.table?.title && (
                <h3 className="text-lg font-semibold">
                  {question.table?.title}
                </h3>
              )}

              {!isMathShort &&
                question.table?.data &&
                !isEmptyTable(question.table.data) && (
                  <table className="w-full table-auto border border-gray-400 bg-white text-sm">
                    <tbody>
                      {question.table.data.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, colIdx) => (
                            <td
                              key={colIdx}
                              className="border border-gray-400 px-2 py-1 whitespace-pre-wrap"
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
          {/* ✅ 여기에 이미지 추가 */}
          {!showLeftBlock && question.images?.[0]?.url && (
            <div className="relative w-full h-64 border rounded overflow-hidden mb-4">
              <Image
                src={question.images[0].url}
                alt="문제 이미지"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
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
