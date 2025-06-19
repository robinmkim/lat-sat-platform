// app/test/[testId]/layout.tsx
import { ReactNode } from "react";
import { MathJaxContext } from "better-react-mathjax";
import MathLiveFontInit from "@/components/MathLiveFontInit";
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
    fontURL: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/fonts",
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
        <MathJaxContext config={config}>
          <MathLiveFontInit />
          {children}
        </MathJaxContext>
      </main>
      <TestFooter />
    </>
  );
}
