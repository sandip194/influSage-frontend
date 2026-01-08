import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [  
    tailwindcss(),
    react()
  ],
  optimizeDeps: {
    include: ['react-pdf'],  // Pre-bundle react-pdf to avoid resolution issues
  },
})
