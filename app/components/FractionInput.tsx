"use client";

import { useState, useEffect } from "react";
import { MathJax } from "better-react-mathjax";

type Props = {
  value: string;
  onAnswer: (value: string) => void;
};

export default function FractionInput({ value, onAnswer }: Props) {
  const [input, setInput] = useState(value ?? "");

  useEffect(() => {
    setInput(value ?? "");
  }, [value]);

  const handleChange = (val: string) => {
    setInput(val);
    onAnswer(val); // ✅ 상위에서 sessionStorage 저장
  };

  const hasInvalidCombo = input.includes("/") && input.includes(".");
  const isValidFraction = /^-?\d+\s*\/\s*\d+$/.test(input);

  const renderFraction = () => {
    if (!input) return "";
    if (hasInvalidCombo) return "";
    if (isValidFraction) {
      const [numerator, denominator] = input.split("/").map((s) => s.trim());
      return `\\frac{${numerator}}{${denominator}}`;
    }
    return input;
  };

  return (
    <div className="mt-4">
      <input
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className={`border-2 px-3 py-1 rounded-md w-32 text-center text-xl ${
          hasInvalidCombo ? "border-red-500 text-red-600" : "border-black"
        }`}
        placeholder="e.g. 2/7"
      />

      {hasInvalidCombo && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="text-lg font-bold">❗</span>
          You've entered a decimal point or slash in the wrong position.
        </div>
      )}

      {!hasInvalidCombo && input && (
        <div className="mt-4 font-semibold">
          Answer Preview:{" "}
          <MathJax inline dynamic>
            {"\\(" + renderFraction() + "\\)"}
          </MathJax>
        </div>
      )}
    </div>
  );
}
