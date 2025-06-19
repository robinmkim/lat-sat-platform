"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNextQuestionRoute } from "@/action";

const getInitialSeconds = (sectionNumber: number): number => {
  return [1, 2].includes(sectionNumber) ? 32 * 60 : 35 * 60;
};

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

export default function TestHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");

  const testId = pathSegments[2];
  const sectionNumber = Number(pathSegments[4]);
  const questionIndex = Number(pathSegments[6] || "1");

  const storageKey = `timeLeft-${testId}-section-${sectionNumber}`;
  const flagKey = `${storageKey}-initialized`;

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  useEffect(() => {
    const initial = getInitialSeconds(sectionNumber);
    const alreadyInitialized = sessionStorage.getItem(flagKey) === "true";

    if (questionIndex === 1 && !alreadyInitialized) {
      sessionStorage.removeItem(storageKey);
      sessionStorage.setItem(storageKey, String(initial));
      sessionStorage.setItem(flagKey, "true");
      setTimeLeft(initial);
    } else {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const value = Number(saved);
        if (!isNaN(value)) {
          setTimeLeft(value);
        }
      }
    }
  }, [storageKey, flagKey, sectionNumber, questionIndex]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          setShowTimeoutModal(true);
          return 0;
        }
        sessionStorage.setItem(storageKey, String(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, storageKey]);

  const handleExit = () => {
    const confirmed = confirm(
      "If you exit now, your answers will not be saved."
    );
    if (!confirmed) return;

    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem(flagKey);

    Object.keys(sessionStorage).forEach((key) => {
      if (
        key.startsWith(`bookmark-${testId}`) ||
        key.startsWith(`timeLeft-${testId}-`)
      ) {
        sessionStorage.removeItem(key);
      }
    });

    sessionStorage.removeItem(`answers-${testId}`);

    if (window.opener) {
      window.close();
    } else {
      alert(
        "이 페이지는 팝업으로 열려야 종료할 수 있습니다. 직접 브라우저 탭을 닫아주세요."
      );
    }
  };

  const handleNextSection = async () => {
    const nextSectionNumber = sectionNumber + 1;
    const route = await getNextQuestionRoute(
      testId,
      nextSectionNumber,
      1,
      "next"
    );

    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem(flagKey);

    if (!route) {
      alert("There are no more sections. Returning to home.");
      router.push("/");
    } else {
      router.push(route);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between w-full h-[80px] shrink-0 bg-blue-100 border-b-2 border-dashed px-5 pt-1">
        <div className="text-lg font-medium">Section {sectionNumber}</div>

        <div className="absolute left-1/2 -translate-x-1/2 text-lg font-mono">
          {timeLeft !== null && formatTime(timeLeft)}
        </div>

        <button
          onClick={handleExit}
          className="flex items-center justify-center w-fit h-fit bg-red-600 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-red-700 transition"
        >
          Exit
        </button>
      </div>

      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center w-fit h-fit bg-white rounded-lg shadow-md p-6 gap-4">
            <div className="text-xl font-semibold">Time's up!</div>
            <div className="text-sm text-gray-600 text-center">
              You will now be moved to the first question of the next section.
            </div>
            <button
              onClick={handleNextSection}
              className="flex items-center justify-center w-fit h-fit bg-blue-700 rounded-md px-4 py-2 text-white font-medium hover:bg-blue-800 transition"
            >
              Next Section
            </button>
          </div>
        </div>
      )}
    </>
  );
}
