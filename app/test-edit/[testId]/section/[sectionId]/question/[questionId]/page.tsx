export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getQuestion } from "@/lib/queries/getQuestion";
import SectionEditClient from "@/app/test-edit/SectionEditClient";
import { redirect } from "next/navigation";

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

  const question = await getQuestion(section.id, questionIndex);

  return (
    <SectionEditClient
      testId={testId}
      sectionId={section.id}
      sectionNumber={sectionNumber}
      questionIndex={questionIndex}
      initialQuestion={question}
    />
  );
}
