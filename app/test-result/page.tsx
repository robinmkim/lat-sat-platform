// app/test-result/page.tsx
import { prisma } from "@/lib/prisma";
import TestResultClient from "./TestResultClient";
import { notFound } from "next/navigation";

export default async function TestResultPage({
  searchParams,
}: {
  searchParams: { testId?: string };
}) {
  const testId = searchParams.testId;
  if (!testId) return notFound();

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      sections: {
        include: { questions: true },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!test) return notFound();

  return <TestResultClient test={test} />;
}
