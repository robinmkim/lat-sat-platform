// app/your-page/page.tsx

import QuestionForm from "./QuestionForm";
import { saveQuestion } from "./actions";

export default function Page() {
  return (
    <main className="flex justify-center items-center h-screen bg-gray-300">
      <form
        action={saveQuestion}
        className="bg-white w-4/5 max-w-4xl rounded-lg shadow-lg p-6 space-y-4"
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
    </main>
  );
}
