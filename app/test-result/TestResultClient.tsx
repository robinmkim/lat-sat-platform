"use client";

import { useEffect, useState } from "react";
import { QuestionWithRelations, TestWithRelations } from "types/question";

const INDEX_TO_LETTER = ["A", "B", "C", "D"];

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
  rwLost: number;
  mathLost: number;
  detailsBySection: Record<number, SectionResult>;
};

function isCorrectAnswer(
  question: QuestionWithRelations,
  userRaw: string
): boolean {
  if (question.type === "MULTIPLE") {
    const userIndex = parseInt(userRaw);
    const correctIndex = parseInt(question.answer);
    return userIndex === correctIndex;
  }

  if (question.type === "SHORT") {
    const userInput = userRaw?.trim().toLowerCase() ?? "";

    const correctAnswers =
      question.answer
        ?.split(",")
        .map((a: string) => a.trim().toLowerCase())
        .filter((a: string) => a.length > 0) ?? [];

    return correctAnswers.includes(userInput);
  }

  return false;
}

export default function TestResultClient({
  test,
}: {
  test: TestWithRelations;
}) {
  const [result, setResult] = useState<ResultSummary | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`answers-${test.id}`);
    if (!raw) return;

    try {
      const userAnswers: Record<string, Record<number, string>> = JSON.parse(
        raw
      );
      const detailsBySection: Record<number, SectionResult> = {};

      let rwLost = 0;
      let mathLost = 0;

      for (const section of test.sections) {
        const sectionAnswers = userAnswers[`section${section.number}`] ?? {};

        for (const q of section.questions as QuestionWithRelations[]) {
          const userRaw = sectionAnswers[q.index];
          const score = typeof q.score === "number" ? q.score : 1;

          let user = "-";
          let correct = "(알 수 없음)";
          const isCorrect = isCorrectAnswer(q, userRaw);

          if (q.type === "MULTIPLE") {
            const userIndex = parseInt(userRaw);
            const correctIndex = parseInt(q.answer);
            user = isNaN(userIndex) ? "-" : INDEX_TO_LETTER[userIndex];
            correct = isNaN(correctIndex)
              ? "(알 수 없음)"
              : INDEX_TO_LETTER[correctIndex];
          }

          if (q.type === "SHORT") {
            const userInput = typeof userRaw === "string" ? userRaw.trim() : "";
            user = userInput || "-";
            correct =
              q.answer
                ?.split(",")
                .map((a) => a.trim())
                .join(" / ") || "(알 수 없음)";
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

          if (section.type === "READING_WRITING" && !isCorrect) {
            rwLost += score;
          }
          if (section.type === "MATH" && !isCorrect) {
            mathLost += score;
          }
        }
      }

      setResult({
        rwLost,
        mathLost,
        detailsBySection,
      });
    } catch (e) {
      console.error("❌ 답안 파싱 실패", e);
    }
  }, [test]);

  if (!result) return <div className="p-6">로딩 중...</div>;

  const rwScore = Math.max(200, 800 - result.rwLost);
  const mathScore = Math.max(200, 800 - result.mathLost);
  const totalScore = rwScore + mathScore;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">시험 결과</h1>

      <div className="space-y-1">
        <p>📘 Reading/Writing 점수: {rwScore} / 800</p>
        <p>🧮 Math 점수: {mathScore} / 800</p>
        <p className="font-semibold">총점: {totalScore} / 1600</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="pt-8">
        <button
          onClick={() => window.close()}
          className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          창 닫기
        </button>
      </div>
    </div>
  );
}
