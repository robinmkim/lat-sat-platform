import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IntroFooter from "@/app/components/IntroFooter";
import { getFirstSolveRoute } from "@/app/action";

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

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white px-4">
      <h1 className="text-3xl font-semibold mb-8">{test.name}</h1>

      <div className="bg-white shadow-lg border rounded-xl w-full max-w-xl p-6 space-y-6">
        {[
          {
            icon: "⏱️",
            title: "Timing",
            desc: "Practice tests are timed, but you can pause them. To continue on another device, you have to start over.",
          },
          {
            icon: "📊",
            title: "Scores",
            desc: "When you finish the practice test, go to My Practice to see your scores and get personalized study tips.",
          },
          {
            icon: "🦽",
            title: "Assistive Technology (AT)",
            desc: "Be sure to practice with any AT you use for testing. If you configure your AT settings here, you may need to repeat on test day.",
          },
          {
            icon: "🔒",
            title: "No Device Lock",
            desc: "We don’t lock your device during practice. On test day, you’ll be blocked from using other programs or apps.",
          },
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 text-xl">{item.icon}</div>
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-600">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <IntroFooter firstQuestionRoute={route} />
    </div>
  );
}
