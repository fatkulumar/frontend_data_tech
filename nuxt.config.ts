// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    'nuxt-swiper',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
  ],
  swiper: {
    // Swiper options
    // ----------------------
    // prefix: 'Swiper',
    styleLang: 'css',
    // modules: ['navigation', 'pagination'], // all modules are imported by default
  },
  imports: {
    autoImport: true
  },
  // // auto-importing components
  // components: {
  //   dirs: ['stores']
  // },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: process.env.API_SECRET,
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.API_BASE,
      apiReferer: process.env.API_REFERER,
    },
  },
  $production: {
    routeRules: {
      "/**": {
        isr: true,
      },
    },
    devtools: { enabled: false },
  },
  $development: {
    routeRules: {
      "/**": {
        isr: true,
      },
    },
    devtools: { enabled: true },
    devServer: {
      port: 3000,
    },
  },
  app: {
    head: {
      title: "Data Tech",
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "ini adalah platform Data Tech" },
      ],
      noscript: [
        // <noscript>JavaScript is required</noscript>
        { children: "JavaScript is required" },
      ],
    },
  },
})
