"use client";

import { createTestWithSections } from "./actions/createTest";

export default function TestAddPage() {
  return (
    <form
      action={createTestWithSections}
      className="flex flex-col justify-center items-center gap-4 w-full h-full"
    >
      <label htmlFor="title" className="text-lg font-medium">
        Create a New Test
      </label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Test Name"
        className="border border-gray-400 rounded-lg px-4 py-2"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl shadow px-4 py-2 hover:scale-105 transition-transform w-fit"
      >
        Create
      </button>
    </form>
  );
}
