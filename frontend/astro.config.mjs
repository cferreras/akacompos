// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import { execSync } from 'child_process';

// Plugin para inyectar el hash del commit como variable de entorno
function gitCommitPlugin() {
  let commitHash = process.env.COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';

  // Intentar obtener desde Git si no hay variables de entorno
  if (commitHash === 'unknown') {
    try {
      // Intentar desde el directorio local primero
      commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch (error) {
      try {
        // Si falla, intentar desde el directorio padre (para proyectos en subdirectorios)
        commitHash = execSync('git -C .. rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
      } catch (error2) {
        // Silencioso si ambos fallan
      }
    }
  }

  return {
    name: 'git-commit-hash',
    config() {
      return {
        define: {
          'import.meta.env.GIT_COMMIT_HASH': JSON.stringify(commitHash),
        }
      };
    }
  };
}


// Cargar variables de entorno
import { loadEnv } from "vite";
const { STRAPI_URL } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  "",
);

// Extraer el hostname del DIRECTUS_URL
const strapiHostname = STRAPI_URL ? new URL(STRAPI_URL).hostname : "";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), gitCommitPlugin()],
    assetsInclude: [
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.gif",
      "**/*.svg",
    ],
  },
  adapter: node({
    mode: 'standalone'
  }),
  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  // Static output for simple deployment with serve
  output: "server",
  // Configuración de imágenes remotas
  image: {
    domains: strapiHostname ? [strapiHostname] : [],
    remotePatterns: strapiHostname
      ? [
        {
          protocol: "https",
          hostname: strapiHostname,
        },
      ]
      : [],
  },
});
