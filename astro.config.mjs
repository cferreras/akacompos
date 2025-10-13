// @ts-check
import {defineConfig} from 'astro/config';

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
    // Static output for simple deployment with serve
    output: 'static'
});