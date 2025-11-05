// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import {remarkModifiedTime} from "./remark-modified-time.mjs";

// Cargar variables de entorno
import { loadEnv } from 'vite';
const { DIRECTUS_URL } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Extraer el hostname del DIRECTUS_URL
const directusHostname = DIRECTUS_URL ? new URL(DIRECTUS_URL).hostname : '';

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
    output: 'static',
    // Configuración de imágenes remotas
    image: {
        domains: directusHostname ? [directusHostname] : [],
        remotePatterns: directusHostname ? [{
            protocol: 'https',
            hostname: directusHostname
        }] : []
    }
});