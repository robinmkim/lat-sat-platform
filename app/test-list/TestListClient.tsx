"use client";

import {
  TrashIcon,
  PencilSquareIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/16/solid";
import { useTransition, useState } from "react";
import { deleteTestById } from "../test-edit/actions";
import { useRouter } from "next/navigation";
import { fetchTestEditData } from "./actions/getTestData";

type TestListClientProps = {
  tests: {
    id: string;
    name: string;
  }[];
};

export default function TestListClient({ tests }: TestListClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const router = useRouter();

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteTestById(id);
        alert("삭제가 완료되었습니다.");
      } catch (e) {
        alert("삭제 중 오류가 발생했습니다.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEdit = async (testId: string) => {
    try {
      const data = await fetchTestEditData(testId);
      localStorage.setItem(`edit-${testId}`, JSON.stringify(data));
      router.push(`/test-edit/${testId}/section/1/question/1`);
    } catch (err) {
      alert("시험 데이터를 불러오는 데 실패했습니다.");
    }
  };

  const handleSave = async (id: string) => {
    try {
      if (editedName.trim() === "") {
        alert("시험 이름을 입력해주세요.");
        return;
      }

      await fetch(`/api/test/${id}/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });

      alert("시험 이름이 수정되었습니다.");
      setEditingId(null);
      setEditedName("");
      router.refresh();
    } catch {
      alert("이름 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  return (
    <>
      {tests.map((test) => {
        const isDeleting = deletingId === test.id;
        const isEditing = editingId === test.id;

        return (
          <div
            key={test.id}
            className="flex justify-between items-center w-full border-2 border-gray-500 rounded-2xl shadow-2xl px-2 py-1 mb-2"
          >
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    style={{
                      width: `${editedName.length + 1}ch`,
                      minWidth: "6rem",
                      maxWidth: "20rem",
                    }}
                  />

                  <button
                    onClick={() => handleSave(test.id)}
                    className="text-green-600 text-sm font-medium hover:scale-110 transition"
                    title="저장"
                  >
                    💾
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-600 text-sm font-medium hover:text-red-500 transition"
                    title="취소"
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`text-base ${
                      isDeleting ? "text-gray-400 italic" : ""
                    }`}
                  >
                    {test.name}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(test.id);
                      setEditedName(test.name);
                    }}
                    className="w-5 h-5 text-blue-500 hover:scale-110 transition-transform"
                    title="이름 수정"
                  >
                    <PencilSquareIcon />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(test.id)}
                className="w-6 h-6 text-red-500 hover:scale-110 transition-transform disabled:opacity-50"
                disabled={isPending}
                title="삭제"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
                ) : (
                  <TrashIcon />
                )}
              </button>

              <button
                onClick={() => handleEdit(test.id)}
                className="w-6 h-6 text-gray-700 hover:scale-110 transition-transform"
                title="문제 수정"
              >
                <WrenchScrewdriverIcon />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
