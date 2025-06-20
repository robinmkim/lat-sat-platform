"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionForm from "@/test-edit/QuestionForm";
import QuestionFooter from "./components/QuestionFooter";
import SectionEditHeader from "./components/SectionEditHeader";
import { v4 as uuidv4 } from "uuid";
import type {
  SectionWithQuestions,
  QuestionWithRelations,
  ChoiceData,
  TableData,
} from "types/question";
import { saveQuestion } from "./actions";
import { prepareChangedQuestions } from "./utils/question";

export default function SectionEditClient({
  testId,
  sectionId,
  sectionNumber,
  questionIndex,
  fallbackSections,
}: {
  testId: string;
  sectionId: string;
  sectionNumber: number;
  questionIndex: number;
  fallbackSections: SectionWithQuestions[];
}) {
  const router = useRouter();
  const uploadedMap = useRef<Map<string, File>>(new Map()); // ✅ string key로 변경
  const generatedId = useMemo(() => uuidv4(), []);
  const [questions, setQuestions] = useState<QuestionWithRelations[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmptyChoices = (count: number): ChoiceData[] =>
    Array.from({ length: count }).map((_, idx) => ({
      id: "",
      order: idx,
      text: "",
      images: [],
    }));

  // 기본 빈 테이블 생성 함수
  const createEmptyTable = (): TableData => ({
    id: "",
    title: "",
    data: [["", ""]], // string[][] 타입
  });

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    setError(null);

    const raw = localStorage.getItem(`edit-${testId}`);
    if (!raw) {
      setError("저장할 문제가 없습니다.");
      setIsSaving(false);
      return;
    }

    try {
      const updatedSections = JSON.parse(raw) as SectionWithQuestions[];

      const allChangedQuestions: QuestionWithRelations[] = [];

      for (const updatedSection of updatedSections) {
        const originalSection = fallbackSections.find(
          (s) => s.sectionNumber === updatedSection.sectionNumber
        );

        const changed = await prepareChangedQuestions(
          originalSection,
          updatedSection,
          uploadedMap.current
        );

        allChangedQuestions.push(...changed);
      }

      if (allChangedQuestions.length === 0) {
        setError("변경된 문제가 없습니다.");
        setIsSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("payload", JSON.stringify(allChangedQuestions));

      await saveQuestion(formData);

      // ✅ 저장 성공 시 localStorage 초기화
      const clearedSections = updatedSections.map((section) => ({
        ...section,
        questions: [],
      }));
      localStorage.setItem(`edit-${testId}`, JSON.stringify(clearedSections));

      router.push("/test-list");
    } catch (e) {
      console.error("❌ 저장 실패:", e);
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem(`edit-${testId}`);
    if (raw) {
      try {
        const allSections = JSON.parse(raw) as SectionWithQuestions[];
        const section = allSections.find(
          (s) => s.sectionNumber === sectionNumber
        );
        const question = section?.questions.find(
          (q) => q.index === questionIndex
        );
        if (question) {
          const anyChoiceHasImage = question.choices?.some(
            (c) => Array.isArray(c.images) && c.images.length > 0
          );

          // 빈 테이블, 빈 선택지, isImageChoice 초기화
          const table = question.table?.data
            ? question.table
            : createEmptyTable();
          const choices =
            question.choices && question.choices.length > 0
              ? question.choices
              : createEmptyChoices(4);

          setQuestions([
            {
              ...question,
              table,
              choices,
              isImageChoice: anyChoiceHasImage,
            },
          ]);
          return;
        }
      } catch (e) {
        console.warn("❌ localStorage 파싱 실패:", e);
      }
    }

    // fallbackSections 초기화 로딩
    const section = fallbackSections.find(
      (s) => s.sectionNumber === sectionNumber
    );
    const fallbackQuestion = section?.questions.find(
      (q) => q.index === questionIndex
    );
    if (fallbackQuestion) {
      const anyChoiceHasImage = fallbackQuestion.choices?.some(
        (c) => Array.isArray(c.images) && c.images.length > 0
      );
      const table = fallbackQuestion.table?.data
        ? fallbackQuestion.table
        : createEmptyTable();
      const choices =
        fallbackQuestion.choices && fallbackQuestion.choices.length > 0
          ? fallbackQuestion.choices
          : createEmptyChoices(4);

      setQuestions([
        {
          ...fallbackQuestion,
          id: fallbackQuestion.id ?? generatedId,
          table,
          choices,
          isImageChoice: anyChoiceHasImage,
        },
      ]);
    }
  }, [testId, sectionNumber, questionIndex, fallbackSections, generatedId]);

  // 로컬스토리지에 questions 상태 저장 (questions[0] 기준)
  useEffect(() => {
    const current = questions[0];
    if (!current) return;

    const raw = localStorage.getItem(`edit-${testId}`);
    let allSections: SectionWithQuestions[] = [];
    try {
      allSections = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("❌ 시험 로딩 실패:", e);
    }

    let section = allSections.find((s) => s.sectionNumber === sectionNumber);
    if (!section) {
      section = {
        sectionId,
        sectionNumber,
        questions: [],
      };
      allSections.push(section);
    }

    const existingIndex = section.questions.findIndex(
      (q) => q.index === current.index
    );
    if (existingIndex >= 0) {
      section.questions[existingIndex] = current;
    } else {
      section.questions.push(current);
    }

    localStorage.setItem(`edit-${testId}`, JSON.stringify(allSections));
  }, [questions[0], testId, sectionId, sectionNumber]);

  if (!questions.length) return null;

  return (
    <div className="flex flex-col w-full max-w-4xl h-[calc(100vh-4rem)] p-6">
      <SectionEditHeader
        testId={testId}
        sectionNumber={sectionNumber}
        currentIndex={questionIndex}
        totalQuestions={27}
        onSaveAndExit={handleSaveAndExit}
      />

      <div className="flex-grow overflow-auto">
        <QuestionForm
          sectionNumber={sectionNumber}
          questionIndex={questionIndex}
          questions={questions}
          setQuestions={setQuestions}
          onSelectImageFile={(key, file) => uploadedMap.current.set(key, file)}
        />
      </div>

      <QuestionFooter
        testId={testId}
        sectionNumber={sectionNumber}
        questionIndex={questionIndex}
        onNavigate={(s, i) =>
          router.push(`/test-edit/${testId}/section/${s}/question/${i}`)
        }
      />

      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <div className="text-white text-lg font-semibold">
            저장 중입니다...
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <div className="text-red-600 font-bold text-lg mb-2">저장 실패</div>
            <div className="text-gray-700 mb-4">{error}</div>
            <button
              onClick={() => setError(null)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
