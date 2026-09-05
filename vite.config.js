import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/vue-agency-landing-page-template/',
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["color-functions", "global-builtin", "if-function", "import"],
            },
        },
    },
})