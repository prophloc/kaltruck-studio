import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  ...(process.env.PUBLIC_SITE_URL ? { site: process.env.PUBLIC_SITE_URL } : {}),
});
