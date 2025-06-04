// components/common/renderPassage.tsx
"use client";

import { MathJax } from "better-react-mathjax";

export function renderPassage(passage: string) {
  const lines = passage.split("\n");

  return (
    <div className="whitespace-pre-wrap space-y-2">
      {lines.map((line, idx) => {
        if (line.trim().startsWith("&")) {
          // ✅ bullet list 렌더링
          return (
            <div key={idx} className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>{renderInline(line.slice(1).trim())}</div>
            </div>
          );
        }

        return <div key={idx}>{renderInline(line)}</div>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  // ✅ 수식, 밑줄, 기울임, blank를 한 번에 구분하는 정규식
  const parts = text.split(
    /(\${1,2}[^$]+\${1,2}|__[^_]+__|_[^_]+_|\(blank\))/g
  );

  return parts.map((part, idx) => {
    if (!part) return null;

    // ✅ 수식 렌더링
    if (/^\${1,2}.*\${1,2}$/.test(part)) {
      const latex = part.replace(/^\${1,2}|\${1,2}$/g, "").trim();
      return (
        <MathJax key={idx} inline dynamic>
          {"\\(" + latex + "\\)"}
        </MathJax>
      );
    }

    // ✅ 밑줄 렌더링
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <u key={idx} className="font-medium">
          {part.slice(2, -2)}
        </u>
      );
    }

    // ✅ 기울임 렌더링
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // ✅ 빈칸 (blank) 렌더링
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
