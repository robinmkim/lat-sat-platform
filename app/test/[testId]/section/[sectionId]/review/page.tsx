import { getNextQuestionRoute } from "@/action";
import SectionReviewClient from "./SectionReviewClient";

export default async function SectionReviewPage({
  params,
}: {
  params: Promise<{ testId: string; sectionId: string }>;
}) {
  const { testId, sectionId } = await params;
  const sectionNum = Number(sectionId);

  const nextRoute = await getNextQuestionRoute(
    testId,
    sectionNum + 1,
    1,
    "next"
  );

  return (
    <SectionReviewClient
      testId={testId}
      sectionId={sectionNum}
      nextRoute={nextRoute}
    />
  );
}
