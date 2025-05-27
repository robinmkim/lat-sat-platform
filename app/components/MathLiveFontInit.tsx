"use client";

import { useEffect } from "react";
import "mathlive";

export default function MathLiveFontInit() {
  useEffect(() => {
    import("mathlive").then((mathlive) => {
      mathlive.MathfieldElement.fontsDirectory =
        "https://unpkg.com/mathlive@0.105.3/dist/fonts";
    });
  }, []);

  return null;
}
