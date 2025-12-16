import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "*.config.mjs",
    "*.config.js",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ============================================
      // TYPE SAFETY - Prevent runtime type errors
      // ============================================
      // Warn about 'any' type usage (the escape hatch that bypasses type checking)
      "@typescript-eslint/no-explicit-any": "warn",
      // Block unsafe operations with 'any' types
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      // Warn on unnecessary type assertions (redundant casts)
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      // Warn when a boolean check can be simplified
      "@typescript-eslint/strict-boolean-expressions": "warn",

      // ============================================
      // PROMISE HANDLING - Prevent #1 beginner bug
      // ============================================
      // ERROR: All promises must be handled (await or .catch())
      "@typescript-eslint/no-floating-promises": "error",
      // ERROR: Don't use async functions in sync contexts (e.g., onClick handlers)
      "@typescript-eslint/no-misused-promises": "error",
      // ERROR: Only await actual promises, not regular values
      "@typescript-eslint/await-thenable": "error",
      // WARN: Functions that return promises should probably be async
      "@typescript-eslint/promise-function-async": "warn",
      // WARN: Async functions should actually await something
      "require-await": "warn",

      // ============================================
      // CODE QUALITY - Keep code readable
      // ============================================
      // WARN: Functions with >15 branches are too complex
      "complexity": ["warn", 15],
      // WARN: Prevent deeply nested code (max 4 levels)
      "max-depth": ["warn", 4],
      // WARN: Functions should be focused (max 100 lines)
      "max-lines-per-function": [
        "warn",
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      // WARN: Remove debug statements before production
      "no-console": "warn",
      // ERROR: Never commit debugger statements
      "no-debugger": "error",
      // WARN: Use const instead of let when variable isn't reassigned
      "prefer-const": "warn",

      // ============================================
      // COMMON MISTAKES - JavaScript footguns
      // ============================================
      // ERROR: Require === instead of == (prevents type coercion bugs)
      "eqeqeq": ["error", "always"],
      // WARN: Be explicit with type conversions
      "no-implicit-coercion": "warn",
      // WARN: Don't modify function parameters
      "no-param-reassign": "warn",
      // ERROR: Never use var, always use const/let
      "no-var": "error",
      // WARN: Catch unnecessary conditions (always true/false)
      "@typescript-eslint/no-unnecessary-condition": "warn",

      // ============================================
      // REACT BEST PRACTICES
      // ============================================
      // WARN: useEffect dependencies must be complete
      "react-hooks/exhaustive-deps": "warn",
      // WARN: Avoid creating functions in JSX (performance issue)
      "react/jsx-no-bind": "warn",
      // WARN: Don't use array index as key (breaks on reorder)
      "react/no-array-index-key": "warn",

      // ============================================
      // SECURITY - Prevent vulnerabilities
      // ============================================
      // ERROR: Never use eval() (code injection vulnerability)
      "no-eval": "error",
      // ERROR: Don't pass strings to setTimeout/setInterval
      "no-implied-eval": "error",
      // ERROR: Don't use Function constructor
      "no-new-func": "error",
      // WARN: Avoid dangerouslySetInnerHTML (XSS risk)
      "react/no-danger": "warn",

      // ============================================
      // NAMING CONVENTIONS - Readable, consistent code
      // ============================================
      "@typescript-eslint/naming-convention": [
        "warn",
        // Variables & functions: camelCase or PascalCase (for React components)
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],  // Allow PascalCase for React components
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],  // Allow PascalCase for React components
        },
        // Types & Interfaces: PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        // Boolean variables: prefix with 'is' or 'has'
        {
          selector: "variable",
          types: ["boolean"],
          format: ["camelCase"],
          prefix: ["is", "has", "should", "can"],
        },
      ],
    },
  },
]);

export default eslintConfig;
