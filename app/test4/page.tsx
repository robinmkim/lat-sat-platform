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
            {/* Table */}
            <h2 className="text-center font-medium mb-2">
              Monthly Temperatures and Wing Centroid Sizes of Fruit Fly
              Specimens
            </h2>
            <table className="w-full table-auto border border-collapse border-gray-400">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-2 py-1">Month</th>
                  <th className="border border-gray-400 px-2 py-1">
                    Average high (°F)
                  </th>
                  <th className="border border-gray-400 px-2 py-1">
                    Average low (°F)
                  </th>
                  <th className="border border-gray-400 px-2 py-1">
                    Average male wing centroid size (mm)
                  </th>
                  <th className="border border-gray-400 px-2 py-1">
                    Average female wing centroid size (mm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["May", "73", "50", "1.98", "2.27"],
                  ["July", "87", "62", "2.02", "2.31"],
                  ["September", "80", "54", "1.98", "2.27"],
                  ["October", "67", "44", "1.98", "2.29"],
                ].map(([month, high, low, male, female]) => (
                  <tr key={month}>
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      {month}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      {high}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      {low}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      {male}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      {female}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paragraph */}
            <p className="mt-4 leading-relaxed">
              <em>Drosophila</em> (fruit flies) have generation times of 10–12
              days, so seasonal changes in rainfall and other environmental
              conditions can drive seasonal fluctuations in chromosome
              rearrangements in species such as <em>D. persimilis</em> and{" "}
              <em>D. mediopunctata</em>. <em>Drosophila</em> body size (for
              which wing centroid size serves as a proxy measure) correlates
              with life span. Banu Şebnem Önder and Cansu Fidan Aksoy measured
              the wing sizes of members of a <em>D. melanogaster</em> population
              in Yeşilöz, Turkey, that were collected monthly between May and
              October over three years. Their research suggests that{" "}
              <em>Drosophila</em> collected in relatively warmer months should
              tend to have a longer life span, as is illustrated by the finding
              that ...
            </p>
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
