"use client";

import Link from "next/link";

export default function IntroFooter({
  firstQuestionRoute,
}: {
  firstQuestionRoute: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 flex justify-end w-full border-t bg-white px-6 py-3 gap-4">
      <Link
        href={firstQuestionRoute}
        className="flex items-center justify-center w-fit h-fit bg-blue-700 rounded-full px-4 py-2 text-white font-medium hover:bg-blue-800 transition"
      >
        Start
      </Link>
    </div>
  );
}
