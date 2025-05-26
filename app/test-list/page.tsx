import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";
import TestListClient from "./TestListClient";

export default async function TestListPage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sections: {
        where: { number: 1 }, // 1번 섹션만
        take: 1,
        include: {
          questions: {
            where: { index: 1 }, // 1번 문제만
            take: 1,
          },
        },
      },
    },
  });

  const serialized = tests.map((test) => {
    const section = test.sections?.[0];
    const question = section?.questions?.[0];

    return {
      id: test.id,
      name: test.name,
      sectionId: section?.id ?? null,
      questionId: question?.id ?? null,
    };
  });

  return (
    <div className="w-full flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center w-full mb-4">
        <span className="text-xl font-semibold">Test List</span>
        <Link
          href="/test-add"
          className="flex items-center gap-1 border border-gray-400 rounded-lg px-3 py-1 hover:bg-gray-100 transition"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Add</span>
        </Link>
      </div>

      <TestListClient tests={serialized} />
    </div>
  );
}
