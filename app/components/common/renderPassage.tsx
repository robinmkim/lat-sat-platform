// components/common/renderPassage.tsx
import React from "react";

function renderInline(text: string) {
  const parts = text.split(/(__.*?__)/g); // underline 인식

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <u key={idx} className="font-medium">
          {part.slice(2, -2)}
        </u>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
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
