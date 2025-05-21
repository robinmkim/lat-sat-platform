// app/test/page.tsx
import { prisma } from "@/lib/prisma";
import MultipleChoice from "../components/MultipleChoice";

export default async function TestPage() {
  // 샘플용: 가장 최신 Test 하나 가져오기
  const test = await prisma.test.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      sections: {
        where: { number: 1 },
        take: 1,
        include: {
          questions: {
            where: { index: 1 },
            take: 1,
          },
        },
      },
    },
  });

  const section = test?.sections[0];
  const question = section?.questions[0];

  return (
    <div className="flex flex-col w-full h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between w-full h-[80px] bg-blue-100 border-b-2 border-dashed px-5 pt-1">
        <div>Section {section?.number ?? "-"}</div>

        <div className="flex flex-col items-center justify-center">
          <div>00:00</div>
          <div>
            <span>pause</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div>Annotate</div>
          <div>Exit</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-grow items-stretch w-full">
        {/* Left side */}
        <div className="flex justify-center w-1/2 overflow-y-auto p-5">
          <span>{question?.passage ?? "No passage available."}</span>
        </div>

        <div className="w-1.5 bg-gray-400" />

        {/* Right side */}
        <div className="flex flex-col w-1/2 overflow-y-auto p-5">
          <div className="flex w-full border-b-2 border-dashed">
            <div className="w-8 bg-black text-white text-center py-1">
              {question?.index ?? "-"}
            </div>
            <div className="flex-1 bg-gray-300 pl-2 py-1">Mark for Review</div>
          </div>

          <div className="mt-4 mb-2">
            {question?.questionText ?? "No question text."}
          </div>

          <MultipleChoice choices={question?.choices ?? []} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between w-full h-[50px] bg-blue-100 border-t-2 border-dashed px-5">
        <div>Minseob Kim</div>

        <div className="flex items-center justify-center px-2 py-1 bg-gray-900 rounded-md text-white">
          <div>Question {question?.index ?? "-"} of ?</div>
          <div>^</div>
        </div>

        <div className="flex items-end px-3 py-1 bg-blue-700 rounded-xl text-white cursor-pointer">
          <div>Next</div>
        </div>
      </div>
    </div>
  );
}
