"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  previewUrl?: string;
  onSelectFile: (file: File) => void;
  visible: boolean;
  onToggleVisibility: () => void;
  onClearImage?: () => void; // ✅ 추가
}

export default function ImageUploadInput({
  previewUrl,
  onSelectFile,
  visible,
  onToggleVisibility,
  onClearImage,
}: Props) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ MIME type 검사
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // ✅ 파일 크기 제한 (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("파일 크기는 5MB 이하만 가능합니다.");
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setError(null);
    onSelectFile(file);
  };

  // ✅ unmount 시 프리뷰 해제
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  // ✅ 외부 previewUrl이 바뀌면 프리뷰 동기화
  useEffect(() => {
    if (previewUrl) {
      setLocalPreview(previewUrl);
    }
  }, [previewUrl]);

  if (!visible) {
    return (
      <button
        type="button"
        onClick={onToggleVisibility}
        className="text-blue-600 text-sm underline"
      >
        이미지 입력 보이기
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {(localPreview || previewUrl) && (
        <div className="relative w-48 h-auto">
          <Image
            src={localPreview ?? previewUrl!}
            alt="preview"
            width={192}
            height={0}
            className="w-full h-auto rounded border"
          />
          {onClearImage && (
            <button
              type="button"
              onClick={() => {
                if (localPreview) {
                  URL.revokeObjectURL(localPreview);
                  setLocalPreview(null);
                }
                onClearImage(); // ✅ 외부 상태도 제거
              }}
              className="mt-2 text-red-600 text-sm underline"
            >
              이미지 제거
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onToggleVisibility}
        className="text-blue-600 text-sm underline"
      >
        이미지 입력 숨기기
      </button>
    </div>
  );
}
