// app/test/[testId]/layout.tsx
import { ReactNode } from "react";
import { MathJaxContext } from "better-react-mathjax";
import TestHeader from "../components/TestHeader";
import TestFooter from "../components/TestFooter";

const config = {
  loader: { load: ["[tex]/ams"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    packages: { "[+]": ["ams"] },
  },
  chtml: {
    fontURL: "/fonts/mathlive", // public/fonts/mathlive 폴더에 위치
  },
};

type Props = {
  children: ReactNode;
};

export default function TestLayout({ children }: Props) {
  return (
    <>
      <TestHeader />
      <main className="flex flex-grow w-full h-full overflow-auto">
        <MathJaxContext config={config}>{children}</MathJaxContext>
      </main>
      <TestFooter />
    </>
  );
}
