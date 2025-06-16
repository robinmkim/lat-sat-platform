"use client";

import { TrashIcon, PencilSquareIcon } from "@heroicons/react/16/solid";
import { useTransition, useState } from "react";
import { deleteTestById } from "../test-edit/actions";
import Link from "next/link";

type TestListClientProps = {
  tests: {
    id: string;
    name: string;
    sectionId?: string;
    questionId?: string;
  }[];
};

export default function TestListClient({ tests }: TestListClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteTestById(id);
        alert("삭제가 완료되었습니다.");
      } catch (e) {
        console.log(e);
        alert("삭제 중 오류가 발생했습니다.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <>
      {tests.map((test) => {
        const isDeleting = deletingId === test.id;

        // const editHref =
        //   test.sectionId && test.questionId
        //     ? `/test-edit/${test.id}/section/1/question/1`
        //     : "#";

        return (
          <div
            key={test.id}
            className="flex justify-between items-center w-full border-2 border-gray-500 rounded-2xl shadow-2xl px-2 py-1 mb-2"
          >
            <span className={isDeleting ? "text-gray-400 italic" : ""}>
              {test.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(test.id)}
                className="w-6 h-6 text-red-500 hover:scale-110 transition-transform disabled:opacity-50"
                disabled={isPending}
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
                ) : (
                  <TrashIcon />
                )}
              </button>
              <Link
                href={`/test-edit/${test.id}/section/1/question/1`}
                className="w-6 h-6 text-blue-500 hover:scale-110 transition-transform"
              >
                <PencilSquareIcon />
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
