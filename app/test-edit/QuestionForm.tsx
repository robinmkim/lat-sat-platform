import QuestionRenderer from "./components/QuestionRenderer";
import { formatSectionLabel } from "@/components/utils/formatSectionLabel";
import { useEffect } from "react";

import type {
  ChoiceData,
  ImageData,
  TableData,
  QuestionWithRelations,
} from "types/question";

export interface Question {
  id: string;
  index: number;
  question: string;
  passage?: string;
  choices: ChoiceData[];
  answer: string;
  type: "MULTIPLE" | "SHORT";
  table?: TableData;
  images: ImageData[];
  score?: number;
  showTable?: boolean;
  showImage?: boolean;
  isImageChoice?: boolean;
}

interface QuestionFormProps {
  sectionNumber: number;
  questionIndex: number;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionWithRelations[]>>;
  initialQuestion?: Question | null;
  onSelectImageFile?: (key: string, file: File) => void;
}

export default function QuestionForm({
  sectionNumber,
  questionIndex,
  questions,
  setQuestions,
  onSelectImageFile,
}: QuestionFormProps) {
  const current = questions[0];
  const updateQuestion = (id: string, newPartial: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        return {
          ...q,
          ...newPartial,
          images: newPartial.images ?? q.images ?? [], // ✅ 이미지 필드 유지
          choices: newPartial.choices ?? q.choices ?? [],
        };
      })
    );
  };

  // ✅ 전달용 래핑 함수: index → string key 변환
  const handleSelectImageFile = (choiceIndex: number, file: File) => {
    const key =
      current.isImageChoice && current.type === "MULTIPLE"
        ? `q${questionIndex}-choice-${choiceIndex}`
        : `q${questionIndex}`;

    // ✅ 부모에서 받은 콜백으로 uploadedMap 등록
    onSelectImageFile?.(key, file);

    const previewUrl = URL.createObjectURL(file);

    if (key === `q${questionIndex}`) {
      // ✅ 본문 이미지일 경우: questions[].images에 반영
      updateQuestion(current.id, {
        images: [{ id: "", url: previewUrl }],
      });
    } else {
      // ✅ 선택지 이미지일 경우: 해당 choice.images에 반영
      const updatedChoices = current.choices.map((choice, i) =>
        i === choiceIndex
          ? {
              ...choice,
              images: [{ id: "", url: previewUrl }],
            }
          : choice
      );
      updateQuestion(current.id, { choices: updatedChoices });
    }
  };

  useEffect(() => {
    // ✅ table 초기화
    if (!current.table) {
      updateQuestion(current.id, {
        table: { id: "", title: "", data: [["", ""]] },
      });
    }

    // ✅ question images 초기화
    if (!current.images) {
      updateQuestion(current.id, { images: [] });
    }

    // ✅ choices 초기화
    if (!current.choices || current.choices.length === 0) {
      updateQuestion(current.id, {
        choices: Array.from({ length: 4 }, (_, i) => ({
          id: "",
          order: i,
          text: "",
          images: [],
        })),
      });
    } else {
      // ✅ 각 choice의 images 초기화
      const fixedChoices = current.choices.map((c, i) => ({
        ...c,
        images: c.images ?? [],
        order: c.order ?? i,
      }));
      updateQuestion(current.id, { choices: fixedChoices });
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">
          {formatSectionLabel(sectionNumber)}
        </div>
        <div>Question {questionIndex}</div>
      </div>

      {/* ✅ 입력 모드 토글 */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={current.type === "MULTIPLE"}
            onChange={() => updateQuestion(current.id, { type: "MULTIPLE" })}
          />
          Multiple Choice
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={current.type === "SHORT"}
            onChange={() => updateQuestion(current.id, { type: "SHORT" })}
          />
          Short Answer
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={current.showTable ?? false}
            onChange={() =>
              updateQuestion(current.id, {
                showTable: !(current.showTable ?? true),
              })
            }
          />
          Table 표시
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={current.showImage ?? false}
            onChange={() =>
              updateQuestion(current.id, {
                showImage: !(current.showImage ?? false),
              })
            }
          />
          이미지 표시
        </label>
        {current.type === "MULTIPLE" && (
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={current.isImageChoice ?? false}
              onChange={() =>
                updateQuestion(current.id, {
                  isImageChoice: !(current.isImageChoice ?? false),
                })
              }
            />
            이미지 선택지 사용
          </label>
        )}
      </div>

      {/* ✅ 문제 렌더러 */}
      <QuestionRenderer
        key={current.id}
        sectionNumber={sectionNumber}
        {...current}
        isImageChoice={current.isImageChoice ?? false}
        onUpdate={(partial) => updateQuestion(current.id, partial)}
        onSelectImageFile={handleSelectImageFile}
      />

      <input type="hidden" name="payload" value={JSON.stringify(questions)} />
    </div>
  );
}
