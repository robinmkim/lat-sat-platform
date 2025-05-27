import { useRef } from "react";

interface ImageUploadInputProps {
  imageUrl?: string;
  onChange: (url: string) => void;
  visible?: boolean; // 외부 상태에 따라 이미지 업로드 UI를 숨기거나 보여줄 수 있도록 제어하는 속성
  onToggleVisibility?: () => void; // 숨기기/보이기 토글용 콜백 함수 (optional)
}

export default function ImageUploadInput({
  imageUrl,
  onChange,
  visible = true,
  onToggleVisibility,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // visible이 false일 경우 렌더링하지 않음
  // 이 속성은 상위 컴포넌트에서 조건부 렌더링을 외부 상태로 조절하는 데 사용됩니다.
  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-medium">문제 이미지</label>
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="text-sm text-blue-500 hover:underline"
          >
            숨기기
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          이미지 선택
        </button>

        {imageUrl && (
          <div className="flex items-center gap-2">
            <img
              src={imageUrl}
              alt="문제 이미지 미리보기"
              className="w-32 h-auto rounded border"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-red-600 hover:underline"
            >
              제거
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          onChange(url);
        }}
      />
    </div>
  );
}
