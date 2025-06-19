"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  previewUrl?: string;
  onSelectFile: (file: File) => void;
  visible: boolean;
  onToggleVisibility: () => void;
}

export default function ImageUploadInput({
  previewUrl,
  onSelectFile,
  visible,
  onToggleVisibility,
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

    // ✅ 기존 프리뷰 URL 해제
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setError(null);
    onSelectFile(file);
  };

  // ✅ unmount 시 메모리 정리
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

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

      {/* ✅ 오류 메시지 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* ✅ 이미지 미리보기 */}
      {(localPreview || previewUrl) && (
        <div className="relative w-48 h-auto">
          <Image
            src={localPreview ?? previewUrl!}
            alt="preview"
            width={192}
            height={0} // h-auto 적용을 위해 height 0 + className 필요
            className="w-full h-auto rounded border"
          />
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
