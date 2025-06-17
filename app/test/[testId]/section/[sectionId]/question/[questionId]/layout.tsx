import { MathJaxContext } from "better-react-mathjax";
import MathLiveFontInit from "@/components/MathLiveFontInit";
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
};

export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MathJaxContext config={config}>
      <MathLiveFontInit />
      <div className="w-screen h-screen overflow-hidden bg-white">
        {children}
      </div>
    </MathJaxContext>
  );
}
