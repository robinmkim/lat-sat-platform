import BreakClient from "./BreakClient";

export default async function BreakPage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const { testId } = await params;

  return <BreakClient testId={testId} />;
}
