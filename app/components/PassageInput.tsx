"use client";

interface PassageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PassageInput({ value, onChange }: PassageInputProps) {
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    const maxHeight = 192;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  return (
    <div className="flex flex-col mb-2">
      <label className="mb-1 font-semibold">지문</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={autoResize}
        className="w-full min-h-[2.5rem] max-h-48 bg-white border rounded resize-none overflow-auto p-2 focus:outline-none ring-1 focus:ring-4 focus:ring-orange-500 transition"
        placeholder="예: Text 1: ...\n\nText 2: ...\n\n& Bullet 1\n& Bullet 2"
      />
    </div>
  );
}
