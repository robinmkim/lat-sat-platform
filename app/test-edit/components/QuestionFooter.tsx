export default function QuestionFooter({
  sectionNumber,
  questionIndex,
  isDirty,
  onNavigate,
  onSaveAndNext,
}: {
  testId: string;
  sectionNumber: number;
  questionIndex: number;
  isDirty: boolean;
  onNavigate: (section: number, index: number) => void;
  onSaveAndNext: () => void;
}) {
  // ✅ 섹션별 문제 수 정의
  const totalQuestionsBySection: Record<number, number> = {
    1: 27,
    2: 27,
    3: 22,
    4: 22,
  };

  const totalCurrentSection = totalQuestionsBySection[sectionNumber];
  const isLastSection = sectionNumber === 4;
  const isFirstSection = sectionNumber === 1;

  const isLastQuestion = questionIndex === totalCurrentSection && isLastSection;
  const hasPrev = questionIndex > 1 || !isFirstSection;
  const hasNext = !isLastQuestion;

  // ✅ 이전 문제 계산
  let prev: [number, number];
  if (questionIndex > 1) {
    prev = [sectionNumber, questionIndex - 1];
  } else {
    const prevSection = sectionNumber - 1;
    const prevTotal = totalQuestionsBySection[prevSection] ?? 27;
    prev = [prevSection, prevTotal];
  }

  // ✅ 다음 문제 계산
  let next: [number, number];
  if (questionIndex < totalCurrentSection) {
    next = [sectionNumber, questionIndex + 1];
  } else {
    const nextSection = sectionNumber + 1;
    next = [nextSection, 1];
  }

  return (
    <div className="relative flex justify-between items-center mt-12 h-16">
      {hasPrev ? (
        <button
          type="button"
          onClick={() => onNavigate(...prev)}
          className="border rounded px-4 py-2 hover:bg-gray-100 transition"
        >
          ⬅ Back
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onSaveAndNext}
        disabled={!isDirty}
        className={`absolute left-1/2 transform -translate-x-1/2 px-6 py-2 border rounded transition
          ${
            !isDirty
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
      >
        Save & Next
      </button>

      {hasNext ? (
        <button
          type="button"
          onClick={() => onNavigate(...next)}
          className="border rounded px-4 py-2 hover:bg-gray-100 transition"
        >
          Next ➡
        </button>
      ) : (
        <button
          type="submit"
          form="question-form"
          className="border rounded bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition"
        >
          Finish ✅
        </button>
      )}
    </div>
  );
}
