import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='style'] Literal[value=/#[0-9a-fA-F]{3,8}/]",
          message:
            "No hex colors in JSX style. Use a Tailwind token utility (bg-primary, text-text, ...). Tokens are defined in app/globals.css @theme.",
        },
        {
          selector: "JSXOpeningElement[name.name='img']",
          message:
            "Use next/image <Image> instead of <img>. Set width/height or fill prop.",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
