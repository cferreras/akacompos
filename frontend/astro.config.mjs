// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import { remarkModifiedTime } from "./remark-modified-time.mjs";

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
    plugins: [tailwindcss()],
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
