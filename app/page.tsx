"use client";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState("Test1");

  return (
    <main className="bg-gray-300 h-screen flex items-center justify-center">
      <div className="w-4/5 h-[80%] flex justify-center items-center bg-white shadow-lg rounded-lg">
        <div className="w-1/2 max-w-md border border-gray-300 rounded-xl shadow-md p-8 flex flex-col items-center text-center gap-6">
          <label htmlFor="test" className="font-semibold text-2xl">
            Select Test:
          </label>

          <select
            id="test"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="text-center border border-gray-400 rounded-md px-4 py-3 text-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Test1">Test1</option>
            <option value="Test2">Test2</option>
            <option value="Test3">Test3</option>
          </select>

          <p className="text-gray-600 text-base">
            You selected: <strong>{selected}</strong>
          </p>
          <button className="border rounded-xl px-2 py-1">Start</button>
        </div>
      </div>
    </main>
  );
}
