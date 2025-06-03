"use client";

export default function ShortAnswerInstruction() {
  return (
    <div className="w-full h-full overflow-y-auto pr-2">
      <h2 className="text-lg font-semibold mb-2">
        Student-produced response directions
      </h2>

      <ul className="list-disc pl-6 space-y-1 mb-6">
        <li>
          If you find <strong>more than one correct answer</strong>, enter only
          one answer.
        </li>
        <li>
          You can enter up to 5 characters for a <strong>positive</strong>{" "}
          answer and up to 6 characters (including the negative sign) for a
          <strong> negative</strong> answer.
        </li>
        <li>
          If your answer is a <strong>fraction</strong> that doesn’t fit in the
          provided space, enter the decimal equivalent.
        </li>
        <li>
          If your answer is a <strong>decimal</strong> that doesn’t fit in the
          provided space, enter it by truncating or rounding at the fourth
          digit.
        </li>
        <li>
          If your answer is a <strong>mixed number</strong> (such as 3½), enter
          it as an improper fraction (7/2) or its decimal equivalent (3.5).
        </li>
        <li>
          Don’t enter <strong>symbols</strong> such as a percent sign, comma, or
          dollar sign.
        </li>
      </ul>

      <h3 className="font-medium mb-1">Examples</h3>
      <table className="w-full table-auto border border-collapse border-gray-400 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Answer</th>
            <th className="border px-2 py-1">
              Acceptable ways to
              <br /> enter answer
            </th>
            <th className="border px-2 py-1">
              Unacceptable: will
              <br /> NOT receive credit
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-2 align-top font-medium">3.5</td>
            <td className="border px-2 py-2 align-top">
              <div className="space-y-1">
                <div>3.5</div>
                <div>3.50</div>
                <div>7/2</div>
              </div>
            </td>
            <td className="border px-2 py-2 align-top">
              <div className="space-y-1">
                <div>31/2</div>
                <div>3&nbsp;&nbsp;1/2</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2 align-top font-medium">2⁄3</td>
            <td className="border px-2 py-2 align-top">
              <div className="space-y-1">
                <div>2/3</div>
                <div>.6666</div>
                <div>.6667</div>
                <div>0.666</div>
                <div>0.667</div>
              </div>
            </td>
            <td className="border px-2 py-2 align-top">
              <div className="space-y-1">
                <div>0.66</div>
                <div>.66</div>
                <div>0.67</div>
                <div>.67</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-2 align-top font-medium">−1⁄3</td>
            <td className="border px-2 py-2 align-top">
              <div className="space-y-1">
                <div>−1/3</div>
                <div>-.3333</div>
                <div>-0.333</div>
              </div>
            </td>
            <td className="border px-2 py-2 align-top">
              <div className="space-y-1">
                <div>-.33</div>
                <div>-0.33</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
