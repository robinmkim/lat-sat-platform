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
            {choice.imageUrl && (
              <div className="relative w-full h-32">
                <Image
                  src={choice.imageUrl}
                  alt={`Choice ${idx + 1}`}
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
