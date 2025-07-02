import ImageUploadInput from "./ImageUploadInput";

interface Props {
  imageUrls: (string | undefined)[];
  correctIndex: number;
  onSelectCorrect: (index: number) => void;
  onSelectImageFile: (index: number, file: File) => void;
  onClearImage?: (index: number) => void; // ✅ 추가
}

export default function MultipleChoiceWithImageInput({
  imageUrls,
  correctIndex,
  onSelectCorrect,
  onSelectImageFile,
  onClearImage,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-semibold">선택지 이미지</label>

      {imageUrls.map((url, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 border rounded p-4 ${
            correctIndex === i
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="correct"
            checked={correctIndex === i}
            onChange={() => onSelectCorrect(i)}
          />
          <ImageUploadInput
            previewUrl={url}
            onSelectFile={(file) => onSelectImageFile(i, file)}
            onToggleVisibility={() => {}}
            visible={true}
            onClearImage={() => onClearImage?.(i)} // ✅ 전달
          />
        </div>
      ))}
    </div>
  );
}
