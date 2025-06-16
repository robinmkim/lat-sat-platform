import { notFound } from "next/navigation";
import { getQuestionsBySection } from "@/test/action";
import { getNextQuestionRoute } from "@/action";
import SectionReviewClient from "./SectionReviewClient";

export default async function SectionReviewPage({
  params,
}: {
  params: Promise<{ testId: string; sectionId: string }>;
}) {
  const { testId, sectionId } = await params;
  const sectionNumber = Number(sectionId);

  const questions = await getQuestionsBySection(testId, sectionNumber);
  if (!questions) return notFound();

  const nextRoute = await getNextQuestionRoute(
    testId,
    sectionNumber,
    999, // 존재하지 않는 인덱스 → nextSection 계산 유도
    "next"
  );

  return (
    <SectionReviewClient
      testId={testId}
      sectionId={sectionNumber}
      questions={questions}
      nextRoute={nextRoute}
    />
  );
}
