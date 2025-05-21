"use client";

import Link from "next/link";

type Props = {
  testId: string;
  sectionId: number;
  total: number;
  current: number;
  bookmarks: Record<number, boolean>;
  onClose: () => void;
};

export default function QuestionNavigatorModal({
  testId,
  sectionId,
  total,
  current,
  bookmarks,
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
            const isBookmarked = bookmarks[index] ?? false;

            return (
              <Link
                key={index}
                href={`/test/${testId}/section/${sectionId}/question/${index}`}
                onClick={onClose}
              >
                <button
                  className={`relative flex items-center justify-center w-10 h-10 border border-dashed rounded transition
                    ${
                      isCurrent
                        ? "border-blue-500 font-semibold"
                        : "text-gray-800 hover:bg-gray-100"
                    }
                    ${isBookmarked ? "ring-2 ring-blue-500" : ""}
                  `}
                >
                  {index}
                  {isBookmarked && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              </Link>
            );
          })}
        </div>

        <button className="w-full h-fit bg-white border border-gray-400 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition">
          Go to Review Page
        </button>
      </div>
    </div>
  );
}
