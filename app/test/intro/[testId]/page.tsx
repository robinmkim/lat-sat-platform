import { notFound } from "next/navigation";
import { prisma } from "lib/prisma";
import TestIntroClient from "./TestIntroClient";
import { getQuestionsBySection } from "@/test/action";
import { getFirstSolveRoute } from "@/action";

export default async function TestIntroPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;

  const test = await prisma.test.findUnique({
    where: { id: testId },
  });

  if (!test) return notFound();

  const route = await getFirstSolveRoute(testId);
  const section1Questions = await getQuestionsBySection(testId, 1);
  if (!section1Questions) return notFound();

  return (
    <TestIntroClient
      testId={testId}
      firstQuestionRoute={route}
      section1Questions={section1Questions}
    />
  );
}
