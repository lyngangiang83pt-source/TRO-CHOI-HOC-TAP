import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.ico', '**/*.sql', '**/.git/**']
    }
  }
});
