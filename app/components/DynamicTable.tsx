"use client";

import { useState } from "react";

export default function DynamicTable() {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [data, setData] = useState([[""]]);

  // Add row
  const handleAddRow = () => {
    const newRow = Array(cols).fill("");
    setData((prev) => [...prev, newRow]);
    setRows((prev) => prev + 1);
  };

  // Remove row
  const handleRemoveRow = () => {
    if (rows > 1) {
      setData((prev) => prev.slice(0, -1));
      setRows((prev) => Math.max(1, prev - 1));
    }
  };

  // Add column
  const handleAddCol = () => {
    setData((prev) => prev.map((row) => [...row, ""]));
    setCols((prev) => prev + 1);
  };

  // Remove column
  const handleRemoveCol = () => {
    if (cols > 1) {
      setData((prev) => prev.map((row) => row.slice(0, -1)));
      setCols((prev) => Math.max(1, prev - 1));
    }
  };

  const handleChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={handleAddRow}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Row
        </button>
        <button
          onClick={handleRemoveRow}
          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={rows <= 1}
        >
          - Remove Row
        </button>
        <button
          onClick={handleAddCol}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Column
        </button>
        <button
          onClick={handleRemoveCol}
          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={cols <= 1}
        >
          - Remove Column
        </button>
      </div>

      <table className="table-auto border border-collapse border-gray-400">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border px-2 py-1">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleChange(rowIndex, colIndex, e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
