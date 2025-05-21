"use client";

import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";

type Props = {
  index: number;
  marked: boolean;
  onToggle: (index: number) => void;
};

export default function BookmarkToggle({ index, marked, onToggle }: Props) {
  const Icon = marked ? SolidBookmarkIcon : OutlineBookmarkIcon;

  return (
    <button
      onClick={() => onToggle(index)}
      className="flex items-center gap-1 w-fit h-fit text-sm text-blue-600 hover:opacity-80 transition"
    >
      <Icon className="w-5 h-5" />
      {marked ? "Marked" : "Mark for Review"}
    </button>
  );
}
