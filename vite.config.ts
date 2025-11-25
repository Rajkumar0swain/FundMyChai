import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting base to './' allows the app to be deployed to any subdirectory
  // without hardcoding the repo name, provided you use HashRouter (which we do).
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // Process env polyfill for the inline code environment, 
    // though in a real Vite app you usually use import.meta.env
    'process.env': process.env
  }
});