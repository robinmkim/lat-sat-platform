"use client";

import { useEffect, useRef } from "react";
import "mathlive";
import type { MathfieldElement } from "mathlive"; // ref 타입용 (선택)

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MathInput({ value, onChange }: MathInputProps) {
  const ref = useRef<MathfieldElement>(null);

  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;

    mf.value = value;

    const handleInput = () => {
      onChange(mf.value);
    };

    mf.addEventListener("input", handleInput);
    return () => {
      mf.removeEventListener("input", handleInput);
    };
  }, [value, onChange]);

  return (
    <math-field
      ref={ref}
      className="border px-3 py-2 rounded w-full"
      virtual-keyboard-mode="manual"
      smart-mode
    />
  );
}
