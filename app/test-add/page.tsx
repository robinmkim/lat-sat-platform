"use client";

import { createTestWithSections } from "./actions/createTest";

export default function TestAddPage() {
  return (
    <form
      action={createTestWithSections}
      className="flex flex-col justify-center items-center gap-4 w-full h-full"
    >
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
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl shadow px-4 py-2 hover:scale-105 transition-transform w-fit"
      >
        시험 생성
      </button>
    </form>
  );
}
