"use client";

/// <reference path="../../types/mathlive.d.ts" />
import { useState } from "react";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/16/solid";

type Test = {
  id: string;
  name: string;
};

export default function HomeClient({ tests }: { tests: Test[] }) {
  const [selected, setSelected] = useState(tests[0]?.id ?? "");

  const handleStart = () => {
    if (!selected) {
      alert("시험을 선택해주세요.");
      return;
    }

    const url = `/test/intro/${selected}`;

    // 새 창 열기 (주소창/툴바 최소화)
    window.open(
      url,
      "_blank",
      "width=1200,height=800,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no"
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <Link href="/test-list">
        <Cog6ToothIcon className="absolute top-4 right-4 w-6 h-6 cursor-pointer hover:rotate-45 transition-transform text-gray-700" />
      </Link>

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
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.name}
            </option>
          ))}
        </select>

        <p className="text-gray-600 text-base">
          You selected:{" "}
          <strong>
            {tests.find((t) => t.id === selected)?.name ?? "(none)"}
          </strong>
        </p>

        <button
          onClick={handleStart}
          className="border rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}
