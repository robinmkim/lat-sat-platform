"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Test } from "types/test";

type ResultItem = {
  index: number;
  user: string;
  correct: string;
  isCorrect: boolean;
  score: number;
};

type SectionResult = {
  type: "READING_WRITING" | "MATH";
  items: ResultItem[];
};

type ResultSummary = {
  correctRW: number;
  totalRW: number;
  correctMath: number;
  totalMath: number;
  detailsBySection: Record<number, SectionResult>;
};

export default function TestResultClient({ test }: { test: Test }) {
  const [result, setResult] = useState<ResultSummary | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`answers-${test.id}`);
    if (!raw) return;

    try {
      const userAnswers: Record<string, Record<number, string>> = JSON.parse(
        raw
      );
      const detailsBySection: Record<number, SectionResult> = {};

      let totalRW = 0;
      let correctRW = 0;
      let totalMath = 0;
      let correctMath = 0;

      for (const section of test.sections) {
        const sectionAnswers = userAnswers[`section${section.number}`] ?? {};

        for (const q of section.questions) {
          const userRaw = sectionAnswers[q.index];
          const score = typeof q.score === "number" ? q.score : 1;

          let user = "-";
          let correct = "(알 수 없음)";
          let isCorrect = false;

          if (q.type === "MULTIPLE") {
            const userIndex = parseInt(userRaw);
            const correctIndex = parseInt(q.answer);
            const choices = Array.isArray(q.choices) ? q.choices : [];

            user = choices[userIndex] ?? "-";
            correct = choices[correctIndex] ?? "(알 수 없음)";
            isCorrect = userIndex === correctIndex;
          }

          if (q.type === "SHORT") {
            const userInput = typeof userRaw === "string" ? userRaw.trim() : "";
            const correctAnswer = q.answer?.trim() ?? "";

            user = userInput || "-";
            correct = correctAnswer || "(알 수 없음)";
            isCorrect = userInput === correctAnswer;
          }

          if (!detailsBySection[section.number]) {
            detailsBySection[section.number] = {
              type: section.type,
              items: [],
            };
          }

          detailsBySection[section.number].items.push({
            index: q.index,
            user,
            correct,
            isCorrect,
            score,
          });

          if (section.type === "READING_WRITING") {
            totalRW += score;
            if (isCorrect) correctRW += score;
          } else {
            totalMath += score;
            if (isCorrect) correctMath += score;
          }
        }
      }

      setResult({
        correctRW,
        totalRW,
        correctMath,
        totalMath,
        detailsBySection,
      });
    } catch (e) {
      console.error("❌ 답안 파싱 실패", e);
    }
  }, [test]);

  if (!result) return <div className="p-6">로딩 중...</div>;

  const totalScore = result.totalRW + result.totalMath;
  const userScore = result.correctRW + result.correctMath;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">시험 결과</h1>

      <div className="space-y-1">
        <p>
          📘 Reading/Writing: {result.correctRW} / {result.totalRW}
        </p>
        <p>
          🧮 Math: {result.correctMath} / {result.totalMath}
        </p>
        <p className="font-semibold">
          총점: {userScore} / {totalScore}
        </p>
      </div>

      {Object.entries(result.detailsBySection).map(([sectionNumber, data]) => (
        <div key={sectionNumber} className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Section {sectionNumber} (
            {data.type === "MATH" ? "Math" : "Reading/Writing"})
          </h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2">#</th>
                <th className="border px-2">Your Answer</th>
                <th className="border px-2">Correct Answer</th>
                <th className="border px-2">Result</th>
                <th className="border px-2">점수</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r, i) => (
                <tr
                  key={i}
                  className={r.isCorrect ? "bg-green-50" : "bg-red-50"}
                >
                  <td className="border px-2">{r.index}</td>
                  <td className="border px-2">{r.user}</td>
                  <td className="border px-2">{r.correct}</td>
                  <td className="border px-2 font-medium">
                    {r.isCorrect ? "✔" : "✘"}
                  </td>
                  <td className="border px-2">{r.isCorrect ? r.score : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="pt-8">
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
