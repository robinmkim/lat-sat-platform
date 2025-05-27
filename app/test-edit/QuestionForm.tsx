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
}

export default function QuestionForm({
  sectionNumber,
  questionIndex,
  questions,
  setQuestions,
  onDirtyChange,
  initialQuestion,
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

      <QuestionRenderer
        key={current.id}
        sectionNumber={sectionNumber}
        {...current}
        onUpdate={(partial) => updateQuestion(current.id, partial)}
      />

      <input type="hidden" name="payload" value={JSON.stringify(questions)} />
    </div>
  );
}
