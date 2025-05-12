import React from "react";

export default function page() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-4/5 h-[650px] mx-auto">
        <span>Test List</span>
        <div className="flex border-2 border-gray-500 rounded-2xl px-2 py-1 mb-2 shadow-2xl justify-between items-center">
          <span>test 1</span>
          <div className="flex">
            <div className="mr-1 border rounded-xl py-1 px-2">del</div>
            <div className="border rounded-xl py-1 px-2">edit</div>
          </div>
        </div>
        <div className="flex border-2 border-gray-500 rounded-2xl px-2 py-1 mb-2 shadow-2xl justify-between items-center">
          <span>test 2</span>
          <div className="flex">
            <div className="mr-1 border rounded-xl py-1 px-2">del</div>
            <div className="border rounded-xl py-1 px-2">edit</div>
          </div>
        </div>
        <div className="flex border-2 border-gray-500 rounded-2xl px-2 py-1 mb-2 shadow-2xl justify-between items-center">
          <span>test 3</span>
          <div className="flex">
            <div className="mr-1 border rounded-xl py-1 px-2">del</div>
            <div className="border rounded-xl py-1 px-2">edit</div>
          </div>
        </div>
        <div className="flex border-2 border-gray-500 rounded-2xl px-2 py-1 mb-2 shadow-2xl justify-between items-center">
          <span>test 4</span>
          <div className="flex">
            <div className="mr-1 border rounded-xl py-1 px-2">del</div>
            <div className="border rounded-xl py-1 px-2">edit</div>
          </div>
        </div>
      </div>
    </main>
  );
}
