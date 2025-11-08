// eslint.config.js
export default [
  {
    files: ["frontend/**/*.js"],
    rules: {
      semi: "error",
      "no-unused-vars": "error",
    },
  },
  {
    files: ["backend/**/*.js"],
    rules: {
      "no-undef": "error",
      semi: "warn",
    },
  },
];
