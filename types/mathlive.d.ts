import * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<import("mathlive").MathfieldElement>,
        import("mathlive").MathfieldElement
      > & {
        value?: string;
        "virtual-keyboard-mode"?: string;
        "smart-mode"?: boolean;
        "read-only"?: boolean;
        disabled?: boolean;
      };
    }
  }
}
