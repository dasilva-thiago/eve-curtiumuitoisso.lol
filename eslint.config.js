import js from "@eslint/js";
import globals from "globals";

const rules = {
  "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  eqeqeq: ["error", "always"],
  "prefer-const": "error",
};

export default [
  { ignores: ["dist/", "node_modules/", ".wrangler/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "module", globals: globals.browser },
    rules,
  },
  {
    files: ["public/**/*.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "script", globals: globals.browser },
    rules,
  },
  {
    files: ["scripts/**/*.mjs", "*.config.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "module", globals: globals.node },
    rules,
  },
];
