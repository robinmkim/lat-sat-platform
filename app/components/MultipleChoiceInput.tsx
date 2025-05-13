"use client";

interface Props {
  choices: string[];
  correctIndex: number;
  onChangeChoice: (index: number, value: string) => void;
  onSelectCorrect: (index: number) => void;
}

export default function MultipleChoiceInput({
  choices,
  correctIndex,
  onChangeChoice,
  onSelectCorrect,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold">선택지</label>

      {/* ✅ 각 선택지에 mb-3 명시적으로 부여 */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="radio"
          name="correct"
          checked={correctIndex === 0}
          onChange={() => onSelectCorrect(0)}
        />
        <input
          type="text"
          value={choices[0]}
          onChange={(e) => onChangeChoice(0, e.target.value)}
          className="flex-1 w-full bg-white border rounded ring-1 focus:ring-4 focus:ring-orange-500 focus:outline-none p-2 transition"
          placeholder="Choice A"
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="radio"
          name="correct"
          checked={correctIndex === 1}
          onChange={() => onSelectCorrect(1)}
        />
        <input
          type="text"
          value={choices[1]}
          onChange={(e) => onChangeChoice(1, e.target.value)}
          className="flex-1 w-full bg-white border rounded ring-1 focus:ring-4 focus:ring-orange-500 focus:outline-none p-2 transition"
          placeholder="Choice B"
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="radio"
          name="correct"
          checked={correctIndex === 2}
          onChange={() => onSelectCorrect(2)}
        />
        <input
          type="text"
          value={choices[2]}
          onChange={(e) => onChangeChoice(2, e.target.value)}
          className="flex-1 w-full bg-white border rounded ring-1 focus:ring-4 focus:ring-orange-500 focus:outline-none p-2 transition"
          placeholder="Choice C"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="correct"
          checked={correctIndex === 3}
          onChange={() => onSelectCorrect(3)}
        />
        <input
          type="text"
          value={choices[3]}
          onChange={(e) => onChangeChoice(3, e.target.value)}
          className="flex-1 w-full bg-white border rounded ring-1 focus:ring-4 focus:ring-orange-500 focus:outline-none p-2 transition"
          placeholder="Choice D"
        />
      </div>
    </div>
  );
}
