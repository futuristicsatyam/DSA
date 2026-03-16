import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: ["**/dist/**", "**/.next/**", "**/coverage/**", "**/node_modules/**"]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  ...nextTs,

  {
    files: ["apps/api/**/*.ts", "apps/web/**/*.ts", "apps/web/**/*.tsx", "packages/**/*.ts", "packages/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    settings: {
      next: {
        rootDir: ["apps/web/"]
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts"
  ])
]);
