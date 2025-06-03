"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TestResultClient({ test }: { test: any }) {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`answers-${test.id}`);
    if (!raw) return;

    try {
      const userAnswers = JSON.parse(raw);
      const detailsBySection: Record<number, { type: string; items: any[] }> =
        {};

      let totalRW = 0;
      let correctRW = 0;
      let totalMath = 0;
      let correctMath = 0;

      for (const section of test.sections) {
        const sectionAnswers = userAnswers[`section${section.number}`] ?? {};

        for (const q of section.questions) {
          const userRaw = sectionAnswers[q.index];
          const type = q.type;
          const score = typeof q.score === "number" ? q.score : 1;
          const sectionType = section.type;

          let user = "-";
          let correct = "(알 수 없음)";
          let isCorrect = false;

          if (type === "MULTIPLE") {
            const userIndex = parseInt(userRaw);
            const correctIndex = parseInt(q.answer);
            const choices = Array.isArray(q.choices) ? q.choices : [];

            user = choices[userIndex] ?? "-";
            correct = choices[correctIndex] ?? "(알 수 없음)";
            isCorrect = userIndex === correctIndex;
          }

          if (type === "SHORT") {
            const userInput = typeof userRaw === "string" ? userRaw.trim() : "";
            const correctAnswer =
              typeof q.answer === "string" ? q.answer.trim() : "";

            user = userInput || "-";
            correct = correctAnswer || "(알 수 없음)";
            isCorrect = userInput === correctAnswer;
          }

          if (!detailsBySection[section.number]) {
            detailsBySection[section.number] = {
              type: sectionType,
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

          if (sectionType === "READING_WRITING") {
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
        detailsBySection, // ✅ 반드시 포함
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

      {/* ✅ 점수 요약 */}
      <div className="space-y-1">
        <p>
          📘 Reading/Writing: {result.correctRW}점 / {result.totalRW}점
        </p>
        <p>
          🧮 Math: {result.correctMath}점 / {result.totalMath}점
        </p>
        <p className="font-semibold">
          총점: {userScore}점 / {totalScore}점
        </p>
      </div>

      {/* ✅ 섹션별 테이블 렌더링 (방어 코드 포함) */}
      {result.detailsBySection &&
        Object.entries(result.detailsBySection).map(([sectionNumber, data]) => (
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
                {data.items.map((r: any, i: number) => (
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

      {/* ✅ 홈으로 돌아가기 */}
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
