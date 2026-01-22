import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/WK/", // Must match your GitHub repo slug
  plugins: [react()],
});
