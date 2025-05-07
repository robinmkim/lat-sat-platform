"use client";
import { useState } from "react";

export default function TestSelector() {
  const [selected, setSelected] = useState("Test1");

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-full">
      <div className="min-w-[300px] w-[420px] border border-gray-300 rounded-2xl p-10 bg-white shadow-lg flex flex-col items-center text-center gap-6">
        <label htmlFor="test" className="font-semibold text-2xl">
          Select Test:
        </label>

        <select
          id="test"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="text-center border border-gray-400 rounded-md px-4 py-3 text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Test1">Test1</option>
          <option value="Test2">Test2</option>
          <option value="Test3">Test3</option>
        </select>

        <p className="text-gray-600 text-base">
          You selected: <strong>{selected}</strong>
        </p>
      </div>
    </div>
  );
}
