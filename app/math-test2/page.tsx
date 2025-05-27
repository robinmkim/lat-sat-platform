import MultipleChoice from "../components/MultipleChoice";
import FractionInput from "../test-edit/components/FractionInput"; // Add this line for the math input component

export default function Test() {
  return (
    <main className="bg-gray-300 h-screen flex flex-col items-center justify-center">
      <span className="mb-4">Test #</span>

      <div className="w-4/5 h-[80%] flex flex-col bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-100 px-5 pt-1 border-b-2 border-dashed">
          <div>Section #</div>

          <div className="flex flex-col items-center justify-center">
            <div>00:00</div>
            <div>
              <span>pause</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div>Annotate</div>
            <div>Exit</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-grow min-h-0">
          {/* Left side */}
          <div className="w-1/2 overflow-y-auto p-5">
            <h2 className="text-lg font-semibold mb-2">
              Student-produced response directions
            </h2>

            {/* Bullet List */}
            <ul className="list-disc pl-6 space-y-1 mb-6">
              <li>
                If you find <strong>more than one correct answer</strong>, enter
                only one answer.
              </li>
              <li>
                You can enter up to 5 characters for a <strong>positive</strong>{" "}
                answer and up to 6 characters (including the negative sign) for
                a <strong>negative</strong> answer.
              </li>
              <li>
                If your answer is a <strong>fraction</strong> that doesn’t fit
                in the provided space, enter the decimal equivalent.
              </li>
              <li>
                If your answer is a <strong>decimal</strong> that doesn’t fit in
                the provided space, enter it by truncating or rounding at the
                fourth digit.
              </li>
              <li>
                If your answer is a <strong>mixed number</strong> (such as 3½),
                enter it as an improper fraction (7/2) or its decimal equivalent
                (3.5).
              </li>
              <li>
                Don’t enter <strong>symbols</strong> such as a percent sign,
                comma, or dollar sign.
              </li>
            </ul>

            {/* Table */}
            <h3 className="font-medium mb-1">Examples</h3>
            <table className="w-full table-auto border border-collapse border-gray-400 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Answer</th>
                  <th className="border px-2 py-1">
                    Acceptable ways to
                    <br />
                    enter answer
                  </th>
                  <th className="border px-2 py-1">
                    Unacceptable: will
                    <br />
                    NOT receive credit
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-2 align-top font-medium">
                    3.5
                  </td>
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
                  <td className="border px-2 py-2 align-top font-medium">
                    2⁄3
                  </td>
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
                  <td className="border px-2 py-2 align-top font-medium">
                    −1⁄3
                  </td>
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

          {/* Vertical divider */}
          <div className="w-1.5 bg-gray-400"></div>

          {/* Right side */}
          <div className="w-1/2 overflow-y-auto p-5">
            <div className="flex border-b-2 border-dashed">
              <div className="w-8 bg-black text-white py-1 text-center">6</div>
              <div className="flex-1 bg-gray-300 pl-2 py-1">
                Mark for Review
              </div>
            </div>
            <div className="mt-2">
              A certain apprentice has enrolled in 85 hours of training courses.
              The equation <strong>10x + 15y = 85</strong> represents this
              situation, where <em>x</em> is the number of on-site training
              courses and <em>y</em> is the number of online training courses
              this apprentice has enrolled in. How many more hours does each
              online training course take than each on-site training course?
            </div>

            <div className="mt-4">
              <FractionInput />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-blue-100 px-5 border-t-2 border-dashed">
          <div>Minseob Kim</div>

          <div className="flex items-center justify-center bg-gray-900 px-2 py-1 rounded-md text-white">
            <div>Question 6 of 22</div>
            <div>^</div>
          </div>

          <div className="flex items-end bg-blue-700 px-3 py-1 rounded-xl">
            <div>Next</div>
          </div>
        </div>
      </div>
    </main>
  );
}
