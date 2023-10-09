import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react()
    ],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    }
  }
})

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
