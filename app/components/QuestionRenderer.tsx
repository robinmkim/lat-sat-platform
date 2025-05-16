import PassageInput from "./PassageInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
import QuestionInput from "./QuestionInput";
import PassagePreview from "./common/PassagePreview";
import TableInput from "./TableInput";

interface QuestionRendererProps {
  sectionNumber: number;
  id: string;
  index: number;
  question: string;
  passage?: string;
  choices?: string[];
  answer: string | number;
  type: "MULTIPLE" | "SHORT";
  tableData: string[][]; // ✅ non-optional
  imageUrl?: string;
  onUpdate: (data: Partial<QuestionRendererProps>) => void;
}

export default function QuestionRenderer({
  sectionNumber,
  id,
  index,
  question,
  passage,
  choices = ["", "", "", ""],
  answer,
  type,
  tableData,
  imageUrl,
  onUpdate,
}: QuestionRendererProps) {
  const isReadingWriting = sectionNumber % 2 === 1;
  return (
    <div className="flex flex-col w-full bg-white p-4 gap-6">
      {isReadingWriting && (
        <>
          <PassageInput
            value={passage ?? ""}
            onChange={(val) => onUpdate({ passage: val })}
          />
          <PassagePreview passage={passage} />
        </>
      )}

      <QuestionInput
        value={question}
        onChange={(val) => onUpdate({ question: val })}
      />

      {type === "MULTIPLE" ? (
        <MultipleChoiceInput
          choices={choices}
          correctIndex={typeof answer === "number" ? answer : 0}
          onChangeChoice={(i, val) => {
            const updated = [...choices];
            updated[i] = val;
            onUpdate({ choices: updated });
          }}
          onSelectCorrect={(i) => onUpdate({ answer: i })}
        />
      ) : (
        <div className="flex flex-col gap-1">
          <label className="font-medium">정답 입력 (단답형)</label>
          <input
            type="text"
            className="border px-3 py-2 rounded"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => onUpdate({ answer: e.target.value })}
          />
        </div>
      )}

      {isReadingWriting && tableData.length > 0 && (
        <TableInput
          data={tableData}
          onChange={(updated) => onUpdate({ tableData: updated })}
        />
      )}
    </div>
  );
}
