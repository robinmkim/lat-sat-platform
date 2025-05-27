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
  if (!data || data.length === 0) return null;

  const updateCell = (row: number, col: number, val: string) => {
    const updated = data.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? val : c)) : r
    );
    onChange(updated);
  };

  const addRow = () => {
    const newRow = Array(data[0]?.length || 2).fill("");
    onChange([...data, newRow]);
  };

  const addColumn = () => {
    const updated = data.map((row) => [...row, ""]);
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
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={colIdx} className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                    className="w-full px-1"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={addRow}
          className="border px-2 py-1 rounded text-sm"
        >
          행 추가
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="border px-2 py-1 rounded text-sm"
        >
          열 추가
        </button>
      </div>
    </div>
  );
}
