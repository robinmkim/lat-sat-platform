import PassageInput from "./PassageInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
import QuestionInput from "./QuestionInput";
import PassagePreview from "./common/PassagePreview";

interface Question {
  id: string;
  question: string;
  passage: string;
  choices: string[];
  correctAnswer: number;
  type: "multiple";
  onUpdate: (data: Partial<Question>) => void;
}

export default function QuestionRenderer({
  id,
  question,
  passage,
  choices,
  correctAnswer,
  type,
  onUpdate,
}: Question) {
  return (
    <div className="flex flex-col w-full bg-white p-4 gap-6">
      <div className="flex flex-col">
        <PassageInput
          value={passage}
          onChange={(val) => onUpdate({ passage: val })}
        />
        {/* ✅ 미리보기 */}
        <PassagePreview passage={passage} />
        <QuestionInput
          value={question}
          onChange={(val) => onUpdate({ question: val })}
        />
      </div>

      <MultipleChoiceInput
        choices={choices}
        correctIndex={correctAnswer}
        onChangeChoice={(i, val) => {
          const updated = [...choices];
          updated[i] = val;
          onUpdate({ choices: updated });
        }}
        onSelectCorrect={(i) => onUpdate({ correctAnswer: i })}
      />
    </div>
  );
}
