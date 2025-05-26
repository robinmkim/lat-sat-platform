"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionForm, { Question } from "@/app/test-edit/QuestionForm";
import QuestionFooter from "./components/QuestionFooter";
import { saveQuestion } from "@/app/test-edit/actions";
import { v4 as uuidv4 } from "uuid";

export default function SectionEditClient({
  testId,
  sectionId,
  sectionNumber,
  questionIndex,
  initialQuestion,
}: {
  testId: string;
  sectionId: string;
  sectionNumber: number;
  questionIndex: number;
  initialQuestion: Question | null;
}) {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [showAutoSaved, setShowAutoSaved] = useState(false);

  const generatedId = useMemo(() => uuidv4(), []);
  const cacheKey = `edit-${testId}-s${sectionNumber}-q${questionIndex}`;
  const [questions, setQuestions] = useState<Question[] | undefined>();

  useEffect(() => {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      try {
        const cached = JSON.parse(raw);
        setQuestions([
          {
            id: cached.id ?? generatedId,
            index: cached.index ?? questionIndex,
            passage: cached.passage ?? "",
            question: cached.question ?? "",
            choices: Array.isArray(cached.choices)
              ? cached.choices
              : ["", "", "", ""],
            answer:
              typeof cached.answer === "string"
                ? cached.answer
                : String(cached.answer ?? ""),
            type: cached.type ?? "MULTIPLE",
            tableData: Array.isArray(cached.tableData)
              ? cached.tableData
              : [[""]],
            imageUrl: cached.imageUrl ?? "",
            showTable: cached.showTable ?? false,
            showImage: cached.showImage ?? false,
          },
        ]);
        setIsDirty(true);
        return;
      } catch (e) {
        console.warn("로컬 캐시 파싱 실패", e);
      }
    }

    // fallback
    setQuestions([
      {
        id: initialQuestion?.id ?? generatedId,
        index: initialQuestion?.index ?? questionIndex,
        passage: initialQuestion?.passage ?? "",
        question: initialQuestion?.question ?? "",
        choices: Array.isArray(initialQuestion?.choices)
          ? initialQuestion.choices
          : ["", "", "", ""],
        answer:
          typeof initialQuestion?.answer === "string"
            ? initialQuestion.answer
            : String(initialQuestion?.answer ?? ""),
        type: initialQuestion?.type ?? "MULTIPLE",
        tableData: Array.isArray(initialQuestion?.tableData)
          ? initialQuestion.tableData
          : [[""]],
        imageUrl: initialQuestion?.imageUrl ?? "",
        showTable: initialQuestion?.showTable ?? false,
        showImage: initialQuestion?.showImage ?? false,
      },
    ]);
  }, [cacheKey, generatedId, initialQuestion, questionIndex]);

  useEffect(() => {
    if (questions) {
      localStorage.setItem(cacheKey, JSON.stringify(questions[0]));
    }
  }, [questions, cacheKey]);

  const handleNavigate = async (targetSection: number, targetIndex: number) => {
    if (!questions) return;

    localStorage.setItem(cacheKey, JSON.stringify(questions[0]));

    if (questionIndex === 27) {
      const sectionQuestions: Question[] = [];

      for (let i = 1; i <= 27; i++) {
        const key = `edit-${testId}-s${sectionNumber}-q${i}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            sectionQuestions.push(parsed);
          } catch (e) {
            console.warn(`문제 ${i}번 로딩 실패`, e);
          }
        }
      }

      if (sectionQuestions.length > 0) {
        const formData = new FormData();
        formData.append("sectionId", sectionId);
        formData.append("payload", JSON.stringify(sectionQuestions));
        const result = await saveQuestion(formData);

        if (result?.success) {
          setShowAutoSaved(true);
          setTimeout(() => setShowAutoSaved(false), 3000);
        } else {
          alert("저장 실패: " + (result?.error ?? "알 수 없는 오류"));
        }
      }
    }

    router.push(
      `/test-edit/${testId}/section/${targetSection}/question/${targetIndex}`
    );
  };

  const handleSaveAndNext = async () => {
    if (!questions) return;

    const formData = new FormData();
    formData.append("sectionId", sectionId);
    formData.append("index", String(questionIndex));
    formData.append("payload", JSON.stringify(questions));

    const result = await saveQuestion(formData);

    if (result?.success) {
      const nextIndex = questionIndex < 27 ? questionIndex + 1 : 1;
      const nextSection =
        questionIndex < 27 ? sectionNumber : sectionNumber + 1;

      router.push(
        `/test-edit/${testId}/section/${nextSection}/question/${nextIndex}`
      );
    } else {
      alert("저장 실패: " + (result?.error ?? "알 수 없는 오류"));
    }
  };

  if (!questions) return null;

  return (
    <form
      id="question-form"
      action={() => {}}
      className="flex flex-col w-full max-w-4xl h-[calc(100vh-4rem)] p-6"
    >
      <h1 className="text-2xl font-semibold mb-2">문제 입력</h1>

      <input type="hidden" name="sectionId" value={sectionId} />
      <input type="hidden" name="index" value={questionIndex} />
      <input type="hidden" name="payload" value={JSON.stringify(questions)} />

      <div className="flex-grow overflow-auto">
        <QuestionForm
          sectionNumber={sectionNumber}
          questionIndex={questionIndex}
          questions={questions}
          setQuestions={setQuestions}
          onDirtyChange={setIsDirty}
          initialQuestion={initialQuestion}
        />

        {showAutoSaved && (
          <p className="text-green-600 text-center font-medium mt-4">
            자동 저장되었습니다.
          </p>
        )}
      </div>

      <QuestionFooter
        testId={testId}
        sectionNumber={sectionNumber}
        questionIndex={questionIndex}
        isDirty={isDirty}
        onNavigate={handleNavigate}
        onSaveAndNext={handleSaveAndNext}
      />
    </form>
  );
}
