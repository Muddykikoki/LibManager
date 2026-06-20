import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "src/generated/**",
      "node_modules/**",
      "dist/**"
    ]
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  },

  js.configs.recommended
];