import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MathJaxContext } from "better-react-mathjax";
import MathLiveFontInit from "./components/MathLiveFontInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    fontURL: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/fonts", // ✅ CDN 경로 추가
  },
};

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <MathJaxContext config={config} version={3}>
          <main className="flex items-center justify-center w-full h-screen">
            <div className="flex flex-col items-center w-full h-full bg-white rounded-lg shadow-lg">
              <MathLiveFontInit />
              {children}
            </div>
          </main>
        </MathJaxContext>
      </body>
    </html>
  );
}
