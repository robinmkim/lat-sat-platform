"use client";

import { useEffect } from "react";
import IntroFooter from "@/components/IntroFooter";
import type { SectionWithQuestions } from "types/question";

type Props = {
  testId: string;
  firstQuestionRoute: string;
  section1Questions: SectionWithQuestions;
};

export default function TestIntroClient({
  testId,
  firstQuestionRoute,
  section1Questions,
}: Props) {
  useEffect(() => {
    sessionStorage.setItem(
      `section-${testId}-${section1Questions.sectionNumber}`,
      JSON.stringify(section1Questions.questions)
    );
  }, [testId, section1Questions]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white px-4">
      <h1 className="text-3xl font-semibold mb-8">
        Welcome to Your Practice Test
      </h1>

      <div className="bg-white shadow-lg border rounded-xl w-full max-w-xl p-6 space-y-6">
        {[
          {
            icon: "\u23F1\uFE0F",
            title: "Timing",
            desc: "Practice tests are timed, but you can pause them. To continue on another device, you have to start over.",
          },
          {
            icon: "\uD83D\uDCCA",
            title: "Scores",
            desc: "When you finish the practice test, go to My Practice to see your scores and get personalized study tips.",
          },
          {
            icon: "\uD83E\uDDFD",
            title: "Assistive Technology (AT)",
            desc: "Be sure to practice with any AT you use for testing. If you configure your AT settings here, you may need to repeat on test day.",
          },
          {
            icon: "\uD83D\uDD12",
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

      <IntroFooter firstQuestionRoute={firstQuestionRoute} />
    </div>
  );
}
