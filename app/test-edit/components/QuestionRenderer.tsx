"use client";

import { useState } from "react";
import PassageInput from "./PassageInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
import MultipleChoiceWithImageInput from "./MultipleChoiceWithImageInput";
import QuestionInput from "./QuestionInput";
import MathInput from "./MathInput";
import PassagePreview from "@/components/common/PassagePreview";
import TableInput from "./TableInput";
import ImageUploadInput from "./ImageUploadInput";
import ShortAnswerInput from "./ShortAnswerInput";
import { Question } from "../QuestionForm";

interface QuestionRendererProps extends Question {
  sectionNumber: number;
  isImageChoice?: boolean;
  onUpdate: (data: Partial<Question>) => void;
  onSelectImageFile?: (choiceIndex: number | null, file: File) => void; // ✅ 수정됨
}

export default function QuestionRenderer({
  sectionNumber,
  question,
  passage,
  choices,
  answer,
  type,
  table,
  images,
  score,
  showTable = false,
  showImage = false,
  isImageChoice = false,
  onUpdate,
  onSelectImageFile,
}: QuestionRendererProps) {
  const isReadingWriting = sectionNumber <= 2;
  const [mathPreview, setMathPreview] = useState("");

  const safeChoices = choices ?? [];

  return (
    <div className="flex flex-col w-full bg-white p-4 gap-6">
      {/* ✅ 테이블 입력 */}
      {showTable && table?.data && (
        <TableInput
          title={table?.title ?? ""}
          data={table ? table.data : [[""]]}
          onChange={(updated) => {
            onUpdate({
              table: {
                ...table,
                data: updated,
              },
            });
          }}
          onTitleChange={(title) => onUpdate({ table: { ...table, title } })}
        />
      )}

      {/* ✅ 지문 입력 */}
      {isReadingWriting && (
        <PassageInput
          value={passage ?? ""}
          onChange={(val) => onUpdate({ passage: val })}
        />
      )}

      {/* ✅ 질문 입력 */}
      <QuestionInput
        value={question}
        onChange={(val) => onUpdate({ question: val })}
      />

      {/* ✅ 질문 미리보기 */}
      <PassagePreview
        passage={isReadingWriting ? passage ?? "" : question ?? ""}
      />

      {/* ✅ 수식 미리보기 */}
      {!isReadingWriting && (
        <div className="bg-gray-50 border rounded p-3">
          <p className="text-sm font-medium text-gray-600 mb-2">
            수식 미리보기 도우미 (선택)
          </p>
          <MathInput value={mathPreview} onChange={setMathPreview} />
          <div className="mt-2 text-sm text-gray-700">
            <PassagePreview passage={mathPreview} />
          </div>
        </div>
      )}

      {/* ✅ 선택형 or 단답형 */}
      {type === "MULTIPLE" ? (
        isImageChoice ? (
          <MultipleChoiceWithImageInput
            imageUrls={safeChoices.map((c) => c.images?.[0]?.url ?? "")}
            correctIndex={Number(answer) || 0}
            onSelectCorrect={(i) => onUpdate({ answer: i.toString() })}
            onSelectImageFile={(i, file) => {
              onSelectImageFile?.(i, file); // ✅ 선택지 이미지 등록
            }}
            onClearImage={(i) => {
              const clearedChoices = safeChoices.map((c, idx) =>
                idx === i ? { ...c, images: [] } : c
              );
              onUpdate({ choices: clearedChoices });
            }}
          />
        ) : (
          <MultipleChoiceInput
            choices={Array.from({ length: 4 }).map(
              (_, i) => choices?.[i]?.text ?? ""
            )}
            correctIndex={Number(answer) || 0}
            onChangeChoice={(i, val) => {
              const baseChoices = choices ?? [];
              const updated = Array.from({ length: 4 }).map((_, idx) => ({
                ...baseChoices[idx],
                text: idx === i ? val : baseChoices[idx]?.text ?? "",
              }));
              onUpdate({ choices: updated });
            }}
            onSelectCorrect={(i) => onUpdate({ answer: i.toString() })}
          />
        )
      ) : (
        <ShortAnswerInput
          value={answer}
          onChange={(val) => onUpdate({ answer: val })}
        />
      )}

      {/* ✅ 본문 이미지 업로드 */}
      {showImage ? (
        <ImageUploadInput
          previewUrl={images?.[0]?.url}
          onSelectFile={(file) => {
            onSelectImageFile?.(null, file); // ✅ 본문 이미지 등록
          }}
          visible={true}
          onToggleVisibility={() =>
            onUpdate({
              showImage: false,
              images: [],
            })
          }
          onClearImage={() => onUpdate({ images: [] })}
        />
      ) : (
        <ImageUploadInput
          visible={false}
          onToggleVisibility={() =>
            onUpdate({
              showImage: true,
            })
          }
          onSelectFile={() => {}} // 미사용
        />
      )}

      {/* ✅ 배점 입력 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">배점 (점수)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={score !== undefined ? score : ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^[0-9]+$/.test(value)) {
              onUpdate({ score: value === "" ? undefined : parseInt(value) });
            }
          }}
          className="border px-3 py-2 rounded w-32"
          placeholder="예: 1"
        />
      </div>
    </div>
  );
}
