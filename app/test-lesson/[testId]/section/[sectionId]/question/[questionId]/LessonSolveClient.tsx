"use client";

import { useState } from "react";
import MultipleChoice from "@/test/components/MultipleChoice";
import FractionInput from "@/components/FractionInput";
import Image from "next/image";
import {
  renderPassage,
  isEmptyTable,
  renderInline,
} from "@/components/common/renderPassage";
import type { QuestionWithRelations } from "types/question";
import ShortAnswerInstruction from "@/test-edit/components/ShortAnswerInstruction";
import LessonHeader from "@/test-lesson/components/LessonHeader";
import LessonFooter from "@/test-lesson/components/LessonFooter";
import ImageChoice from "@/test/components/ImageChoice";

export default function LessonSolveClient({
  questions,
  sectionId,
  currentIndex,
  testId,
}: {
  questions: QuestionWithRelations[];
  sectionId: number;
  currentIndex: number;
  testId: string;
}) {
  const question = questions.find((q) => q.index === currentIndex);
  const [answer, setAnswer] = useState<string>("");

  if (!question) return <div className="p-4">문제를 불러올 수 없습니다.</div>;

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

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full h-screen">
      <LessonHeader />

      <div className="flex flex-grow min-h-0 w-full overflow-hidden">
        {showLeftBlock && (
          <div className="flex justify-center w-1/2 h-full p-5 overflow-hidden">
            <div className="flex flex-col w-full gap-4 overflow-y-auto max-h-full">
              {question.showImage && question.images?.[0]?.url && (
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
          {!showLeftBlock &&
            question.showImage &&
            question.images?.[0]?.url && (
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

          <div className="flex w-full border-b-2 border-dashed items-center justify-between">
            <div className="w-8 bg-black text-white text-center py-1">
              {question.index}
            </div>
          </div>

          <div className="mt-4 mb-2 whitespace-pre-wrap">
            {renderInline(question.question)}
          </div>

          {question.type === "MULTIPLE" &&
            (question.isImageChoice ? (
              <ImageChoice
                choices={question.choices.map((c) => ({
                  id: c.id,
                  text: c.text,
                  imageUrl: c.images?.[0]?.url ?? "",
                }))}
                selectedIndex={answer !== "" ? parseInt(answer) : null}
                onAnswer={(index) => setAnswer(index.toString())}
              />
            ) : (
              <MultipleChoice
                choices={question.choices}
                selectedIndex={answer !== "" ? parseInt(answer) : null}
                onAnswer={(index) => setAnswer(index.toString())}
              />
            ))}

          {question.type === "SHORT" && (
            <FractionInput value={answer} onAnswer={setAnswer} />
          )}
        </div>
      </div>

      <LessonFooter
        testId={testId}
        sectionId={sectionId}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
      />
    </div>
  );
}
