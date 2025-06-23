"use client";

import { useState } from "react";
import Link from "next/link";

import { formatSectionLabelWithDash } from "@/components/utils/formatSectionLabel";

type SectionInfo = {
  sectionId: number;
  total: number;
};

type Props = {
  testId: string;
  currentSection: number;
  currentIndex: number;
  sections: SectionInfo[];
  onClose: () => void;
};

export default function LessonNavigatorModal({
  testId,
  currentSection,
  currentIndex,
  sections,
  onClose,
}: Props) {
  const [selectedTab, setSelectedTab] = useState(currentSection);

  const current = sections.find((s) => s.sectionId === selectedTab);
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center w-[400px] bg-white rounded-lg shadow-lg p-5 gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-base font-semibold">Navigate Questions</div>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 w-full">
          {sections.map(({ sectionId }) => (
            <button
              key={sectionId}
              onClick={() => setSelectedTab(sectionId)}
              className={`flex-1 py-1 rounded text-sm font-medium border transition
                ${
                  selectedTab === sectionId
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
                }`}
            >
              {formatSectionLabelWithDash(sectionId)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: current.total }, (_, i) => {
            const index = i + 1;
            const isCurrent =
              selectedTab === currentSection && index === currentIndex;

            return (
              <Link
                key={index}
                href={`/test-lesson/${testId}/section/${selectedTab}/question/${index}`}
                onClick={onClose}
              >
                <button
                  className={`flex items-center justify-center w-10 h-10 border border-dashed rounded transition
                    ${
                      isCurrent
                        ? "border-blue-500 font-semibold"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  {index}
                </button>
              </Link>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-2 px-4 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
