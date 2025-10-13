/// <reference types="vite/client" />
import { createDirectus, readItems, readItem, rest, authentication, staticToken } from "@directus/sdk";

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL) {
  throw new Error("DIRECTUS_URL environment variable is required");
}

// Cliente con autenticación por token si está disponible
const client = createDirectus(DIRECTUS_URL)
  .with(rest());

// Si hay token, añadir autenticación
if (DIRECTUS_TOKEN) {
  client.with(staticToken(DIRECTUS_TOKEN));
}

export default client;

// Tipos para el esquema de Directus
export interface DirectusSchema {
  compositions: Composition[];
  // Agrega más colecciones según sea necesario
}

// Interfaz para las composiciones
export interface Composition {
  id: string;
  title: string;
  slug: string;
  tier: string;
  author: string;
  image?: string;
  tags?: string; // Por ahora como string simple
  description: string;
  gameplayMode: string;
  status: 'draft' | 'published';
  date_created: string;
  date_updated: string;
  board?: Board; // Campo JSON para el tablero
  coreItems?: CoreItem[]; // Campo JSON para items principales
  augments?: Augment[]; // Campo JSON para augmentos
}

export interface Board {
  champions: Champion[];
}

export interface Champion {
  name: string;
  position: {
    row: number;
    col: number;
  };
  items?: string[];
  stars?: number;
}

export interface CoreItem {
  name: string;
  description: string;
}

export interface Augment {
  name: string;
  description: string;
  icon: string;
}

export interface CoreItem {
  id?: string;
  name: string;
  description: string;
}

export interface Augment {
  id?: string;
  name: string;
  description: string;
  icon: string;
}

export interface Board {
  champions: Champion[];
}

export interface Champion {
  id?: string;
  name: string;
  position: {
    row: number;
    col: number;
  };
  items?: string[];
  stars?: number;
}

// Funciones helper para obtener composiciones de Directus
export async function getCompositions() {
  try {
    const compositions = await client.request(
      readItems('compositions', {
        filter: {
          status: { _eq: 'published' }
        },
        sort: ['-date_created'],
        limit: -1
        // Sin relaciones anidadas por ahora, solo campos básicos
      })
    );
    return { data: compositions, error: null };
  } catch (error: any) {
    console.error('Error fetching compositions:', error);
    
    // Proporcionar información más específica sobre el error
    let errorMessage = 'Error desconocido';
    
    if (error?.response?.status === 403) {
      errorMessage = 'Sin permisos para acceder a las composiciones';
    } else if (error?.response?.status === 404) {
      errorMessage = 'La colección "compositions" no existe en Directus';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return { data: [], error: errorMessage };
  }
}

export async function getComposition(slug: string) {
  try {
    const compositions = await client.request(
      readItems('compositions', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1,
        // Incluir relaciones anidadas
        deep: {
          coreItems: {
            _limit: -1
          },
          augments: {
            _limit: -1
          },
          board: {
            champions: {
              _limit: -1
            }
          }
        }
      })
    );
    
    const composition = compositions?.[0] || null;
    return { data: composition, error: null };
  } catch (error) {
    console.error(`Error fetching composition with slug ${slug}:`, error);
    return { data: null, error };
  }
}

export async function getCompositionsByTier(tier?: string) {
  try {
    const filter: any = {
      status: { _eq: 'published' }
    };
    
    if (tier) {
      filter.tier = { _eq: tier };
    }

    const compositions = await client.request(
      readItems('compositions', {
        filter,
        sort: ['-date_created'],
        limit: -1,
        fields: ['id', 'title', 'slug', 'tier', 'image', 'description', 'tags', 'author']
      })
    );
    return { data: compositions, error: null };
  } catch (error) {
    console.error('Error fetching compositions by tier:', error);
    return { data: [], error };
  }
}