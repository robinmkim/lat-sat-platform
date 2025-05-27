interface ShortAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ShortAnswerInput({
  value,
  onChange,
}: ShortAnswerInputProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">정답 입력 (단답형)</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 w-full"
        placeholder="정답을 입력하세요"
      />
    </div>
  );
}
