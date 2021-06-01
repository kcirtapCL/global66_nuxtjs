module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "@nuxtjs",
    "eslint:recommended",
    "plugin:nuxt/recommended"
  ],
  plugins: [],
  rules: {
    semi: [2, "always"],
    quotes: [2, "double", { avoidEscape: true }],
    "vue/html-closing-bracket-newline": [2, {
      singleline: "never",
      multiline: "never"
    }],
    "vue/no-static-inline-styles": [2],
    "vue/no-unused-properties": [2, {
      groups: ["props", "data", "computed", "methods"],
      deepData: true
    }],
    "vue/static-class-names-order": [2],
    "vue/max-attributes-per-line": [2, {
      singleline: {
        max: 1,
        allowFirstLine: true
      },
      multiline: {
        max: 1,
        allowFirstLine: true
      }
    }]
  }
};
