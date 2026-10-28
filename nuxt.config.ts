// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  modules: ['@pinia/nuxt'],
  ssr: true,
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001',
    },
  },
  nitro: {
    host: process.env.NITRO_HOST || process.env.HOST || '0.0.0.0',
    port: Number(process.env.NITRO_PORT || process.env.PORT || 3003),
  },
})
