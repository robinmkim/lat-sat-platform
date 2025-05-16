// components/common/PassagePreview.tsx
"use client";

import { renderPassage } from "./renderPassage";

interface Props {
  passage?: string;
}

export default function PassagePreview({ passage }: Props) {
  if (!passage) return null;

  return (
    <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
      {renderPassage(passage)}
    </div>
  );
}
