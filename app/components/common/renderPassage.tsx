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

export function renderInline(text: string): React.ReactNode[] {
  const ESCAPE_PREFIX = "<<<ESCAPED_DOLLAR_";
  const ESCAPE_SUFFIX = ">>>";

  // ✅ \$123 → escape 처리
  const tokenized = text.replace(/\\\$(\d[\d,]*)/g, (_, val) => {
    return `${ESCAPE_PREFIX}${val}${ESCAPE_SUFFIX}`;
  });

  const regex =
    /(\${2}[^$]*\${2})|(\$(?![\d,]+\$)[^$]*\$)|(__.+?__)|(\*\*.+?\*\*)|(_[^_]+_)|(\(blank\))|<<<ESCAPED_DOLLAR_[^>]+>>>/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(tokenized)) !== null) {
    const index = match.index;
    const matched = match[0];

    if (index > lastIndex) {
      parts.push(
        <span key={lastIndex}>{tokenized.slice(lastIndex, index)}</span>
      );
    }

    if (matched.startsWith("<<<ESCAPED_DOLLAR_")) {
      const number = matched.slice(ESCAPE_PREFIX.length, -ESCAPE_SUFFIX.length);
      parts.push(<span key={index}>${number}</span>);
    } else if (matched.startsWith("$$") || matched.startsWith("$")) {
      const latex = matched.replace(/^\${1,2}|\${1,2}$/g, "").trim();
      parts.push(
        <MathJax key={index} inline dynamic>
          {"\\(" + latex + "\\)"}
        </MathJax>
      );
    } else if (matched.startsWith("__") && matched.endsWith("__")) {
      const inner = matched.slice(2, -2);
      parts.push(
        <u key={index} className="font-medium">
          {renderInline(inner)}
        </u>
      );
    } else if (matched.startsWith("**") && matched.endsWith("**")) {
      const inner = matched.slice(2, -2);
      parts.push(
        <strong key={index} className="font-bold">
          {renderInline(inner)}
        </strong>
      );
    } else if (matched.startsWith("_") && matched.endsWith("_")) {
      const inner = matched.slice(1, -1);
      parts.push(
        <em key={index} className="italic">
          {renderInline(inner)}
        </em>
      );
    } else if (matched === "(blank)") {
      parts.push(
        <span
          key={index}
          className="inline-block w-24 border-b border-black align-baseline"
        >
          &nbsp;
        </span>
      );
    }

    lastIndex = index + matched.length;
  }

  if (lastIndex < tokenized.length) {
    parts.push(<span key={lastIndex}>{tokenized.slice(lastIndex)}</span>);
  }

  return parts;
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
