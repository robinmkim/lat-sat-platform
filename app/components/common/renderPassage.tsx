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
          return (
            <div key={idx} className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>{renderInline(trimmed.slice(1).trim())}</div>
            </div>
          );
        }

        return <div key={idx}>{renderInline(line)}</div>;
      })}
    </div>
  );
}

export function renderInline(text: string): React.ReactNode[] {
  const ESCAPE_PREFIX = "<<<ESCAPED_DOLLAR_";
  const ESCAPE_SUFFIX = ">>>";

  const tokenized = text.replace(
    /\\\$(\d[\d,]*)/g,
    (_, val) => `${ESCAPE_PREFIX}${val}${ESCAPE_SUFFIX}`
  );

  const parts = tokenized.split(
    /(\${1,2}[^$]*?\${1,2}|__.+?__|\*\*.+?\*\*|_.+?_|\(blank\)|<<<ESCAPED_DOLLAR_[^>]+>>>)/g
  );

  return parts.map((part, idx) => {
    if (!part) return null;

    const dollarMatch = part.match(/^<<<ESCAPED_DOLLAR_([^>]+)>>>$/);
    if (dollarMatch) {
      return (
        <span key={idx}>
          {"$"}
          {dollarMatch[1]}
        </span>
      );
    }

    if (/^\${1,2}[^$]*\${1,2}$/.test(part)) {
      const latex = part.replace(/^\${1,2}|\${1,2}$/g, "").trim();
      return (
        <MathJax key={idx} inline dynamic>
          {"\\(" + latex + "\\)"}
        </MathJax>
      );
    }

    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <u key={idx} className="font-medium">
          {renderInline(part.slice(2, -2))}
        </u>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold">
          {renderInline(part.slice(2, -2))}
        </strong>
      );
    }

    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={idx} className="italic">
          {renderInline(part.slice(1, -1))}
        </em>
      );
    }

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

    return <span key={idx}>{part}</span>;
  });
}

export function isEmptyTable(tableData?: string[][]): boolean {
  if (!tableData) return true;
  if (tableData.length === 0) return true;
  if (tableData.length === 1 && tableData[0].length === 0) return true;
  if (
    tableData.length === 1 &&
    tableData[0].length === 1 &&
    !tableData[0][0].trim()
  )
    return true;
  return false;
}
export function renderMultilineWithMath(text: string): React.ReactNode {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, idx) => (
        <div key={idx} className="whitespace-pre-wrap">
          {/* ✅ 항상 span으로 감싸고, 빈 줄도 처리 */}
          <span>{renderInline(line)}</span>
        </div>
      ))}
    </>
  );
}
