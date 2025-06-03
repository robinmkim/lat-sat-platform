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
  const isLastQuestion = sectionNumber === 4 && questionIndex === 27;
  const hasPrev = questionIndex > 1 || sectionNumber > 1;
  const hasNext = !isLastQuestion;

  const prev: [number, number] =
    questionIndex > 1
      ? [sectionNumber, questionIndex - 1]
      : [sectionNumber - 1, 27];

  const next: [number, number] =
    questionIndex < 27
      ? [sectionNumber, questionIndex + 1]
      : [sectionNumber + 1, 1];
  console.log(questionIndex, sectionNumber);
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
