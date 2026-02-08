# CLAUDE.md - AKACompos Project Guide

## Project Overview

AKACompos is a web platform where [AKAWonder](https://twitch.tv/akawonder), a professional TFT (Teamfight Tactics) player and content creator, publishes recommended team compositions for each patch. Players can browse compositions organized by tier (S/A/B/C), with interactive boards, core items, augments, and gameplay guides. Content is managed through a headless CMS.

- **Live site**: https://akacompos.com
- **Repository**: https://github.com/cferreras/akacompos
- **Language**: Spanish (UI and content are in Spanish)
- **Analytics**: Plausible (self-hosted at plausible.carlosferreras.com)

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Frontend      | Astro 5 with SSR (Node standalone adapter)      |
| UI Framework  | React 19 (islands) + Tailwind CSS v4            |
| CMS Backend   | Strapi 5                                        |
| Database      | SQLite (dev) / PostgreSQL (prod)                |
| Storage       | Cloudflare R2 (media uploads)                   |
| Image Optim   | Sharp                                           |
| SEO           | astro-seo                                       |
| Fonts         | Clash Display (display) + Satoshi (body) via Fontshare |
| Icons         | Material Symbols Outlined + Font Awesome 6      |
| Deployment    | Nixpacks (frontend), Strapi Cloud or self-hosted (backend) |
| Package Mgr   | pnpm (frontend), pnpm (backend)                 |

## Directory Structure

```
akacompos/
├── CLAUDE.md
├── README.md
├── .gitignore                    # Embargoed files only
│
├── frontend/                     # Astro 5 SSR application
│   ├── .env                      # Runtime env vars (STRAPI_URL, STRAPI_TOKEN, etc.)
│   ├── .gitignore                # dist/, .astro/, node_modules/, .env
│   ├── astro.config.mjs          # Astro config (SSR, React, Tailwind, Sharp)
│   ├── tsconfig.json             # Extends astro/tsconfigs/strict, jsx: react-jsx
│   ├── package.json              # Scripts & dependencies
│   ├── pnpm-lock.yaml
│   ├── nixpacks.toml             # Deployment config (Railway/Nixpacks)
│   ├── remark-modified-time.mjs  # Remark plugin for git-based last modified dates
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── robots.txt            # Allow all, sitemap at akacompos.com/sitemap.xml
│   │
│   ├── src/
│   │   ├── styles/
│   │   │   └── global.css        # Design system: dark luxe editorial, CSS vars, animations
│   │   │
│   │   ├── layouts/
│   │   │   └── Layout.astro      # Main layout (SEO, fonts, analytics, Navbar+Footer)
│   │   │
│   │   ├── lib/
│   │   │   ├── strapi.ts         # Active API client - Strapi 5 REST integration
│   │   │   └── directus.ts       # Legacy API client (Directus SDK) - NOT in use
│   │   │
│   │   ├── utils/
│   │   │   ├── assets.ts         # Champion & item image mappings (90+ champs, 40+ items)
│   │   │   ├── augments.ts       # Augment data with images (200+ augments, 3 tiers)
│   │   │   ├── traits.ts         # Trait system: origins, classes, unique traits + utilities
│   │   │   ├── tierStyles.ts     # Tier visual config (S=purple, A=yellow, B=blue, C=green)
│   │   │   └── github.ts         # GitHub API: fetch latest commit hash with 1h cache
│   │   │
│   │   ├── pages/
│   │   │   ├── index.astro                   # Homepage
│   │   │   ├── compositions/
│   │   │   │   ├── index.astro               # Compositions list page
│   │   │   │   └── [slug].astro              # Composition detail (dynamic route)
│   │   │   ├── terms.astro                   # Terms of service
│   │   │   ├── privacy.astro                 # Privacy policy
│   │   │   └── sitemap.xml.ts                # Dynamic sitemap generation
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.astro                  # Navigation bar
│   │   │   ├── Footer.astro                  # Footer
│   │   │   ├── TraitsDisplay.astro           # Trait icons/badges display
│   │   │   ├── AugmentGrid.astro             # Augments grid layout
│   │   │   ├── TFTBoardFromData.astro        # TFT hex board renderer
│   │   │   ├── TFTBoardCharacter.astro       # Individual character on board
│   │   │   ├── StarsComponent.astro          # Star rating display (1-3 stars)
│   │   │   ├── ItemWithImage.astro           # Item icon with tooltip
│   │   │   ├── compositions/
│   │   │   │   ├── CompositionList.tsx        # React island: filterable comp list by tier/tag
│   │   │   │   └── CompositionList.astro      # Astro wrapper for composition list
│   │   │   └── ui/
│   │   │       ├── index.ts                  # UI barrel exports
│   │   │       ├── Badge.astro / Badge.tsx    # Badge component (dual impl)
│   │   │       ├── Button.astro              # Button component
│   │   │       ├── Card.astro / Card.tsx      # Card component (dual impl)
│   │   │       ├── Container.astro           # Container wrapper
│   │   │       ├── Section.astro / Section.tsx # Section component (dual impl)
│   │   │       ├── Spinner.astro             # Loading spinner
│   │   │       └── Tooltip.astro             # Tooltip component
│   │   │
│   │   └── assets/
│   │       ├── akawonder.png                 # Brand/logo image
│   │       ├── astro.svg                     # Astro logo
│   │       ├── Champions/                    # ~90+ champion portrait images (.jpg)
│   │       ├── items/                        # Base items (.png)
│   │       │   └── combined/                 # Combined/completed items (.png)
│   │       ├── Traits/                       # Trait icons (.svg, .png) for Set 15 & 16
│   │       └── AugmentIcons/
│   │           ├── General/                  # General augment icons
│   │           ├── HeroAugmentIcons/         # Hero augment icons
│   │           └── TraitAugmentIcons/        # Trait augment icons
│   │
│   └── .github/instructions/
│       └── context7.instructions.md          # Auto-use Context7 for code generation
│
└── backend/                      # Strapi 5 headless CMS
    ├── .env.example              # Template with all required env vars
    ├── .env                      # Runtime env vars
    ├── .gitignore                # Comprehensive Strapi gitignore
    ├── package.json              # Strapi scripts & dependencies
    ├── pnpm-lock.yaml
    ├── tsconfig.json             # CommonJS, ES2019 target
    ├── favicon.png
    │
    ├── config/
    │   ├── admin.ts              # Admin JWT, API token salt, transfer token
    │   ├── api.ts                # REST defaults (limit 25, max 100, withCount)
    │   ├── database.ts           # Multi-DB support (SQLite/PostgreSQL/MySQL)
    │   ├── middlewares.ts        # Security CSP, CORS (CF R2 domains whitelisted)
    │   ├── plugins.ts            # Cloudflare R2 upload provider config
    │   └── server.ts             # Host/port config
    │
    ├── src/
    │   ├── index.ts              # Strapi lifecycle hooks (register/bootstrap)
    │   ├── extensions/.gitkeep
    │   └── api/
    │       └── composition/      # Single content type
    │           ├── content-types/composition/schema.json
    │           ├── controllers/composition.ts  # Default core controller
    │           ├── routes/composition.ts        # Default core router
    │           └── services/composition.ts      # Default core service
    │
    ├── database/migrations/.gitkeep
    ├── public/
    │   ├── robots.txt
    │   └── uploads/.gitkeep
    └── types/generated/          # Auto-generated Strapi types
        ├── contentTypes.d.ts
        └── components.d.ts
```

## Composition Schema (Strapi Content Type)

The single content type `composition` has these fields:

| Field        | Type        | Description                                |
| ------------ | ----------- | ------------------------------------------ |
| title        | string      | Composition name                           |
| slug         | string      | URL-friendly identifier                    |
| tier         | enumeration | "S Tier", "A Tier", "B Tier", "C Tier"     |
| author       | string      | Content author                             |
| cover        | media       | Cover image (stored in Cloudflare R2)      |
| tags         | string      | Comma-separated tags (champion/trait names) |
| description  | blocks      | Rich text description (Strapi blocks)      |
| gameplayMode | text        | Gameplay instructions                      |
| compCode     | string      | TFT composition import code                |
| board        | json        | Board layout `{ champions: Champion[] }`   |
| coreItems    | json        | Core items `{ name, description }[]`       |
| augments     | json        | Recommended augments `{ name, description, icon }[]` |

Draft & Publish is enabled. The frontend supports a preview mode to show drafts.

## Environment Variables

### Frontend (`frontend/.env`)

| Variable        | Required | Description                                    |
| --------------- | -------- | ---------------------------------------------- |
| STRAPI_URL      | Yes      | Full URL to Strapi instance                    |
| STRAPI_TOKEN    | Yes      | Strapi API bearer token                        |
| PORT            | No       | Server port (default: 3000)                    |
| STRAPI_PREVIEW  | No       | "true" to show draft compositions              |

Note: The frontend reads env vars with `process.env` first (runtime SSR), falling back to `import.meta.env` (build-time). This is intentional for deployment flexibility.

### Backend (`backend/.env`)

| Variable              | Required | Description                         |
| --------------------- | -------- | ----------------------------------- |
| HOST                  | No       | Server host (default: 0.0.0.0)     |
| PORT                  | No       | Server port (default: 1337)        |
| APP_KEYS              | Yes      | Comma-separated app keys           |
| API_TOKEN_SALT        | Yes      | Salt for API tokens                |
| ADMIN_JWT_SECRET      | Yes      | Admin panel JWT secret             |
| TRANSFER_TOKEN_SALT   | Yes      | Salt for transfer tokens           |
| JWT_SECRET            | Yes      | JWT secret                         |
| ENCRYPTION_KEY        | Yes      | Encryption key                     |
| DATABASE_CLIENT       | No       | "sqlite" (default) or "postgres"   |
| DATABASE_URL          | No       | PostgreSQL connection string       |
| CF_ACCESS_KEY_ID      | Yes      | Cloudflare R2 access key           |
| CF_ACCESS_SECRET      | Yes      | Cloudflare R2 secret key           |
| CF_ENDPOINT           | Yes      | Cloudflare R2 endpoint URL         |
| CF_BUCKET             | Yes      | Cloudflare R2 bucket name          |
| CF_PUBLIC_ACCESS_URL  | Yes      | Cloudflare R2 public CDN URL       |

## Scripts

### Frontend (`frontend/package.json`)

```bash
pnpm dev       # Start Astro dev server (localhost:4321)
pnpm build     # Build production (SSR output to dist/)
pnpm preview   # Preview production build locally
pnpm start     # Run production server: node ./dist/server/entry.mjs
pnpm astro     # Astro CLI
```

### Backend (`backend/package.json`)

```bash
pnpm dev       # Start Strapi in development mode (alias: develop)
pnpm develop   # Start Strapi in development mode
pnpm build     # Build Strapi admin panel
pnpm start     # Start Strapi in production mode
pnpm console   # Open Strapi interactive console
pnpm deploy    # Deploy Strapi
pnpm strapi    # Strapi CLI
```

## Architecture & Key Patterns

### API Client (`frontend/src/lib/strapi.ts`)

- Generic `strapiRequest()` helper for Strapi REST API calls
- Bearer token authentication via `STRAPI_TOKEN`
- `fetchWithPreview()` merges published + draft compositions (two separate API calls required by Strapi 5)
- Image URL resolution with format optimization (thumbnail/small/medium/large)
- Exported functions: `getCompositions()`, `getComposition(slug)`, `getCompositionsByTier(tier)`, `getCompositionsCount()`
- TypeScript interfaces: `Composition`, `Board`, `Champion`, `CoreItem`, `Augment`

### Asset Management (`frontend/src/utils/assets.ts`)

- Static imports of all champion portraits, item icons
- `championAssets` and `itemAssets` record mappings (name -> imported image)
- `synonymMap` handles name variations (e.g., "KogMaw" -> "Kog'Maw")
- `resolveKey()` chains: direct match -> synonym -> simplified alphanumeric match
- `championRarity` maps champion names to cost tier (1-7)
- Helper functions: `getChampionImage()`, `getItemImage()`, `getChampionImageMeta()`, `getItemImageMeta()`, `hasChampion()`, `hasItem()`

### Trait System (`frontend/src/utils/traits.ts`)

- Complete TFT Set 16 (Lore & Legends) trait database
- Three categories: origins (13 regions), classes (12), unique traits (21)
- Each trait has: id, name, type, description, tiers (count + effect), champions list, icon
- `calculateActiveTraits()` computes active traits from a champion list
- Utility functions: `getTraitByName()`, `getChampionTraits()`, `calculateTraitImpact()`, `suggestChampionsForTrait()`

### Augment System (`frontend/src/utils/augments.ts`)

- 200+ augments across 3 tiers: silver (tier1), gold (tier2), prismatic (tier3)
- Categories: general, hero, trait
- Each augment has: id, name, tier, category, description, image

### Tier Styling (`frontend/src/utils/tierStyles.ts`)

- S Tier: Purple (morado)
- A Tier: Yellow (amarillo)
- B Tier: Blue (azul)
- C Tier: Green (verde)
- Each tier has: text, bg, bgSoft, border, glow, icon, badge variant, gradient classes

### Design System (`frontend/src/styles/global.css`)

- Dark luxe editorial aesthetic with warm amber/gold accents
- CSS custom properties for colors, spacing, radius, shadows, transitions
- Custom utility classes: `.font-display`, `.text-gradient`, `.glass-panel`, `.noise-overlay`, `.hover-lift`
- Animations: fadeIn, fadeInUp, slideInLeft, scaleIn, float, shimmer, pulse-glow
- Stagger delay classes for sequential reveals
- Respects `prefers-reduced-motion`

### Rendering

- SSR mode (`output: "server"`) with `@astrojs/node` standalone adapter
- React islands for interactive components (CompositionList with client-side filtering)
- Astro components for static/server-rendered content
- Some UI components have dual implementations (.astro + .tsx)
- Image optimization via Sharp with `limitInputPixels: false`

### Build & Deployment

- Frontend deployed via Nixpacks (Railway): Node 20, pnpm, git commit hash injection
- Git commit hash available at runtime via GitHub API (`utils/github.ts`) with 1h cache
- Build-time fallback via Vite plugin `gitCommitPlugin()` in astro.config.mjs
- Dynamic sitemap generation at `/sitemap.xml`

## Game Data Context (TFT Set 16 - Lore & Legends)

This project is specifically built for TFT Set 16. All champion, trait, item, and augment data is for this set. Key numbers:

- **Champions**: ~90+ (costs 1-7)
- **Origins**: 13 (Bilgewater, Demacia, Freljord, Ionia, Ixtal, Noxus, Piltover, Shadow Isles, Shurima, Targon, Void, Yordle, Zaun)
- **Classes**: 12 (Arcanist, Bruiser, Defender, Disruptor, Gunslinger, Invoker, Juggernaut, Longshot, Quickstriker, Slayer, Vanquisher, Warden)
- **Unique Traits**: 21
- **Items**: 10 base + 40+ combined
- **Augments**: 200+ across silver/gold/prismatic tiers

## Important Notes

- The `directus.ts` file is a legacy API client from a previous CMS. The active client is `strapi.ts`.
- No ESLint or Prettier config exists in the project.
- No test framework is configured.
- No monorepo workspace config (frontend and backend have independent package managers).
- Frontend engine requirements: Node >= 20.0.0, pnpm >= 8.0.0
- Backend engine requirements: Node >= 18.0.0 <= 22.x.x
- The project is in Spanish. All UI text, comments, and content are primarily in Spanish.

## Agent Instructions

- **Never run `pnpm run dev`** - The development server is already running and the user monitors errors directly in their terminal.
