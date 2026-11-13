// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://10kjvn.github.io',
  vite: {
    plugins: [tailwindcss()]
  },

  // Code blocks stay dark in both site themes; the default theme's comment colour (#6A737D) fails WCAG contrast
  // on its own background, this one passes.
  markdown: {
    shikiConfig: { theme: "github-dark-high-contrast" },
  },

  integrations: [mdx()]
});