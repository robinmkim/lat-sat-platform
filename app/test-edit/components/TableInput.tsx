"use client";

interface TableInputProps {
  title?: string;
  data: string[][];
  onChange: (updated: string[][]) => void;
  onTitleChange?: (title: string) => void;
}

export default function TableInput({
  title,
  data,
  onChange,
  onTitleChange,
}: TableInputProps) {
  const safeData: string[][] =
    Array.isArray(data) && data.length > 0 ? data : [["", ""]];

  const updateCell = (row: number, col: number, val: string) => {
    const updated = safeData.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? val : c)) : r
    );
    onChange(updated);
  };

  const addRow = () => {
    const newRow = Array(safeData[0]?.length || 2).fill("");
    onChange([...safeData, newRow]);
  };

  const removeRow = () => {
    if (safeData.length <= 1) return;
    onChange(safeData.slice(0, -1));
  };

  const addColumn = () => {
    const updated = safeData.map((row) => [...row, ""]);
    onChange(updated);
  };

  const removeColumn = () => {
    if ((safeData[0]?.length || 0) <= 1) return;
    const updated = safeData.map((row) => row.slice(0, -1));
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={title ?? ""}
        onChange={(e) => onTitleChange?.(e.target.value)}
        placeholder="표 제목을 입력하세요"
        className="border px-3 py-2 rounded w-full font-medium"
      />

      <table className="table-auto border-collapse border border-gray-300">
        <tbody>
          {safeData.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {Array.isArray(row)
                ? row.map((cell, colIdx) => (
                    <td
                      key={colIdx}
                      className="border border-gray-400 px-2 py-1"
                    >
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          updateCell(rowIdx, colIdx, e.target.value)
                        }
                        className="w-full px-1"
                      />
                    </td>
                  ))
                : null}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={addRow}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          행 추가
        </button>
        <button
          type="button"
          onClick={removeRow}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          행 제거
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          열 추가
        </button>
        <button
          type="button"
          onClick={removeColumn}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          열 제거
        </button>
      </div>
    </div>
  );
}
