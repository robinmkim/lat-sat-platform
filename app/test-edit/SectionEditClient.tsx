"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionForm, { Question } from "@/test-edit/QuestionForm";
import QuestionFooter from "./components/QuestionFooter";
import { saveQuestion } from "@/test-edit/actions";
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
  const [questions, setQuestions] = useState<Question[]>([]);

  // ✅ index별로 파일 보관
  const uploadedMap = useRef<Map<number, File>>(new Map());

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
            tableTitle: cached.tableTitle ?? "",
            imageUrl: cached.imageUrl ?? "",
            imageId: cached.imageId ?? "",
            showTable: cached.showTable ?? false,
            showImage: cached.showImage ?? false,
            score: cached.score ?? 1,
          },
        ]);
        setIsDirty(true);
        return;
      } catch (e) {
        console.warn("로컬 캐시 파싱 실패", e);
      }
    }

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
        tableTitle: initialQuestion?.tableTitle ?? "",
        imageUrl: initialQuestion?.imageUrl ?? "",
        imageId: initialQuestion?.imageId ?? "",
        showTable: initialQuestion?.showTable ?? false,
        showImage: initialQuestion?.showImage ?? false,
        score: initialQuestion?.score ?? 1,
      },
    ]);
  }, [cacheKey, generatedId, initialQuestion, questionIndex]);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(questions[0]));
    }
  }, [questions, cacheKey]);

  // ✅ 파일 업로드 함수
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (!result.imageUrl || !result.imageId) {
      alert("이미지 업로드 실패: " + (result.error || "알 수 없는 오류"));
      return {};
    }
    return {
      imageUrl: result.imageUrl,
      imageId: result.imageId,
    };
  };

  const handleNavigate = async (targetSection: number, targetIndex: number) => {
    if (!questions.length) return;

    const current = questions[0];
    localStorage.setItem(cacheKey, JSON.stringify(current));

    // ✅ 마지막 문제일 때만 저장 처리
    const isLastQuestionInSection = questionIndex === 27;
    if (isLastQuestionInSection) {
      const sectionQuestions: Question[] = [];

      for (let i = 1; i <= 27; i++) {
        const key = `edit-${testId}-s${sectionNumber}-q${i}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed: Question = JSON.parse(raw);

            if (uploadedMap.current.has(i)) {
              const file = uploadedMap.current.get(i)!;
              const { imageUrl, imageId } = await uploadImage(file);
              parsed.imageUrl = imageUrl;
              parsed.imageId = imageId;
            }

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
          alert("자동 저장 실패: " + (result?.error ?? "알 수 없는 오류"));
        }
      }
    }

    // ✅ 마지막 섹션 넘김 방지
    const isLastSection = sectionNumber === 4 && questionIndex === 27;
    if (!isLastSection) {
      router.push(
        `/test-edit/${testId}/section/${targetSection}/question/${targetIndex}`
      );
    } else {
      alert("마지막 문제입니다. 더 이상 이동할 수 없습니다.");
    }
  };

  const handleSaveAndNext = async () => {
    if (!questions.length) return;

    const current = questions[0];

    // ✅ 현재 문제 업로드 대기 파일 처리
    if (uploadedMap.current.has(questionIndex)) {
      const file = uploadedMap.current.get(questionIndex)!;
      const { imageUrl, imageId } = await uploadImage(file);
      current.imageUrl = imageUrl;
      current.imageId = imageId;
    }

    // ✅ 로컬 캐시 저장
    localStorage.setItem(cacheKey, JSON.stringify(current));

    // ✅ 서버 저장
    const formData = new FormData();
    formData.append("sectionId", sectionId);
    formData.append("index", String(questionIndex));
    formData.append("payload", JSON.stringify([current]));
    const result = await saveQuestion(formData);

    if (!result?.success) {
      alert("저장 실패: " + (result?.error ?? "알 수 없는 오류"));
      return;
    }

    // ✅ 다음 위치 계산 (확실한 조건 추가)
    const isLastQuestionInSection = questionIndex === 27;
    const isLastSection = sectionNumber === 4;

    const nextSection = isLastQuestionInSection
      ? sectionNumber + 1
      : sectionNumber;
    const nextIndex = isLastQuestionInSection ? 1 : questionIndex + 1;

    // ✅ 라우팅 조건 보장: 마지막 문제/섹션이 아닐 경우에만 이동
    if (!isLastQuestionInSection || !isLastSection) {
      router.push(
        `/test-edit/${testId}/section/${nextSection}/question/${nextIndex}`
      );
    } else {
      // 마지막 문제인 경우, test-list로 이동하거나 처리
      alert("모든 문제가 저장되었습니다.");
      router.push("/test-list");
    }
  };

  const handleSaveAndExit = async () => {
    const allQuestions: Question[] = [];

    for (let i = 1; i <= 27; i++) {
      const key = `edit-${testId}-s${sectionNumber}-q${i}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed: Question = JSON.parse(raw);

          // ✅ 디버깅 로그: 로드된 문제 개별 확인
          console.log(`🧩 문제 ${i} 로드됨`, parsed);

          if (uploadedMap.current.has(i)) {
            const file = uploadedMap.current.get(i)!;
            console.log(`📷 문제 ${i} 이미지 업로드 시도`);
            const { imageUrl, imageId } = await uploadImage(file);
            parsed.imageUrl = imageUrl;
            parsed.imageId = imageId;
          }

          allQuestions.push(parsed);
        } catch (e) {
          console.warn(`⚠️ 문제 ${i}번 파싱 실패`, e);
        }
      } else {
        console.warn(`⚠️ 문제 ${i}번 캐시 없음`);
      }
    }

    console.log("✅ 저장 대상 문제 수:", allQuestions.length);
    if (allQuestions.length > 0) {
      console.log("📝 예시 문제:", allQuestions[0]);
      const formData = new FormData();
      formData.append("sectionId", sectionId);
      formData.append("payload", JSON.stringify(allQuestions));

      console.log("📦 최종 전송 FormData:", {
        sectionId,
        payloadPreview: JSON.stringify(allQuestions.slice(0, 1), null, 2),
      });

      await saveQuestion(formData);
    } else {
      console.warn(
        "❌ 저장할 문제가 없습니다. 모든 문제가 비어 있거나 파싱 실패"
      );
    }

    router.push("/test-list");
  };

  if (!questions.length) return null;

  return (
    <form className="flex flex-col w-full max-w-4xl h-[calc(100vh-4rem)] p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-2">문제 입력</h1>
        <button
          type="button"
          onClick={handleSaveAndExit}
          className="top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          저장 후 종료
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        <QuestionForm
          sectionNumber={sectionNumber}
          questionIndex={questionIndex}
          questions={questions}
          setQuestions={setQuestions}
          onDirtyChange={setIsDirty}
          initialQuestion={initialQuestion}
          onSelectImageFile={(index, file) =>
            uploadedMap.current.set(index, file)
          } // ✅ index별로 저장
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
