"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionEditNavigatorModal from "./QuestionEditNavigator";

type Props = {
  testId: string;
  sectionNumber: number;
  currentIndex: number;
  totalQuestions: number;
  onSaveAndExit: () => void;
};

export default function SectionEditHeader({
  testId,
  sectionNumber,
  currentIndex,
  onSaveAndExit,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // ✅ 저장하지 않고 종료
  const handleExitWithoutSaving = () => {
    localStorage.removeItem(`edit-${testId}`);
    router.push("/test-list");
  };

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h1 className="text-2xl font-semibold">문제 입력</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-100 border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-200 transition"
        >
          네비게이터
        </button>

        {/* ✅ 저장하지 않고 종료 버튼 */}
        <button
          onClick={handleExitWithoutSaving}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
        >
          저장 없이 종료
        </button>

        {/* ✅ 저장 후 종료 버튼 */}
        <button
          onClick={onSaveAndExit}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          저장 후 종료
        </button>
      </div>

      {showModal && (
        <QuestionEditNavigatorModal
          testId={testId}
          currentSection={sectionNumber}
          currentIndex={currentIndex}
          onNavigate={(targetSection, targetIndex) => {
            window.location.href = `/test-edit/${testId}/section/${targetSection}/question/${targetIndex}`;
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
