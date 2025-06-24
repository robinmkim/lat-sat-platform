"use client";

import Image from "next/image";

type ChoiceData = {
  id: string;
  text: string;
  imageUrl?: string;
};

type Props = {
  choices: ChoiceData[];
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
};

export default function ImageChoice({
  choices,
  selectedIndex,
  onAnswer,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {choices.map((choice, idx) => {
        const isSelected = selectedIndex === idx;
        const letter = String.fromCharCode(65 + idx); // A, B, C, D

        return (
          <button
            key={choice.id}
            onClick={() => onAnswer(idx)}
            className={`border rounded-lg p-3 text-left shadow-sm transition
              ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "hover:border-gray-400"
              }
              flex flex-col items-start gap-2`}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] 
                text-center leading-[1.5rem] text-sm font-semibold rounded-full border-2
                ${
                  isSelected
                    ? "border-blue-500 text-blue-600"
                    : "border-gray-400 text-gray-700"
                }`}
            >
              {letter}
            </div>

            {/* ✅ 이미지 높이 증가 (기존 h-32 → h-48) */}
            {choice.imageUrl && (
              <div className="relative w-full h-48">
                <Image
                  src={choice.imageUrl}
                  alt={`Choice ${letter}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}

            {choice.text && <div className="text-sm">{choice.text}</div>}
          </button>
        );
      })}
    </div>
  );
}
