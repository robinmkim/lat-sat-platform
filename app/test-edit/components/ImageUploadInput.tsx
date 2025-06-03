"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageUploadInputProps {
  previewUrl?: string; // DB에서 불러온 imageUrl
  onSelectFile: (file: File) => void;
  visible?: boolean;
  onToggleVisibility?: () => void;
}

export default function ImageUploadInput({
  previewUrl,
  onSelectFile,
  visible = true,
  onToggleVisibility,
}: ImageUploadInputProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 로컬 미리보기 설정
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    // 이미지 파일만 상위로 전달, 업로드는 추후 수행
    onSelectFile(file);
  };

  const handleRemove = () => {
    setLocalPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // 선택 해제 → 상위에서 uploadedMap에서 삭제하도록 구성 가능
  };

  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">문제 이미지</label>

      {(localPreview || previewUrl) && (
        <div className="relative w-64">
          <Image
            src={localPreview ?? previewUrl!}
            alt="preview"
            className="w-64 h-auto rounded border"
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-0.5 text-xs"
            onClick={handleRemove}
          >
            삭제
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {onToggleVisibility && (
        <button
          type="button"
          onClick={onToggleVisibility}
          className="text-sm text-blue-600 underline mt-1"
        >
          이미지 입력 숨기기
        </button>
      )}
    </div>
  );
}
