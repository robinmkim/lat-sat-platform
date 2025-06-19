"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTestWithSections } from "./actions/createTest";

export default function TestAddPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    const testId = await createTestWithSections(title);

    // ✅ localStorage 초기값 구성
    const sections = Array.from({ length: 4 }, (_, i) => ({
      sectionId: "", // test-edit 진입 후에 sectionId 교체해도 무방
      sectionNumber: i + 1,
      questions: [],
    }));

    localStorage.setItem(`edit-${testId}`, JSON.stringify(sections));

    router.push(`/test-edit/${testId}/section/1/question/1`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
      <h1 className="text-2xl font-bold">시험 생성</h1>
      <label htmlFor="title" className="text-lg font-medium">
        시험 이름
      </label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="예: 2025년 5월 모의고사"
        className="border border-gray-400 rounded-lg px-4 py-2"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white rounded-xl shadow px-4 py-2 hover:scale-105 transition-transform w-fit"
      >
        시험 생성
      </button>
    </div>
  );
}
