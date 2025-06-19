// components/common/renderPassage.tsx
"use client";

import { MathJax } from "better-react-mathjax";

export function renderPassage(passage: string) {
  const lines = passage.split("\n");
  console.log("📘 renderPassage 호출됨:", passage);

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

export function renderInline(text: string): React.ReactNode[] {
  console.log("🧩 renderInline 실행됨:", text);
  const ESCAPE_PREFIX = "<<<ESCAPED_DOLLAR_";
  const ESCAPE_SUFFIX = ">>>";
  const tokenized = text.replace(
    /\\\$(\d[\d,]*)/g,
    (_, val) => `${ESCAPE_PREFIX}${val}${ESCAPE_SUFFIX}`
  );

  const parts = tokenized.split(
    /(\${1,2}[^$]+\${1,2}|__.+?__|\*\*.+?\*\*|_.+?_|\(blank\)|<<<ESCAPED_DOLLAR_[^>]+>>>)/g
  );

  return parts.map((part, idx) => {
    if (!part) return null;

    // ✅ \$ 복원
    const dollarMatch = part.match(/^<<<ESCAPED_DOLLAR_([^>]+)>>>$/);
    if (dollarMatch) {
      return (
        <span key={idx}>
          {"$"}
          {dollarMatch[1]}
        </span>
      );
    }

    // ✅ 수식
    if (/^\${1,2}.*\${1,2}$/.test(part)) {
      const latex = part.replace(/^\${1,2}|\${1,2}$/g, "").trim();
      return (
        <MathJax key={idx} inline dynamic>
          {"\\(" + latex + "\\)"}
        </MathJax>
      );
    }

    // ✅ 밑줄 (재귀)
    if (part.startsWith("__") && part.endsWith("__")) {
      const inner = part.slice(2, -2);
      console.log("밑줄 안 내용 재귀 처리:", inner);
      return (
        <u key={idx} className="font-medium">
          {renderInline(inner)}
        </u>
      );
    }

    // ✅ 굵게 (재귀)
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold">
          {renderInline(inner)}
        </strong>
      );
    }

    // ✅ 기울임 (재귀)
    if (part.startsWith("_") && part.endsWith("_")) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className="italic">
          {renderInline(inner)}
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
