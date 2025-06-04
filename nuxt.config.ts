// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  devtools: { enabled: false },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ["/assets/styles/index.css", "@vuepic/vue-datepicker/dist/main.css"],
  modules: [
    [
      "@pinia/nuxt",
      {
        // automatically imports `defineStore` and imports `defineStore` as `definePiniaStore`
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"], "acceptHMRUpdate"],
      },
    ],
    'pinia-plugin-persistedstate/nuxt',
    "@nuxtjs/google-fonts",
    '@primevue/nuxt-module'
  ],

  googleFonts: {
    families: {
      Roboto: true,
      'Josefin+Sans': true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100]
      },
      Inter: '200..700',
      'Crimson Pro': {
        wght: '200..900',
        ital: '200..700',
      }
    }
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        }
      }
    }
  },

  compatibilityDate: '2024-07-05',

  runtimeConfig: {
    public: {
      ngencerfBaseUrl: process.env.NGENCERF_BASE_URL || 'http://localhost:8000'
    }
  }
});
