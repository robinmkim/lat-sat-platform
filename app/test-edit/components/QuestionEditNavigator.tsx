"use client";

import { useState } from "react";
import { isComplete } from "../utils/isComplete";
import { formatSectionLabelWithDash } from "@/components/utils/formatSectionLabel";
import type {
  SectionWithQuestions,
  QuestionWithRelations,
} from "types/question";

type Props = {
  testId: string;
  currentSection: number;
  currentIndex: number;
  onNavigate: (section: number, index: number) => void;
  onClose: () => void;
};

export default function QuestionEditNavigatorModal({
  testId,
  currentSection,
  currentIndex,
  onNavigate,
  onClose,
}: Props) {
  const [selectedSection, setSelectedSection] = useState(currentSection);

  const getTotalQuestions = (section: number) => (section <= 2 ? 27 : 22);
  const totalPerSection = getTotalQuestions(selectedSection);

  const localKey = `edit-${testId}`;
  let questions: QuestionWithRelations[] = [];

  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(localKey) : null;
    if (raw) {
      const allSections: SectionWithQuestions[] = JSON.parse(raw);
      const section = allSections.find(
        (s) => s.sectionNumber === selectedSection
      );
      questions = section?.questions ?? [];
    }
  } catch (e) {
    console.warn("❌ localStorage 파싱 실패:", e);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center w-[400px] bg-white rounded-lg shadow-lg p-5 gap-4">
        {/* ✅ 상단 섹션 탭 */}
        <div className="flex justify-center gap-2 w-full">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedSection(num)}
              className={`px-4 py-2 rounded-md text-base font-medium transition
                ${
                  selectedSection === num
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {formatSectionLabelWithDash(num)}
            </button>
          ))}
        </div>

        {/* ✅ 문제 번호 목록 */}
        <div className="grid grid-cols-5 gap-3 mt-2">
          {Array.from({ length: totalPerSection }, (_, i) => {
            const index = i + 1;
            const isCurrent =
              selectedSection === currentSection && index === currentIndex;

            const q = questions.find((q) => q.index === index);
            const incomplete = !isComplete(q ?? null, selectedSection);

            return (
              <button
                key={index}
                onClick={() => {
                  onNavigate(selectedSection, index);
                  setTimeout(onClose, 10);
                }}
                className={`flex items-center justify-center w-10 h-10 border rounded transition text-sm
                  ${
                    isCurrent
                      ? "border-blue-500 font-bold"
                      : incomplete
                      ? "border-red-400 text-red-600"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100"
                  }
                `}
              >
                {index}
              </button>
            );
          })}
        </div>

        {/* ✅ 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-white border border-gray-400 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
