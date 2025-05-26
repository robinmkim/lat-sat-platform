import { useEffect } from "react";
import QuestionRenderer from "../components/QuestionRenderer";

export interface Question {
  id: string;
  index: number;
  question: string;
  passage?: string;
  choices?: string[];
  answer: string;
  type: "MULTIPLE" | "SHORT";
  tableData: string[][];
  imageUrl?: string;
  showTable?: boolean;
  showImage?: boolean;
}

interface QuestionFormProps {
  sectionNumber: number;
  questionIndex: number;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[] | undefined>>;
  onDirtyChange?: (dirty: boolean) => void;
  initialQuestion: Question | null;
}

export default function QuestionForm({
  sectionNumber,
  questionIndex,
  questions,
  setQuestions,
  onDirtyChange,
  initialQuestion,
}: QuestionFormProps) {
  const current = questions?.[0];

  // ✅ useEffect는 항상 호출되게 유지, 내부에서 조건 분기
  useEffect(() => {
    if (!initialQuestion || !current) return;
    const isDirty = JSON.stringify(current) !== JSON.stringify(initialQuestion);
    onDirtyChange?.(isDirty);
  }, [current, initialQuestion, onDirtyChange]);

  // ❗ JSX 렌더링 이전에 return 처리
  if (!current) return null;

  const updateQuestion = (id: string, newPartial: Partial<Question>) => {
    setQuestions((prev) =>
      (prev ?? []).map((q) => (q.id === id ? { ...q, ...newPartial } : q))
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Section {sectionNumber} - Question {questionIndex}
      </div>

      {/* ✅ 설정 토글 */}
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
      </div>

      <QuestionRenderer
        key={current.id}
        sectionNumber={sectionNumber}
        {...current}
        showTable={current.showTable ?? true}
        showImage={current.showImage ?? true}
        onUpdate={(partial) => updateQuestion(current.id, partial)}
      />
    </div>
  );
}
