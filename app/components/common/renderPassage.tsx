// ✅ renderPassage.tsx
import React from "react";
import { MathJax } from "better-react-mathjax";

function renderInline(text: string) {
  const parts = text.split(/(\${1,2}[^$]+\${1,2})/g); // 수식 덩어리와 나머지 분리

  return parts.map((part, idx) => {
    if (!part) return null;

    // ✅ 수식 처리: $...$ 또는 $$...$$ → MathJax로 렌더링
    if (/^\${1,2}.*\${1,2}$/.test(part)) {
      const latex = part.replace(/^\${1,2}|\${1,2}$/g, "").trim();
      return (
        <MathJax key={idx} inline dynamic>
          {"\\(" + latex + "\\)"}
        </MathJax>
      );
    }

    // ✅ 밑줄 처리: __...__
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <u key={idx} className="font-medium">
          {part.slice(2, -2)}
        </u>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}

export function renderPassage(passage: string) {
  const blocks = passage.split(/(?:\n---\n)|(?:\n{2,})/);

  return blocks.map((block, idx) => {
    const lines = block.trim().split("\n");
    const bullets = lines.filter((line) => line.trim().startsWith("&"));
    const nonBullets = lines.filter((line) => !line.trim().startsWith("&"));

    return (
      <div key={idx} className="mb-4 space-y-2">
        {nonBullets.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(line)}
          </p>
        ))}

        {bullets.length > 0 && (
          <ul className="list-disc list-inside pl-5 space-y-1 m-0">
            {bullets.map((b, i) => (
              <li key={i}>{renderInline(b.slice(1).trim())}</li>
            ))}
          </ul>
        )}
      </div>
    );
  });
}
// ✅ table 유틸: tableData가 1x1이고 값이 없으면 표시하지 않음
export function isEmptyTable(tableData?: string[][]): boolean {
  return (
    Array.isArray(tableData) &&
    tableData.length === 1 &&
    tableData[0].length === 1 &&
    !tableData[0][0]?.trim()
  );
}
