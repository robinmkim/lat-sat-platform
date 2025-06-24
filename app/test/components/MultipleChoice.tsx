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
              className={`flex items-center justify-center w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] mr-2
    text-center leading-[1.5rem] text-sm font-semibold rounded-full border-2 
    ${
      isSelected
        ? "border-blue-500 text-blue-600"
        : "border-gray-400 text-gray-700"
    }`}
            >
              {String.fromCharCode(65 + idx)}
            </div>
            <div className="text-sm">{renderInline(choice.text)}</div>{" "}
          </div>
        );
      })}
    </div>
  );
}
