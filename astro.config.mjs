// @ts-check
import {defineConfig} from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';
import {remarkModifiedTime} from "./remark-modified-time.mjs";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()], 
        assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
    }, 
    markdown: {
        remarkPlugins: [remarkModifiedTime],
    },
    // Cambiar a SSR para evitar cache y reflejar cambios de Directus inmediatamente
    output: 'server',
    adapter: node({
        mode: 'standalone'
    })
});