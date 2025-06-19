export const dynamic = "force-dynamic";

import { prisma } from "lib/prisma";
import { getAllSectionsWithQuestions } from "lib/queries/getQuestion";
import SectionEditClient from "@/test-edit/SectionEditClient";
import { redirect } from "next/navigation";
import type { SectionWithQuestions } from "types/question";

export default async function SectionEditPage({
  params,
}: {
  params: Promise<{ testId: string; sectionId: string; questionId: string }>;
}) {
  const { testId, sectionId, questionId } = await params;

  const sectionNumber = Number(sectionId);
  const questionIndex = Number(questionId);

  const section = await prisma.section.findUnique({
    where: {
      testId_number: {
        testId,
        number: sectionNumber,
      },
    },
  });

  if (!section) redirect("/test-list");

  const fallbackSections: SectionWithQuestions[] =
    await getAllSectionsWithQuestions(testId);
  return (
    <SectionEditClient
      testId={testId}
      sectionId={section.id}
      sectionNumber={sectionNumber}
      questionIndex={questionIndex}
      fallbackSections={fallbackSections}
    />
  );
}
