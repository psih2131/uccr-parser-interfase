module.exports = {
  apps: [
    {
      name: 'uccr-interface',
      script: '.output/server/index.mjs',
      env: {
        PORT: 3003,
        HOST: '0.0.0.0',
        NITRO_PORT: 3003,
        NITRO_HOST: '0.0.0.0',
        // на сервере поменяй на свой API, если другой
        NUXT_PUBLIC_API_URL: process.env.NUXT_PUBLIC_API_URL || 'http://201.24.49.106:3002',
      },
    },
  ],
}
