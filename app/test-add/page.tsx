"use client";
import { useState } from "react";
import DynamicTable from "../components/DynamicTable";

function renderUnderlined(text: string) {
  const parts = text.split(/(__.*?__)/g);
  return parts.map((part, idx) =>
    part.startsWith("__") && part.endsWith("__") ? (
      <u key={idx} className="font-medium">
        {part.slice(2, -2)}
      </u>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export default function QuestionForm() {
  const [formData, setFormData] = useState({
    passage: "",
    question: "",
    choices: ["", "", "", ""],
    correctAnswer: "A",
  });

  const [tableData, setTableData] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  const updateChoice = (i: number, val: string) => {
    const updated = [...formData.choices];
    updated[i] = val;
    setFormData({ ...formData, choices: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      tableData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-4/5 h-[650px] overflow-y-auto mx-auto flex gap-6">
        {/* Passage */}
        <div className="w-1/2 h-full flex flex-col gap-4">
          <label className="font-bold text-lg">
            Passage (with __underline__)
          </label>
          <textarea
            className="border p-2 rounded-md h-40"
            value={formData.passage}
            onChange={(e) =>
              setFormData({ ...formData, passage: e.target.value })
            }
          />
          <div className="text-sm p-2 bg-gray-50 border rounded whitespace-pre-wrap">
            {renderUnderlined(formData.passage)}
          </div>

          {/* Table input */}
          <h3 className="font-semibold mt-4">Optional Table</h3>
          <DynamicTable tableData={tableData} setTableData={setTableData} />
        </div>

        {/* Question + Choices */}
        <div className="w-1/2 flex flex-col gap-4">
          <label className="font-bold text-lg">Question</label>
          <textarea
            className="border p-2 rounded-md"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
          />
          <div className="space-y-2">
            {["A", "B", "C", "D"].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-4">{label}.</span>
                <input
                  type="text"
                  className="border p-1 rounded w-full"
                  value={formData.choices[idx]}
                  onChange={(e) => updateChoice(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
          <label className="font-semibold mt-2">Correct Answer</label>
          <select
            className="border p-1 rounded"
            value={formData.correctAnswer}
            onChange={(e) =>
              setFormData({ ...formData, correctAnswer: e.target.value })
            }
          >
            {["A", "B", "C", "D"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Question
        </button>
      </div>
    </form>
  );
}
