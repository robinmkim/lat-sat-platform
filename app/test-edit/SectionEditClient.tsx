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
} from "types/question";
import { saveQuestion } from "./actions";

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
      const originalSection = fallbackSections.find(
        (s) => s.sectionNumber === sectionNumber
      );
      const updatedSection = updatedSections.find(
        (s) => s.sectionNumber === sectionNumber
      );

      if (!updatedSection) {
        setError("수정된 섹션 정보를 찾을 수 없습니다.");
        setIsSaving(false);
        return;
      }

      const changedQuestions: QuestionWithRelations[] = [];

      for (const updated of updatedSection.questions) {
        const original = originalSection?.questions.find(
          (q) => q.index === updated.index
        );

        const isChanged =
          !original || JSON.stringify(original) !== JSON.stringify(updated);

        if (!isChanged) continue;

        // ✅ 이미지 업로드 처리
        const imageEntries: { id: string; url: string }[] = [];
        const imageKey = `q${updated.index}`;
        if (uploadedMap.current.has(imageKey)) {
          const file = uploadedMap.current.get(imageKey)!;
          const { imageUrl, imageId } = await uploadImage(file);
          imageEntries.push({ id: imageId, url: imageUrl });
        }

        // ✅ 선택지 이미지 업로드 처리
        const newChoices = await Promise.all(
          updated.choices.map(async (choice, order) => {
            const choiceKey = `q${updated.index}-choice-${order}`;
            if (uploadedMap.current.has(choiceKey)) {
              const file = uploadedMap.current.get(choiceKey)!;
              const { imageUrl, imageId } = await uploadImage(file);
              return {
                ...choice,
                images: [{ id: imageId, url: imageUrl }],
              };
            }
            return choice;
          })
        );

        updated.images = imageEntries;
        updated.choices = newChoices;

        changedQuestions.push(updated);
      }

      if (changedQuestions.length === 0) {
        setError("변경된 문제가 없습니다.");
        setIsSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("sectionId", sectionId);
      formData.append("payload", JSON.stringify(changedQuestions));

      await saveQuestion(formData);

      // ✅ 저장 성공 시 localStorage 제거
      const remainingSections = updatedSections.map((section) =>
        section.sectionNumber === sectionNumber
          ? { ...section, questions: [] }
          : section
      );
      localStorage.setItem(`edit-${testId}`, JSON.stringify(remainingSections));

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

          setQuestions([
            {
              ...question,
              isImageChoice: anyChoiceHasImage,
            },
          ]);
          return;
        }
      } catch (e) {
        console.warn("❌ localStorage 파싱 실패:", e);
      }
    }

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

      setQuestions([
        {
          ...fallbackQuestion,
          id: fallbackQuestion.id ?? generatedId,
          isImageChoice: anyChoiceHasImage,
        },
      ]);
    }
  }, [testId, sectionNumber, questionIndex, fallbackSections, generatedId]);

  const uploadImage = async (
    file: File
  ): Promise<{ imageUrl: string; imageId: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("업로드 실패: " + errorText);
    }

    const result = await res.json();

    if (!result.imageUrl || !result.imageId) {
      throw new Error(
        "이미지 업로드 실패: " + (result.error || "알 수 없는 오류")
      );
    }

    return {
      imageUrl: result.imageUrl,
      imageId: result.imageId,
    };
  };

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
      {/* ✅ 저장 중일 때 화면 차단 및 로딩 표시 */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <div className="text-white text-lg font-semibold">
            저장 중입니다...
          </div>
        </div>
      )}

      {/* ❌ 오류 발생 시 모달 표시 */}
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
