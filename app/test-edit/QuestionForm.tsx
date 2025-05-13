"use client";

import { useState } from "react";
import QuestionRenderer from "../components/QuestionRenderer";

export default function QuestionForm() {
  const [questions, setQuestions] = useState([
    {
      id: "q1",
      question: "",
      passage: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
      type: "multiple",
    },
  ]);

  const updateQuestion = (id: string, newPartial: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...newPartial } : q))
    );
  };

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          {...q}
          onUpdate={(partial) => updateQuestion(q.id, partial)}
        />
      ))}
      <input type="hidden" name="payload" value={JSON.stringify(questions)} />
    </div>
  );
}
