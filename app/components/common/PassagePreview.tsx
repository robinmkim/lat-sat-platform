"use client";

import { MathJax } from "better-react-mathjax";
import { renderPassage } from "./renderPassage";

export default function PassagePreview({ passage }: { passage: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded border border-gray-200">
      <MathJax dynamic inline key={passage}>
        {renderPassage(passage)}
      </MathJax>
    </div>
  );
}
