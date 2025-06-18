// components/common/renderPassage.tsx
"use client";

import { MathJax } from "better-react-mathjax";

export function renderPassage(passage: string) {
  const lines = passage.split("\n");

  return (
    <div className="whitespace-pre-wrap space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed === "") {
          return <div key={idx} className="h-4" />; // 빈 줄 처리
        }

        if (trimmed.startsWith("&")) {
          // bullet list
          return (
            <div key={idx} className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>{renderInline(trimmed.slice(1).trim())}</div>
            </div>
          );
        }

        // ✅ 들여쓰기 확인: 탭 or 2칸 이상 공백
        const indentMatch = line.match(/^(\s+)/);
        const indentLevel = indentMatch ? indentMatch[1].length : 0;
        const marginLeft = indentLevel * 8; // 1칸당 8px

        return (
          <div key={idx} style={{ marginLeft }}>
            {renderInline(line.trim())}
          </div>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(
    /(\${1,2}[^$]+\${1,2}|__[^_]+__|\*\*[^*]+\*\*|_[^_]+_|\(blank\))/g
  );

  return parts.map((part, idx) => {
    if (!part) return null;

    // ✅ 수식
    if (/^\${1,2}.*\${1,2}$/.test(part)) {
      const latex = part.replace(/^\${1,2}|\${1,2}$/g, "").trim();
      return (
        <MathJax key={idx} inline dynamic>
          {"\\(" + latex + "\\)"}
        </MathJax>
      );
    }

    // ✅ 밑줄
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <u key={idx} className="font-medium italic">
          {part.slice(2, -2)}
        </u>
      );
    }

    // ✅ 굵게 (bold)
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // ✅ 기울임
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // ✅ 빈칸
    if (part === "(blank)") {
      return (
        <span
          key={idx}
          className="inline-block w-24 border-b border-black align-baseline"
        >
          &nbsp;
        </span>
      );
    }

    // ✅ 일반 텍스트
    return <span key={idx}>{part}</span>;
  });
}

export function isEmptyTable(tableData?: string[][]): boolean {
  return (
    Array.isArray(tableData) &&
    tableData.length === 1 &&
    tableData[0].length === 1 &&
    !tableData[0][0]?.trim()
  );
}
