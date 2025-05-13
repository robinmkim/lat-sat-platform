"use client";

import { useRouter } from "next/navigation";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";

export default function TestListPage() {
  const router = useRouter();

  const tests = [
    { id: 1, title: "test 1" },
    { id: 2, title: "test 2" },
    { id: 3, title: "test 3" },
    { id: 4, title: "test 4" },
  ];

  const handleDelete = (id: number) => {
    console.log("delete test", id);
  };

  const handleEdit = (id: number) => {
    router.push(`/test-edit/${id}`);
  };

  const goToAddTest = () => {
    router.push("/test-add");
  };

  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        <span className="text-xl font-semibold">Test List</span>
        <button
          onClick={goToAddTest}
          className="flex items-center gap-1 border border-gray-400 rounded-lg px-3 py-1 hover:bg-gray-100 transition"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>

      {tests.map((test) => (
        <div
          key={test.id}
          className="flex justify-between items-center w-full border-2 border-gray-500 rounded-2xl shadow-2xl px-2 py-1 mb-2"
        >
          <span>{test.title}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDelete(test.id)}
              className="w-6 h-6 text-red-500 hover:scale-110 transition-transform"
            >
              <TrashIcon />
            </button>
            <button
              onClick={() => handleEdit(test.id)}
              className="w-6 h-6 text-blue-500 hover:scale-110 transition-transform"
            >
              <PencilSquareIcon />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
