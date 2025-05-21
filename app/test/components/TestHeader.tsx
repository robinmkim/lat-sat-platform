"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getNextQuestionRoute } from "@/app/action";

type Props = {
  sectionNumber: number;
  testId: string;
};

const getInitialSeconds = (sectionNumber: number): number => {
  return [1, 3].includes(sectionNumber) ? 32 * 60 : 35 * 60;
};

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

export default function TestHeader({ sectionNumber, testId }: Props) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(() =>
    getInitialSeconds(sectionNumber)
  );
  const [paused, setPaused] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  useEffect(() => {
    if (paused || showTimeoutModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeoutModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, showTimeoutModal]);

  const handleExit = () => {
    if (confirm("If you exit now, your answers will not be saved.")) {
      router.push("/");
    }
  };

  const handleNextSection = async () => {
    const nextSectionNumber = sectionNumber + 1;

    const route = await getNextQuestionRoute(testId, nextSectionNumber, 1);

    if (!route) {
      alert("There are no more sections. Returning to home.");
      router.push("/");
      return;
    }

    router.push(route);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full h-[80px] bg-blue-100 border-b-2 border-dashed px-5 pt-1">
        {/* Left: Section Number */}
        <div className="text-lg font-medium">Section {sectionNumber}</div>

        {/* Center: Timer + Pause */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-fit h-fit">
          <div className="text-lg font-mono">{formatTime(timeLeft)}</div>
          <button
            onClick={() => setPaused(true)}
            className="flex items-center justify-center w-fit h-fit bg-gray-200 rounded-md px-3 py-1 text-sm text-blue-700 font-medium hover:bg-gray-300 transition"
          >
            Pause
          </button>
        </div>

        {/* Right: Exit */}
        <button
          onClick={handleExit}
          className="flex items-center justify-center w-fit h-fit bg-red-600 rounded-md px-3 py-1 text-sm text-white font-medium hover:bg-red-700 transition"
        >
          Exit
        </button>
      </div>

      {/* Pause Overlay */}
      {paused && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-white text-3xl font-semibold mb-6">Paused</div>
          <button
            onClick={() => setPaused(false)}
            className="flex items-center justify-center w-fit h-fit bg-white rounded-md px-4 py-2 text-lg text-blue-700 font-medium shadow hover:bg-gray-100 transition"
          >
            Resume
          </button>
        </div>
      )}

      {/* Timeout Modal */}
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
