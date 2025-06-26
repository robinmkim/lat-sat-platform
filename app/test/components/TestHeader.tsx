"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNextQuestionRoute } from "@/action";
import Image from "next/image";

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
  const isBreakPage = pathname.includes("/break");
  const sectionNumber = isBreakPage ? null : Number(pathSegments[4]);
  const questionIndex = isBreakPage ? null : Number(pathSegments[6] || "1");

  const isMathSection = sectionNumber === 3 || sectionNumber === 4;

  const storageKey = sectionNumber
    ? `timeLeft-${testId}-section-${sectionNumber}`
    : "";
  const flagKey = storageKey ? `${storageKey}-initialized` : "";

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showReference, setShowReference] = useState(false);

  useEffect(() => {
    if (isBreakPage || sectionNumber === null || questionIndex === null) return;

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
  }, [isBreakPage, storageKey, flagKey, sectionNumber, questionIndex]);

  useEffect(() => {
    if (isBreakPage || timeLeft === null) return;

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
  }, [isBreakPage, timeLeft, storageKey]);

  const handleExit = () => {
    const confirmed = confirm(
      "If you exit now, your answers will not be saved."
    );
    if (!confirmed) return;

    if (storageKey) sessionStorage.removeItem(storageKey);
    if (flagKey) sessionStorage.removeItem(flagKey);

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
    const nextSectionNumber = sectionNumber ? sectionNumber + 1 : 3;
    const route = await getNextQuestionRoute(
      testId,
      nextSectionNumber,
      1,
      "next"
    );

    if (storageKey) sessionStorage.removeItem(storageKey);
    if (flagKey) sessionStorage.removeItem(flagKey);

    setShowTimeoutModal(false);

    if (!route) {
      router.push(`/test-result/${testId}`);
    } else {
      router.push(route);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full h-[80px] shrink-0 bg-blue-100 border-b-2 border-dashed px-5 pt-1">
        <div className="text-lg font-medium">
          {isBreakPage ? "Break" : `Section ${sectionNumber}`}
        </div>

        {!isBreakPage && (
          <div className="absolute left-1/2 -translate-x-1/2 text-lg font-mono">
            {timeLeft !== null && formatTime(timeLeft)}
          </div>
        )}

        <div className="flex items-center gap-2">
          {isMathSection && !isBreakPage && (
            <button
              onClick={() => setShowReference(true)}
              className="bg-yellow-100 border border-yellow-300 rounded px-3 py-1 text-sm hover:bg-yellow-200 transition"
            >
              📄 Reference
            </button>
          )}

          <button
            onClick={handleExit}
            className="flex items-center justify-center w-fit h-fit bg-red-600 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-red-700 transition"
          >
            Exit
          </button>
        </div>
      </div>

      {showReference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-4xl bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <h2 className="text-lg font-semibold">Reference Sheet</h2>
              <button
                onClick={() => setShowReference(false)}
                className="text-gray-500 hover:text-black transition"
              >
                ✕
              </button>
            </div>
            <Image
              src="/reference/reference-sheet.png"
              alt="Reference Sheet"
              width={960}
              height={720}
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </>
  );
}
