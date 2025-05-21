"use client";

import { useState } from "react";

type Choice = {
  id: string;
  text: string;
};

type MultipleChoiceProps = {
  choices: Choice[];
};

export default function MultipleChoice({ choices }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 w-full">
      {choices.map((choice) => {
        const isSelected = selected === choice.id;

        return (
          <div
            key={choice.id}
            onClick={() => setSelected(choice.id)}
            className={`flex items-center w-full bg-white border rounded-md p-2 cursor-pointer transition-colors duration-200
              ${isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-100"}
            `}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 border-2 rounded-full text-sm
                ${isSelected ? "border-blue-500 text-blue-600 font-bold" : ""}
              `}
            >
              {choice.id}
            </div>
            <div className="pl-2">{choice.text}</div>
          </div>
        );
      })}
    </div>
  );
}
