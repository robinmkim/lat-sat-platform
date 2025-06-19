import QuestionRenderer from "./components/QuestionRenderer";
import { formatSectionLabel } from "@/components/utils/formatSectionLabel";
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
      prev.map((q) => (q.id === id ? { ...q, ...newPartial } : q))
    );
  };

  // ✅ 전달용 래핑 함수: index → string key 변환
  const handleSelectImageFile = (choiceIndex: number, file: File) => {
    const key =
      current.isImageChoice && current.type === "MULTIPLE"
        ? `q${questionIndex}-choice-${choiceIndex}`
        : `q${questionIndex}`;
    onSelectImageFile?.(key, file);
  };

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
            checked={current.showTable ?? true}
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
            checked={current.showImage ?? true}
            onChange={() =>
              updateQuestion(current.id, {
                showImage: !(current.showImage ?? true),
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
