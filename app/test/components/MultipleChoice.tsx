"use client";
import { renderInline } from "@/components/common/renderPassage";

export type Choice = {
  id: string;
  text: string;
};

type MultipleChoiceProps = {
  choices: Choice[];
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
};

export default function MultipleChoice({
  choices,
  selectedIndex,
  onAnswer,
}: MultipleChoiceProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {choices.map((choice, idx) => {
        const isSelected = selectedIndex === idx;

        return (
          <div
            key={choice.id}
            onClick={() => onAnswer(idx)}
            className={`flex items-center w-full bg-white border rounded-md p-2 cursor-pointer transition-colors duration-200
              ${isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-100"}
            `}
          >
            <div
              className={`flex mr-2 items-center justify-center w-6 h-6 border-2 rounded-full text-sm
                ${isSelected ? "border-blue-500 text-blue-600 font-bold" : ""}
              `}
            >
              {String.fromCharCode(65 + idx)} {/* A, B, C, D */}
            </div>
            <div className="text-sm">{renderInline(choice.text)}</div>{" "}
          </div>
        );
      })}
    </div>
  );
}
