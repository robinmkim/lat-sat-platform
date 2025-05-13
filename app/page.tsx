"use client";

import { useState } from "react";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/16/solid";

export default function Home() {
  const [selected, setSelected] = useState("Test1");

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* 우상단 아이콘을 /test-list로 연결 */}
      <Link href="/test-list">
        <Cog6ToothIcon className="absolute top-4 right-4 w-6 h-6 cursor-pointer hover:rotate-45 transition-transform text-gray-700" />
      </Link>

      {/* 본문 */}
      <div className="w-1/2 max-w-md flex flex-col items-center text-center gap-6">
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
  );
}
