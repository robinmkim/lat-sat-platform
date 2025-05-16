"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionRenderer from "../components/QuestionRenderer";

export interface Question {
  id: string;
  index: number;
  question: string;
  passage?: string;
  choices?: string[];
  answer: string | number;
  type: "MULTIPLE" | "SHORT";
  tableData: string[][]; // ✅ 필수화
  imageUrl?: string;
}

interface QuestionFormProps {
  sectionNumber: number;
  questionIndex: number;
  initialQuestion?: Question | null; // ✅ 추가
}

export default function QuestionForm({
  sectionNumber,
  questionIndex,
  initialQuestion,
}: QuestionFormProps) {
  const [questions, setQuestions] = useState<Question[]>([
    initialQuestion ?? {
      id: uuidv4(),
      index: questionIndex,
      question: "",
      passage: "",
      choices: ["", "", "", ""],
      answer: "",
      type: "MULTIPLE", // 기본값
      tableData: [[""]],
      imageUrl: "",
    },
  ]);

  const updateQuestion = (id: string, newPartial: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...newPartial } : q))
    );
  };
  console.log(questions);
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          sectionNumber={sectionNumber} // ✅ 전달
          {...q}
          onUpdate={(partial) => updateQuestion(q.id, partial)}
        />
      ))}
      <input type="hidden" name="payload" value={JSON.stringify(questions)} />
    </div>
  );
}
