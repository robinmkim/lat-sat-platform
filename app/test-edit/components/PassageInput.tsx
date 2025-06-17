"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

interface PassageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PassageInput({
  value,
  onChange,
  placeholder,
}: PassageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // ✅ 크기 조절 함수
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 192;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  // ✅ 마운트 후 한번 실행
  useLayoutEffect(() => {
    if (mounted) autoResize();
  }, [value, autoResize, mounted]);

  // ✅ ref 연결 시점에 강제 실행
  const setRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (node) {
      textareaRef.current = node;
      setMounted(true);
    }
  }, []);

  // ✅ 입력 시 즉시 크기 조절
  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    autoResize();
  };

  return (
    <div className="flex flex-col mb-2">
      <label className="mb-1 font-semibold">지문</label>
      <textarea
        ref={setRef}
        value={value}
        onChange={handleInput}
        className="w-full min-h-[5rem] max-h-48 bg-white border rounded resize-none overflow-auto p-2 focus:outline-none ring-1 focus:ring-4 focus:ring-orange-500 transition"
        placeholder={
          placeholder ??
          "예: Text 1: ...\n\nText 2: ...\n\n& Bullet 1\n& Bullet 2"
        }
      />
    </div>
  );
}
