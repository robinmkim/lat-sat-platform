import QuestionForm from "@/app/test-edit/QuestionForm";
import { saveQuestion } from "@/app/test-edit/actions";

export default function SectionEditPage() {
  return (
    <form
      action={saveQuestion}
      className="w-full max-w-4xl flex flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold">문제 입력</h1>
      <QuestionForm />

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          저장
        </button>
      </div>
    </form>
  );
}
