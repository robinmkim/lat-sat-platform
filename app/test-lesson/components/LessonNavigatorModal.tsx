"use client";

import Link from "next/link";

type Props = {
  testId: string;
  sectionId: number;
  total: number;
  current: number;
  onClose: () => void;
};

export default function LessonNavigatorModal({
  testId,
  sectionId,
  total,
  current,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center w-[380px] bg-white rounded-lg shadow-lg p-5 gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-base font-semibold">
            Section {sectionId}: Questions
          </div>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3 relative">
          {Array.from({ length: total }, (_, i) => {
            const index = i + 1;
            const isCurrent = index === current;

            return (
              <Link
                key={index}
                href={`/test-lesson/${testId}/section/${sectionId}/question/${index}`}
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
      </div>
    </div>
  );
}
