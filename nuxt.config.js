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
  css: ["@/assets/css/style.min.css"],
  plugins: [],
  components: true,
  buildModules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss"
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxt/content"
  ],
  axios: {},
  pwa: {
    manifest: {
      lang: "en"
    }
  },
  content: {},
  build: {},
  publicRuntimeConfig: {
    BASE: process.env.NODE_ENV === "production" ? "https://ya5w5myk2j.execute-api.us-east-1.amazonaws.com/prod" : process.env.NODE_ENV === "staging" ? "https://uhz9hmhv7j.execute-api.us-east-1.amazonaws.com/ci" : "https://2b8rqg0km8.execute-api.us-east-1.amazonaws.com/dev",
    SITE: process.env.NODE_ENV === "production" ? "https://global66.com" : process.env.NODE_ENV === "staging" ? "https://dev.global66.com" : "http://localhost:3000",
    TRANSFER: process.env.NODE_ENV === "production" ? "https://transferencias.global66.com" : "https://transfer-test.global66.com",
    IP_DOMAIN_API: process.env.NODE_ENV === "production" ? "a0f4C4LxKd387KY" : "19AMX9rrIpzmKbe",
    IP_DOMAIN: "https://pro.ip-api.com/json",
    SHEET_COMPARATOR: "https://script.google.com/macros/s/AKfycbxF57uC6y6eggs2RTfzI-FBMLj9cMOAgcs8pShnFsl2KI_bRQI-/exec"
  }
};
