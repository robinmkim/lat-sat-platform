"use client";

import { renderMultilineWithMath } from "./renderPassage";

export default function PassagePreview({ passage }: { passage: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded border border-gray-200">
      {/* ❌ MathJax로 전체 JSX를 감싸지 말고 내부에서만 수식 처리 */}
      {renderMultilineWithMath(passage)}
    </div>
  );
}
