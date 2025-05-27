"use client";
import { useState } from "react";
import { MathJax } from "better-react-mathjax";

export default function FractionInput() {
  const [value, setValue] = useState("");

  const hasInvalidCombo = value.includes("/") && value.includes(".");
  const isValidFraction = /^-?\d+\s*\/\s*\d+$/.test(value);

  const renderFraction = () => {
    if (!value) return "";
    if (hasInvalidCombo) return "";
    if (isValidFraction) {
      const [numerator, denominator] = value.split("/").map((s) => s.trim());
      return `\\frac{${numerator}}{${denominator}}`;
    }
    return value; // just show raw input
  };

  return (
    <div className="mt-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`border-2 px-3 py-1 rounded-md w-32 text-center text-xl ${
          hasInvalidCombo ? "border-red-500 text-red-600" : "border-black"
        }`}
        placeholder="e.g. 2/7"
      />

      {/* Error message */}
      {hasInvalidCombo && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="text-lg font-bold">❗</span>
          You've entered a decimal point or slash in the wrong position.
        </div>
      )}

      {/* Preview */}
      {!hasInvalidCombo && value && (
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
