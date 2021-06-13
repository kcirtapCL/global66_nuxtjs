export default {
  ssr: false,
  target: "static",
  head: {
    title: "g66_2021-nuxt",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@400;500;600;700&display=swap" }
    ]
  },
  css: ["~/assets/css/style.min.css", "animate.css"],
  plugins: [
    "~/plugins/i18n.js",
    "~/plugins/validate.js"
  ],
  components: true,
  buildModules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss"
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxt/content",
    "nuxt-i18n"
  ],
  axios: {},
  pwa: {
    manifest: {
      lang: "en"
    }
  },
  content: {},
  build: {
    transpile: [
      "vee-validate/dist/rules"
    ]
  },
  publicRuntimeConfig: {
    BASE: process.env.NODE_ENV === "production" ? "https://transfer-api.global66.com/prod" : process.env.NODE_ENV === "staging" ? "https://transfer-api.global66.com/ci" : "https://transfer-api.global66.com/dev",
    SITE: process.env.NODE_ENV === "production" ? "https://global66.com" : process.env.NODE_ENV === "staging" ? "https://dev.global66.com" : "http://localhost:3000",
    TRANSFER: process.env.NODE_ENV === "production" ? "https://transferencias.global66.com" : "https://transfer-test.global66.com",
    CARD: "https://zrvfnn47lf.execute-api.us-east-1.amazonaws.com/v1/external/card/close",
    IP_DOMAIN_API: process.env.NODE_ENV === "production" ? "a0f4C4LxKd387KY" : "19AMX9rrIpzmKbe",
    IP_DOMAIN: "https://pro.ip-api.com/json",
    SHEET_COMPARATOR: "https://script.google.com/macros/s/AKfycbxF57uC6y6eggs2RTfzI-FBMLj9cMOAgcs8pShnFsl2KI_bRQI-/exec",
    SHEET_COPA66: "https://script.google.com/macros/s/AKfycbzhMwKX-SWJ-husyLXPQZJ2uWVfkCZR52ajbCUMHa7NHiR7RVT4cmw4qCr1NvFwSwSTNA/exec"
  },
  i18n: {
    baseUrl: process.env.NODE_ENV === "production" ? "https://global66.com" : process.env.NODE_ENV === "staging" ? "https://dev.global66.com" : "http://localhost:3000",
    detectBrowserLanguage: false,
    defaultLocale: "cl",
    strategy: "prefix",
    langDir: "i18n/",
    lazy: true,
    seo: true,
    locales: [
      {
        code: "cl",
        iso: "es-CL",
        file: "es-CL.js",
        isCatchallLocale: true
      }
    ]
  }
};
