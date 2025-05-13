"use client";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function QuestionInput({
  value,
  onChange,
  placeholder = "질문을 입력하세요",
}: QuestionInputProps) {
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    const maxHeight = 192;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold">질문 문장</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={autoResize}
        className="w-full min-h-[2.5rem] max-h-48 bg-white border rounded resize-none overflow-auto p-2 focus:outline-none ring-1 focus:ring-4 focus:ring-orange-500 transition"
        placeholder={placeholder}
      />
    </div>
  );
}
