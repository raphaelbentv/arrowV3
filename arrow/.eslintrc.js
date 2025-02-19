module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "prettier/prettier": "off", // Désactive Prettier
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "off",
    "no-debugger": "off"
  }
};