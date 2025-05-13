// components/common/PassagePreview.tsx
"use client";

import { renderPassage } from "./renderPassage";

interface Props {
  passage: string;
}

export default function PassagePreview({ passage }: Props) {
  return (
    <div className="flex flex-col w-full bg-white border rounded shadow p-4 gap-3">
      <h2 className="text-base font-semibold">미리보기</h2>
      <div className="w-full whitespace-pre-wrap leading-relaxed break-words text-sm space-y-3">
        {renderPassage(passage)}
      </div>
    </div>
  );
}
