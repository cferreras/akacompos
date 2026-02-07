# AKACompos

Plataforma web donde [AKAWonder](https://twitch.tv/akawonder), jugador profesional y creador de contenido de Teamfight Tactics (TFT), publica sus composiciones recomendadas para cada parche.

## Sobre el proyecto

AKACompos permite a los jugadores de TFT consultar composiciones actualizadas organizadas por tier (S, A, B, C), con tableros interactivos, items core, aumentos y guias de juego. Todo el contenido es gestionado por AKAWonder a traves de un CMS headless.

## Modo Preview

El proyecto incluye un modo preview que permite ver las composiciones en borrador junto a las publicadas. Las composiciones en draft se muestran con indicadores visuales:

- **Lista de composiciones**: badge ambar "PREVIEW" en la esquina superior derecha de la tarjeta.
- **Pagina de detalle**: banner superior indicando que la composicion no esta publicada.

Para activarlo, establece `STRAPI_PREVIEW=true` en `frontend/.env`. Sin esta variable (o con valor `false`), solo se muestran las composiciones publicadas.

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
git clone https://github.com/cferreras/akacompos.git
cd akacompos

# Frontend
cd frontend
pnpm install

# Backend
cd ../backend
npm install
```

## Configuracion

### Frontend

Crea un archivo `frontend/.env`:

```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=tu_api_token_de_strapi
PORT=3000

# Activar para ver composiciones en borrador (opcional)
# STRAPI_PREVIEW=true
```

### Backend

Copia el archivo de ejemplo y configura las variables:

```bash
cp backend/.env.example backend/.env
```

Las variables incluyen claves de Strapi, configuracion de base de datos y credenciales de Cloudflare R2 para almacenamiento de assets.

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

## Build de produccion

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
pnpm build
pnpm start
```
