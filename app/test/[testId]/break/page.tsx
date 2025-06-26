"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BreakPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const { testId } = params;
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10분 = 600초

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/test/${testId}/section/3/question/1`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, testId]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col w-full items-center justify-center bg-blue-50 text-center">
      <h1 className="text-3xl font-bold mb-4">Break Time</h1>
      <p className="text-lg mb-6">Please take a short break.</p>

      <div className="text-4xl font-mono mb-4">
        {minutes}:{seconds}
      </div>

      {timeLeft <= 10 && (
        <div className="text-xl text-gray-700">
          Moving on to next section in {timeLeft}
        </div>
      )}
    </div>
  );
}
