"use client";

interface Props {
  choices: string[];
  correctIndex: number;
  onChangeChoice: (index: number, value: string) => void;
  onSelectCorrect: (index: number) => void;
}

const choiceLabels = ["A", "B", "C", "D"];

export default function MultipleChoiceInput({
  choices,
  correctIndex,
  onChangeChoice,
  onSelectCorrect,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold">선택지</label>

      {choices.map((choice, index) => (
        <div key={index} className="flex items-center gap-2 mb-3 last:mb-0">
          <input
            type="radio"
            name="correct"
            checked={correctIndex === index}
            onChange={() => onSelectCorrect(index)}
          />
          <input
            type="text"
            value={choice ?? ""}
            onChange={(e) => onChangeChoice(index, e.target.value)}
            className="flex-1 w-full bg-white border rounded ring-1 focus:ring-4 focus:ring-orange-500 focus:outline-none p-2 transition"
            placeholder={`Choice ${
              choiceLabels[index] ?? String.fromCharCode(65 + index)
            }`}
          />
        </div>
      ))}
    </div>
  );
}
