"use client";

import ImageUploadInput from "./ImageUploadInput";

interface Props {
  imageUrls: (string | undefined)[];
  correctIndex: number;
  onSelectCorrect: (index: number) => void;
  onSelectImageFile: (index: number, file: File) => void;
}

export default function MultipleChoiceWithImageInput({
  imageUrls,
  correctIndex,
  onSelectCorrect,
  onSelectImageFile,
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
            visible={true} // 항상 표시
            onToggleVisibility={() => {}} // 토글 없음
          />
        </div>
      ))}
    </div>
  );
}
