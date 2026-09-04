import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Automatically detect GitHub Pages base URL in GitHub Actions CI:
// e.g., 'itskumara1508-web/VS-CODE' -> '/VS-CODE/'
// Defaults to './' for local development and preview
const githubRepoBase = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : process.env.BASE_URL || './';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'github-pages-artifacts',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.resolve(distDir, 'index.html');
        const notFoundPath = path.resolve(distDir, '404.html');
        const noJekyllPath = path.resolve(distDir, '.nojekyll');

        // 1. Ensure .nojekyll exists so GitHub Pages skips Jekyll processing
        if (!fs.existsSync(noJekyllPath)) {
          fs.writeFileSync(noJekyllPath, '');
        }

        // 2. Ensure 404.html mirrors index.html so direct URL hits never 404
        if (fs.existsSync(indexPath) && !fs.existsSync(notFoundPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
        }
      },
    },
  ],
  base: githubRepoBase,
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor';
            }
          }
        },
      },
    },
  },
});
