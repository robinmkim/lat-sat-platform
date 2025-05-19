"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Question as PrismaQuestion } from "@/app/generated/prisma";
import QuestionRenderer from "../components/QuestionRenderer";
import { normalizeAnswer } from "./utils/question";

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
  initialQuestion?: PrismaQuestion | null;
}

export default function QuestionForm({
  sectionNumber,
  questionIndex,
  initialQuestion,
}: QuestionFormProps) {
  const normalizedQuestion: Question = initialQuestion
    ? {
        id: initialQuestion.id,
        index: initialQuestion.index,
        question: initialQuestion.questionText ?? "",
        passage: initialQuestion.passage ?? "",
        choices: Array.isArray(initialQuestion.choices)
          ? (initialQuestion.choices as string[])
          : ["", "", "", ""],
        answer: normalizeAnswer(initialQuestion.answer, initialQuestion.type), // ✅ 여기가 핵심
        type: initialQuestion.type ?? "MULTIPLE",
        tableData: Array.isArray(initialQuestion.tableData)
          ? (initialQuestion.tableData as string[][])
          : [[""]],
        imageUrl: initialQuestion.imageUrl ?? "",
      }
    : {
        id: uuidv4(),
        index: questionIndex,
        question: "",
        passage: "",
        choices: ["", "", "", ""],
        answer: "",
        type: "MULTIPLE",
        tableData: [[""]],
        imageUrl: "",
      };

  const [questions, setQuestions] = useState<Question[]>([normalizedQuestion]);

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
