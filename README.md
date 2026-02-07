# AKACompos

Plataforma web donde [AKAWonder](https://twitch.tv/akawonder), jugador profesional y creador de contenido de Teamfight Tactics (TFT), publica sus composiciones recomendadas para cada parche.

## Sobre el proyecto

AKACompos permite a los jugadores de TFT consultar composiciones actualizadas organizadas por tier (S, A, B, C), con tableros interactivos, items core, aumentos y guías de juego. Todo el contenido es gestionado por AKAWonder a través de un CMS headless.

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
# Clonar el repositorio
git clone https://github.com/cferreras/akacompos.git
cd akacompos

# Instalar dependencias del frontend
cd frontend
pnpm install

# Instalar dependencias del backend
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

## Ramas

| Rama | Proposito |
|------|-----------|
| `master` | Produccion. Solo muestra composiciones publicadas |
| `preview` | Pre-visualizacion. Muestra composiciones publicadas y en borrador, con marcas visuales para identificar las que aun no estan publicadas |
