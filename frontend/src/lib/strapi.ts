/// <reference types="vite/client" />

const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;
const STRAPI_PREVIEW = import.meta.env.STRAPI_PREVIEW === "true";

if (!STRAPI_URL) {
  throw new Error("STRAPI_URL environment variable is required");
}

// Función helper para hacer requests a Strapi
async function strapiRequest(
  endpoint: string,
  params: Record<string, any> = {},
) {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

  // Agregar parámetros de query
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(
      `Strapi API error: ${data.error.message || "Unknown error"}`,
    );
  }

  return data;
}

// Tipos para el esquema de Strapi
export interface StrapiSchema {
  compositions: Composition[];
}

// Interfaz para las composiciones
export interface Composition {
  id: number;
  title: string;
  slug: string;
  tier: string;
  author: string;
  cover?: string; // URL completa de la imagen
  tags?: string | string[];
  description: string;
  gameplayMode: string;
  compCode?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  board?: Board;
  coreItems?: CoreItem[];
  augments?: Augment[];
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

// Función helper para obtener URL de imagen con formato optimizado
function getImageUrl(imageData: any, preferredFormat: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string | undefined {
  if (!imageData?.url) return undefined;
  
  // Usar formato optimizado si está disponible
  const formatUrl = imageData.formats?.[preferredFormat]?.url;
  if (formatUrl) {
    return formatUrl.startsWith('http') ? formatUrl : `${STRAPI_URL}${formatUrl}`;
  }
  
  // Fallback a la imagen original
  return imageData.url.startsWith('http') ? imageData.url : `${STRAPI_URL}${imageData.url}`;
}

// Función helper para transformar datos de Strapi al formato esperado
function transformComposition(item: any, forcedStatus?: "draft" | "published"): Composition {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    tier: item.tier,
    author: item.author,
    // Usar versión medium de la imagen para optimizar carga
    cover: getImageUrl(item.cover, 'medium'),
    tags: item.tags,
    description: item.description,
    gameplayMode: item.gameplayMode,
    compCode: item.compCode,
    status: forcedStatus ?? (item.publishedAt ? "published" : "draft"),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    board: item.board,
    coreItems: item.coreItems,
    augments: item.augments,
  };
}

// Helper: Fetch published + drafts y mergear (Strapi 5 requiere dos peticiones)
async function fetchWithPreview(
  endpoint: string,
  baseParams: Record<string, any>,
): Promise<{ data: Composition[]; meta: any }> {
  // Siempre traer las publicadas
  const publishedRes = await strapiRequest(endpoint, {
    ...baseParams,
    status: "published",
  });
  const published: Composition[] = publishedRes.data.map((item: any) =>
    transformComposition(item, "published"),
  );

  if (!STRAPI_PREVIEW) {
    return { data: published, meta: publishedRes.meta };
  }

  // En modo preview, traer tambien los drafts
  const draftRes = await strapiRequest(endpoint, {
    ...baseParams,
    status: "draft",
  });
  const drafts: Composition[] = draftRes.data.map((item: any) =>
    transformComposition(item, "draft"),
  );

  // Filtrar drafts que ya tienen version publicada (mismo slug)
  const publishedSlugs = new Set(published.map((c) => c.slug));
  const uniqueDrafts = drafts.filter((d) => !publishedSlugs.has(d.slug));

  const merged = [...published, ...uniqueDrafts];

  return {
    data: merged,
    meta: {
      ...publishedRes.meta,
      pagination: {
        ...publishedRes.meta?.pagination,
        total: merged.length,
      },
    },
  };
}

// Funciones helper para obtener composiciones de Strapi
export async function getCompositions() {
  try {
    const { data } = await fetchWithPreview("compositions", {
      populate: "*",
      "sort[0]": "createdAt:desc",
    });

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching compositions:", error);

    let errorMessage = "Error desconocido";

    if (error?.message?.includes("403")) {
      errorMessage = "Sin permisos para acceder a las composiciones";
    } else if (error?.message?.includes("404")) {
      errorMessage = 'La colección "compositions" no existe en Strapi';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return { data: [], error: errorMessage };
  }
}

export async function getComposition(slug: string) {
  try {
    // En modo preview, intentar primero draft y luego published
    if (STRAPI_PREVIEW) {
      const draftRes = await strapiRequest("compositions", {
        populate: "*",
        "filters[slug][$eq]": slug,
        status: "draft",
      });

      if (draftRes.data?.[0]) {
        return {
          data: transformComposition(draftRes.data[0], "draft"),
          error: null,
        };
      }
    }

    // Buscar publicada
    const publishedRes = await strapiRequest("compositions", {
      populate: "*",
      "filters[slug][$eq]": slug,
      status: "published",
    });

    const composition = publishedRes.data?.[0]
      ? transformComposition(publishedRes.data[0], "published")
      : null;
    return { data: composition, error: null };
  } catch (error) {
    console.error(`Error fetching composition with slug ${slug}:`, error);
    return { data: null, error };
  }
}

export async function getCompositionsByTier(tier?: string) {
  try {
    const params: Record<string, any> = {
      populate: "*",
      "sort[0]": "createdAt:desc",
      "fields[0]": "id",
      "fields[1]": "title",
      "fields[2]": "slug",
      "fields[3]": "tier",
      "fields[4]": "cover",
      "fields[5]": "description",
      "fields[6]": "tags",
      "fields[7]": "author",
    };

    if (tier) {
      params["filters[tier][$eq]"] = tier;
    }

    const { data } = await fetchWithPreview("compositions", params);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching compositions by tier:", error);
    return { data: [], error };
  }
}

export async function getCompositionsCount() {
  try {
    const response = await strapiRequest("compositions", {
      "pagination[pageSize]": 1,
      status: "published",
    });

    let total = response.meta.pagination.total;

    if (STRAPI_PREVIEW) {
      const draftRes = await strapiRequest("compositions", {
        "pagination[pageSize]": 1,
        status: "draft",
      });
      total += draftRes.meta.pagination.total;
    }

    return { data: total, error: null };
  } catch (error) {
    console.error("Error fetching compositions count:", error);
    return { data: 0, error };
  }
}
