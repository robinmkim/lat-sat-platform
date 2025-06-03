import { useEffect, useRef } from "react";
import QuestionRenderer from "./components/QuestionRenderer";

export interface Question {
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
  imageId?: string;
  score?: number;
  showTable?: boolean;
  showImage?: boolean;
}

interface QuestionFormProps {
  sectionNumber: number;
  questionIndex: number;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  onDirtyChange?: (dirty: boolean) => void;
  initialQuestion?: Question | null;
  onSelectImageFile?: (index: number, file: File) => void;
}

export default function QuestionForm({
  sectionNumber,
  questionIndex,
  questions,
  setQuestions,
  onDirtyChange,
  initialQuestion,
  onSelectImageFile,
}: QuestionFormProps) {
  const current = questions[0];
  const initialRef = useRef(JSON.stringify(initialQuestion ?? current));

  useEffect(() => {
    const now = JSON.stringify(current);
    const isDirty = now !== initialRef.current;
    onDirtyChange?.(isDirty);
  }, [current, onDirtyChange]);

  const updateQuestion = (id: string, newPartial: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...newPartial } : q))
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Section {sectionNumber} - Question {questionIndex}
      </div>

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
        onUpdate={(partial) => updateQuestion(current.id, partial)}
        onSelectImageFile={(file) => onSelectImageFile?.(questionIndex, file)} // ✅ deferred 방식 적용
      />

      <input type="hidden" name="payload" value={JSON.stringify(questions)} />
    </div>
  );
}
