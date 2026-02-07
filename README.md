# AKACompos (Preview)

Plataforma web donde [AKAWonder](https://twitch.tv/akawonder), jugador profesional y creador de contenido de Teamfight Tactics (TFT), publica sus composiciones recomendadas para cada parche.

> **Esta es la rama `preview`.** Muestra tanto las composiciones publicadas como las que estan en borrador, con indicadores visuales para diferenciarlas.

## Diferencias con produccion (`master`)

| Aspecto | `master` | `preview` |
|---------|----------|-----------|
| Composiciones visibles | Solo publicadas | Publicadas + borradores |
| Variable `STRAPI_PREVIEW` | No existe / `false` | `true` |
| Indicadores visuales | Ninguno | Badge "PREVIEW" en tarjetas, banner en pagina de detalle |

### Indicadores visuales de preview

- **Lista de composiciones**: las que estan en borrador muestran un badge ambar "PREVIEW" en la esquina superior derecha de la tarjeta.
- **Pagina de detalle**: las composiciones en borrador muestran un banner superior indicando que no estan publicadas todavia.

## Como funciona

La rama preview modifica el parametro `publicationState` de las peticiones a Strapi:

- `master` usa `publicationState: "live"` (solo contenido publicado)
- `preview` usa `publicationState: "preview"` (publicado + borradores)

Esto se controla con la variable de entorno `STRAPI_PREVIEW`.

## Configuracion

En `frontend/.env`, la variable `STRAPI_PREVIEW` ya esta activada:

```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=tu_api_token_de_strapi
PORT=3000

# Preview Mode
STRAPI_PREVIEW=true
```

Para desactivar el modo preview, cambia `STRAPI_PREVIEW` a `false` o eliminala.

## Stack tecnologico

| Capa | Tecnologia |
|------|------------|
| Frontend | [Astro 5](https://astro.build/) con SSR (Node standalone) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| CMS | [Strapi 5](https://strapi.io/) |
| Base de datos | SQLite (desarrollo) / PostgreSQL (produccion) |
| Almacenamiento | Cloudflare R2 |
| Imagenes | Sharp |

## Estructura del proyecto

```
akacompos/
├── frontend/          # Aplicacion Astro (SSR)
│   ├── src/
│   │   ├── components/    # Componentes Astro y React
│   │   ├── layouts/       # Layouts
│   │   ├── lib/           # Clientes de API (Strapi)
│   │   ├── pages/         # Rutas
│   │   └── utils/         # Assets de campeones, items, traits
│   └── astro.config.mjs
│
└── backend/           # Strapi headless CMS
    ├── src/api/           # Content types (compositions)
    └── config/            # Configuracion de Strapi
```

## Requisitos

- Node.js >= 20.0.0
- pnpm >= 8.0.0

## Instalacion

```bash
# Clonar el repositorio y cambiar a la rama preview
git clone https://github.com/cferreras/akacompos.git
cd akacompos
git checkout preview

# Instalar dependencias del frontend
cd frontend
pnpm install

# Instalar dependencias del backend
cd ../backend
npm install
```

## Desarrollo

```bash
# Terminal 1 - Backend (Strapi)
cd backend
npm run develop

# Terminal 2 - Frontend (Astro)
cd frontend
pnpm dev
```

El frontend estara disponible en `http://localhost:4321` y el panel de Strapi en `http://localhost:1337/admin`.

## Ramas

| Rama | Proposito |
|------|-----------|
| `master` | Produccion. Solo muestra composiciones publicadas |
| `preview` | Pre-visualizacion. Muestra composiciones publicadas y en borrador, con marcas visuales para identificar las que aun no estan publicadas |
