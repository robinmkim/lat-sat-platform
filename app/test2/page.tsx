import MultipleChoice from "../components/MultipleChoice";

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

        <div className="flex flex-grow items-stretch">
          {/* Left side */}
          <div className="w-1/2 flex flex-col justify-center p-5">
            <span className="text-lg">Text 1</span>
            <span>
              In recommending Bao Phi's collection <i>Song I Sing</i>, a
              librarian noted that pieces by the spoken-word poet don't lose
              their ____ nature when printed: the language has the same pleasant
              musical quality on the page as it does when performed by Phi.
            </span>
            <span className="text-lg">Text 2</span>
            <span>
              In recommending Bao Phi's collection <i>Song I Sing</i>, a
              librarian noted that pieces by the spoken-word poet don't lose
              their ____ nature when printed: the language has the same pleasant
              musical quality on the page as it does when performed by Phi.
            </span>
          </div>

          {/* Vertical divider */}
          <div className="w-1.5 bg-gray-400"></div>

          {/* Right side */}
          <div className="w-1/2 flex flex-col p-5">
            {/* Question Info */}
            <div className="flex border-b-2 border-dashed">
              <div className="w-8 bg-black text-white py-1 text-center">1</div>
              <div className="flex-1 bg-gray-300 pl-2 py-1">
                Mark for Review
              </div>
            </div>

            {/* Question */}
            <div>
              Which Choice completes the text with the most logical and precise
              word or phrase?
            </div>

            {/* Choices */}
            <MultipleChoice />
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between bg-blue-100 px-5 border-t-2 border-dashed">
          <div>Minseob Kim</div>

          <div className="flex items-center justify-center bg-gray-900 px-2 py-1 rounded-md text-white">
            <div>Question 1 of 8</div>
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
