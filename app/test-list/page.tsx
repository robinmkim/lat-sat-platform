export const dynamic = "force-dynamic";

import { prisma } from "lib/prisma";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";
import TestListClient from "./TestListClient";

export default async function TestListPage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = tests.map((test) => ({
    id: test.id,
    name: test.name,
  }));

  return (
    <div className="w-full flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center w-full mb-4">
        <span className="text-xl font-semibold">Test List</span>
        <div className="flex justify-end items-center gap-2 mb-4">
          <Link
            href="/"
            className="bg-gray-200 text-gray-800 rounded px-3 py-1 text-sm hover:bg-gray-300 transition"
          >
            Home
          </Link>
          <Link
            href="/test-add"
            className="flex items-center gap-1 border border-gray-400 rounded-lg px-3 py-1 hover:bg-gray-100 transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Add</span>
          </Link>
        </div>
      </div>

      <TestListClient tests={serialized} />
    </div>
  );
}
