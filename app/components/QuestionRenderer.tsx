import PassageInput from "./PassageInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
import QuestionInput from "./QuestionInput";
import PassagePreview from "./common/PassagePreview";
import TableInput from "./TableInput";
import ImageUploadInput from "./ImageUploadInput";
import ShortAnswerInput from "./ShortAnswerInput";
import { Question } from "../test-edit/QuestionForm";

interface QuestionRendererProps {
  sectionNumber: number;
  id: string;
  index: number;
  question: string;
  passage?: string;
  choices?: string[];
  answer: string;
  type: "MULTIPLE" | "SHORT";
  tableData: string[][];
  imageUrl?: string;
  showTable?: boolean;
  showImage?: boolean;
  onUpdate: (data: Partial<Question>) => void;
}

export default function QuestionRenderer({
  sectionNumber,
  question,
  passage,
  choices = ["", "", "", ""],
  answer,
  type,
  tableData,
  imageUrl,
  showTable = true,
  showImage = true,
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
          correctIndex={parseInt(answer) || 0}
          onChangeChoice={(i, val) => {
            const updated = [...choices];
            updated[i] = val;
            onUpdate({ choices: updated });
          }}
          onSelectCorrect={(i) => onUpdate({ answer: i.toString() })}
        />
      ) : (
        <ShortAnswerInput
          value={answer}
          onChange={(val) => onUpdate({ answer: val })}
        />
      )}

      {isReadingWriting && showTable && tableData?.length > 0 && (
        <TableInput
          data={tableData}
          onChange={(updated) => onUpdate({ tableData: updated })}
        />
      )}

      {showImage && (
        <ImageUploadInput
          imageUrl={imageUrl}
          onChange={(url) => onUpdate({ imageUrl: url })}
        />
      )}
    </div>
  );
}
