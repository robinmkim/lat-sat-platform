"use client";

import { usePathname } from "next/navigation";
import { formatSectionLabel } from "@/components/utils/formatSectionLabel";

export default function LessonHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");

  const sectionNumber = Number(pathSegments[4]);

  const handleExit = () => {
    const confirmed = confirm("Exit the lesson and close this window?");
    if (!confirmed) return;

    if (window.opener) {
      window.close();
    } else {
      alert(
        "이 페이지는 팝업으로 열려야 종료할 수 있습니다. 직접 브라우저 탭을 닫아주세요."
      );
    }
  };

  return (
    <div className="flex items-center justify-between w-full h-[80px] shrink-0 bg-blue-100 border-b-2 border-dashed px-5 pt-1">
      <div className="text-lg font-medium">
        {formatSectionLabel(sectionNumber)}
      </div>

      <button
        onClick={handleExit}
        className="flex items-center justify-center w-fit h-fit bg-red-600 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-red-700 transition"
      >
        Exit
      </button>
    </div>
  );
}
