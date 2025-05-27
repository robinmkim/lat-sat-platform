import PassageInput from "./PassageInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
import QuestionInput from "./QuestionInput";
import MathInput from "./MathInput";
import PassagePreview from "@/app/components/common/PassagePreview";
import TableInput from "./TableInput";
import ImageUploadInput from "./ImageUploadInput";
import ShortAnswerInput from "./ShortAnswerInput";
import { Question } from "../QuestionForm";
import { useState } from "react";

interface QuestionRendererProps {
  sectionNumber: number;
  id: string;
  index: number;
  question: string;
  passage?: string;
  choices?: string[];
  answer: string;
  type: "MULTIPLE" | "SHORT";
  tableData: string[][];
  tableTitle?: string;
  imageUrl?: string;
  score?: number;
  showTable?: boolean;
  showImage?: boolean;
  onUpdate: (data: Partial<Question>) => void;
}

export default function QuestionRenderer({
  sectionNumber,
  id,
  index,
  question,
  passage,
  choices = ["", "", "", ""],
  answer,
  type,
  tableData,
  tableTitle,
  imageUrl,
  score,
  showTable = false,
  showImage = false,
  onUpdate,
}: QuestionRendererProps) {
  const isReadingWriting = sectionNumber % 2 === 1;
  const [mathPreview, setMathPreview] = useState("");

  return (
    <div className="flex flex-col w-full bg-white p-4 gap-6">
      {/* ✅ 테이블 입력 먼저 (READING/WRITING 전용) */}
      {isReadingWriting && showTable && tableData.length > 0 && (
        <TableInput
          title={tableTitle}
          data={tableData}
          onChange={(updated) => onUpdate({ tableData: updated })}
          onTitleChange={(title) => onUpdate({ tableTitle: title })}
        />
      )}

      {/* ✅ 지문 입력 (READING/WRITING 전용) */}
      {isReadingWriting && (
        <PassageInput
          value={passage ?? ""}
          onChange={(val) => onUpdate({ passage: val })}
        />
      )}

      {/* ✅ 질문 입력 도우미 (MATH: LaTeX 변환용, 저장 안 함) */}
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

      {/* ✅ 실제 질문 입력 (저장 대상) */}
      <QuestionInput
        value={question}
        onChange={(val) => onUpdate({ question: val })}
      />

      {/* ✅ 정답 입력 */}
      {type === "MULTIPLE" ? (
        <MultipleChoiceInput
          choices={choices}
          correctIndex={parseInt(answer) || 0}
          onChangeChoice={(i, val) => {
            const updated = [...choices];
            updated[i] = val;
            onUpdate({ choices: updated });
          }}
          onSelectCorrect={(i) => onUpdate({ answer: i.toString() })}
        />
      ) : (
        <ShortAnswerInput
          value={answer}
          onChange={(val) => onUpdate({ answer: val })}
        />
      )}

      {/* ✅ 이미지 업로드 */}
      {showImage && (
        <ImageUploadInput
          imageUrl={imageUrl}
          onChange={(url) => onUpdate({ imageUrl: url })}
        />
      )}

      {/* ✅ 배점 입력 */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">배점 (점수)</label>
        <input
          type="number"
          min={1}
          value={score ?? 1}
          onChange={(e) => onUpdate({ score: parseInt(e.target.value) || 1 })}
          className="border px-3 py-2 rounded w-32"
          placeholder="예: 1"
        />
      </div>

      {/* ✅ 항상 미리보기 표시 */}
      <PassagePreview
        passage={isReadingWriting ? passage ?? "" : question ?? ""}
      />
    </div>
  );
}
