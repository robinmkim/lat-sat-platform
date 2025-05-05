"use client";

import { useState } from "react";

type Choice = {
  id: string;
  text: string;
};

const choices: Choice[] = [
  { id: "A", text: "scholarly" },
  { id: "B", text: "melodic" },
  { id: "C", text: "jarring" },
  { id: "D", text: "personal" },
];

export default function MultipleChoice() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {choices.map((choice) => {
        const isSelected = selected === choice.id;

        return (
          <div
            key={choice.id}
            onClick={() => setSelected(choice.id)}
            className={`w-full flex items-center border rounded-md p-2 cursor-pointer transition-colors duration-200
              ${
                isSelected
                  ? "bg-white ring-2 ring-blue-500"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <div
              className={`inline-flex items-center justify-center border-2 rounded-full w-6 h-6 text-sm transition-colors duration-200
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
