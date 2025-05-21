"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/16/solid";

type Test = {
  id: string;
  name: string;
};

export default function HomeClient({ tests }: { tests: Test[] }) {
  const [selected, setSelected] = useState(tests[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStart = () => {
    startTransition(async () => {
      try {
        router.push(`/test/intro/${selected}`);
      } catch (err) {
        alert("문제를 찾을 수 없습니다.");
        console.error(err);
      }
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
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
          className="border rounded-xl px-2 py-1 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Start"}
        </button>
      </div>
    </div>
  );
}
