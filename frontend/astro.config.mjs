// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import { execSync } from 'child_process';

// Plugin para inyectar el hash del commit como variable de entorno
function gitCommitPlugin() {
  // Intentar obtener el hash del commit desde múltiples fuentes
  let commitHash = 
    process.env.GIT_COMMIT_HASH ||      // Variable personalizada
    process.env.COMMIT_SHA ||            // Dokploy/Generic
    process.env.VERCEL_GIT_COMMIT_SHA || // Vercel
    process.env.CI_COMMIT_SHA ||         // GitLab CI
    process.env.GITHUB_SHA ||            // GitHub Actions
    null;

  // Si hay variable de entorno, acortar a 7 caracteres
  if (commitHash) {
    commitHash = commitHash.substring(0, 7);
  } else {
    // Intentar obtener desde Git si no hay variables de entorno
    try {
      commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch (error) {
      // En desarrollo o si no hay git disponible
      commitHash = process.env.NODE_ENV === 'development' ? 'dev' : 'unknown';
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
  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  // Static output for simple deployment with serve
  output: "static",
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
