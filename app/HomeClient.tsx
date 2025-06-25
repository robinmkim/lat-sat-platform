"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cog6ToothIcon } from "@heroicons/react/16/solid";

type Test = {
  id: string;
  name: string;
};

export default function HomeClient({ tests }: { tests: Test[] }) {
  const [selected, setSelected] = useState(tests[0]?.id ?? "");
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const handlePasswordConfirm = () => {
    const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
    if (passwordInput === CORRECT_PASSWORD) {
      setShowPasswordModal(false);
      router.push("/test-list");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleStart = () => {
    if (!selected) {
      alert("시험을 선택해주세요.");
      return;
    }

    const url = `/test/intro/${selected}`;
    window.open(
      url,
      "_blank",
      "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=no"
    );
  };

  const handleLesson = () => {
    if (!selected) {
      alert("시험을 선택해주세요.");
      return;
    }

    const url = `/test-lesson/${selected}/section/1/question/1`;
    window.open(
      url,
      "_blank",
      "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=no"
    );
  };

  const handleIconClick = () => {
    setPasswordInput("");
    setShowPasswordModal(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      {/* 설정 아이콘 */}
      <Cog6ToothIcon
        className="absolute top-4 right-4 w-6 h-6 cursor-pointer hover:rotate-45 transition-transform text-gray-700"
        onClick={handleIconClick}
      />

      {/* 비밀번호 입력 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-80 space-y-4">
            <h2 className="text-lg font-semibold text-center">비밀번호 입력</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="비밀번호를 입력하세요"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handlePasswordConfirm}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시험 선택 및 버튼 */}
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-semibold">시험을 선택하세요</h1>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.name}
            </option>
          ))}
        </select>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            시험 모드
          </button>
          <button
            onClick={handleLesson}
            className="bg-gray-600 text-white font-semibold px-6 py-3 rounded hover:bg-gray-700 transition"
          >
            수업 모드
          </button>
        </div>
      </div>
    </div>
  );
}
