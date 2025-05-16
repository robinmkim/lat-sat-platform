import { prisma } from "@/lib/prisma";
import { getQuestion } from "@/lib/queries/getQuestion";
import SectionEditClient from "@/app/test-edit/SectionEditClient";
import { redirect } from "next/navigation";

export default async function SectionEditPage(context: {
  params: { testId: string; sectionId: string; questionId: string };
}) {
  const testId = context.params.testId;
  const sectionNumber = Number(context.params.sectionId);
  const questionIndex = Number(context.params.questionId);

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
  console.log(question);
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
