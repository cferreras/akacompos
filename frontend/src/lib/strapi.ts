/// <reference types="vite/client" />
import { normalizeCompositionSet } from "../utils/compositionPaths";
import { getRichTextPlainText } from "../tft/richText";
import { getSetRuntime } from "../tft/sets/registry";
import type {
  CompositionBoard,
  CompositionPriority,
  CompositionStagePlan,
  NormalizedComposition,
  RichTextContent,
} from "../tft/types";

const STRAPI_URL = process.env.STRAPI_URL || import.meta.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || import.meta.env.STRAPI_TOKEN;
const STRAPI_PREVIEW =
  (process.env.STRAPI_PREVIEW || import.meta.env.STRAPI_PREVIEW) === "true";

if (!STRAPI_URL) {
  throw new Error("STRAPI_URL environment variable is required");
}

const SYSTEM_FIELDS = new Set([
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "locale",
  "localizations",
]);

async function strapiRequest(
  endpoint: string,
  params: Record<string, unknown> = {},
) {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Strapi API error: ${data.error.message || "Unknown error"}`);
  }

  return data;
}

async function safeStrapiRequest(
  endpoint: string,
  params: Record<string, unknown> = {},
) {
  try {
    return await strapiRequest(endpoint, params);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("404")) {
      return {
        data: [],
        meta: { pagination: { total: 0 } },
      };
    }
    throw error;
  }
}

function getImageUrl(
  imageData: any,
  preferredFormat: "thumbnail" | "small" | "medium" | "large" = "medium",
): string | undefined {
  if (!imageData?.url) return undefined;

  const formatUrl = imageData.formats?.[preferredFormat]?.url;
  if (formatUrl) {
    return formatUrl.startsWith("http") ? formatUrl : `${STRAPI_URL}${formatUrl}`;
  }

  return imageData.url.startsWith("http") ? imageData.url : `${STRAPI_URL}${imageData.url}`;
}

function parseLooseJson<T>(value: unknown): T | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return value as T;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function ensureBoard(value: unknown): CompositionBoard | null {
  const parsed = parseLooseJson<CompositionBoard>(value);
  if (!parsed || !Array.isArray(parsed.champions)) return null;
  return parsed;
}

function normalizeDevelopment(value: unknown): CompositionStagePlan[] {
  const parsed = parseLooseJson<any>(value);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const phase = typeof entry.phase === "string" ? entry.phase : typeof entry.fase === "string" ? entry.fase : "";
      const title = typeof entry.title === "string" ? entry.title : undefined;
      const text = (entry.text ?? entry.descripcion ?? entry.description) as RichTextContent;
      if (!phase || !text) return null;
      return { phase, title, text } satisfies CompositionStagePlan;
    })
    .filter((entry): entry is CompositionStagePlan => Boolean(entry));
}

function normalizePriorities(value: unknown): CompositionPriority[] {
  const parsed = parseLooseJson<any>(value);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => {
      if (typeof entry === "string") {
        return { name: entry } satisfies CompositionPriority;
      }
      if (!entry || typeof entry !== "object" || typeof entry.name !== "string") {
        return null;
      }
      return {
        name: entry.name,
        type: typeof entry.type === "string" ? entry.type : undefined,
        description:
          typeof entry.description === "string" ? entry.description : undefined,
        icon: typeof entry.icon === "string" ? entry.icon : undefined,
      } satisfies CompositionPriority;
    })
    .filter((entry): entry is CompositionPriority => Boolean(entry));
}

function normalizeItemNameForSet(value: string, set: string): string {
  const raw = value.trim();
  if (!raw) return "";

  const runtime = getSetRuntime(set);
  const resolved = runtime.resolveItemName(raw);
  return runtime.getItemAsset(resolved) ? resolved : raw;
}

function normalizeBoardForSet(board: CompositionBoard | null, set: string): CompositionBoard | null {
  if (!board) return null;

  return {
    champions: board.champions.map((champion) => ({
      ...champion,
      items: Array.isArray(champion.items)
        ? champion.items
            .map((item) => normalizeItemNameForSet(item, set))
            .filter(Boolean)
            .slice(0, 3)
        : [],
    })),
  };
}

function normalizePrioritiesForSet(
  priorities: CompositionPriority[],
  set: string,
): CompositionPriority[] {
  return priorities.map((priority) => (
    priority.type === "item"
      ? { ...priority, name: normalizeItemNameForSet(priority.name, set) }
      : priority
  ));
}

function getExcerpt(...values: RichTextContent[]): string | undefined {
  for (const value of values) {
    const plainText = getRichTextPlainText(value).replace(/\s+/g, " ").trim();
    if (plainText) {
      return plainText.slice(0, 180);
    }
  }
  return undefined;
}

function dedupeCompositions(compositions: NormalizedComposition[]) {
  const deduped = new Map<string, NormalizedComposition>();

  for (const composition of compositions) {
    const key = `${composition.set}:${composition.slug}`;
    const current = deduped.get(key);
    if (!current) {
      deduped.set(key, composition);
      continue;
    }

    if (current.status === "published" && composition.status === "draft") {
      continue;
    }

    deduped.set(key, composition);
  }

  return Array.from(deduped.values()).sort((a, b) => {
    const aDate = new Date(a.date || a.updatedAt || a.createdAt || 0).getTime();
    const bDate = new Date(b.date || b.updatedAt || b.createdAt || 0).getTime();
    return bDate - aDate;
  });
}

function extractJsonPayload(item: Record<string, unknown>) {
  const explicitKeys = [
    "json",
    "data",
    "payload",
    "content",
    "contenido",
    "composicion",
    "composición",
  ];

  for (const key of explicitKeys) {
    if (key in item) {
      const parsed = parseLooseJson<Record<string, unknown>>(item[key]);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  }

  const customEntries = Object.entries(item).filter(([key]) => !SYSTEM_FIELDS.has(key));
  if (customEntries.length === 1) {
    return parseLooseJson<Record<string, unknown>>(customEntries[0][1]) || {};
  }

  const firstObjectEntry = customEntries.find(([, value]) => {
    const parsed = parseLooseJson<Record<string, unknown>>(value);
    return Boolean(parsed && typeof parsed === "object");
  });

  if (firstObjectEntry) {
    return parseLooseJson<Record<string, unknown>>(firstObjectEntry[1]) || {};
  }

  return {};
}

function normalizeLegacyComposition(
  item: Record<string, any>,
  forcedStatus?: "draft" | "published",
): NormalizedComposition {
  const status = forcedStatus ?? (item.publishedAt ? "published" : "draft");
  const set = normalizeCompositionSet(item.set ?? item.Set ?? "set16") ?? "set16";

  return {
    id: item.id,
    sourceCollection: "compositions",
    sourceFormat: "legacy",
    title: item.title,
    slug: item.slug,
    set,
    tier: item.tier,
    author: item.author,
    cover: getImageUrl(item.cover, "medium"),
    date: item.date,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    status,
    isDraft: status === "draft",
    tags: normalizeStringArray(item.tags),
    excerpt: getExcerpt(item.description, item.gameplayMode),
    compCode: item.compCode,
    board: ensureBoard(item.board),
    tips: item.description,
    development: [],
    priorities: [],
    legacy: {
      description: item.description,
      gameplayMode: item.gameplayMode,
      coreItems: parseLooseJson(item.coreItems) || [],
      augments: parseLooseJson(item.augments) || [],
    },
  };
}

function normalizeJsonComposition(
  item: Record<string, any>,
  forcedStatus?: "draft" | "published",
): NormalizedComposition | null {
  const payload = extractJsonPayload(item);
  const normalizedSet = normalizeCompositionSet(
    typeof payload.set === "string" ? payload.set : typeof item.set === "string" ? item.set : null,
  );
  if (!normalizedSet) {
    return null;
  }
  const payloadIsDraft = payload.isDraft === true || payload.isDraft === "true";
  const computedStatus =
    payloadIsDraft
      ? "draft"
      : forcedStatus ?? (!item.publishedAt ? "draft" : "published");

  const board = normalizeBoardForSet(ensureBoard(payload.board ?? payload.tablero ?? payload.composicion), normalizedSet);
  const tips = (payload.consejos ?? payload.consejosYTrucos ?? payload.tips) as RichTextContent;
  const development = normalizeDevelopment(payload.desarrollo ?? payload.development);
  const priorities = normalizePrioritiesForSet(
    normalizePriorities(payload.prioridades ?? payload.winConditions ?? payload.priorities),
    normalizedSet,
  );
  const tags = normalizeStringArray(payload.tags);
  const title = typeof payload.title === "string" ? payload.title : typeof payload.titulo === "string" ? payload.titulo : "";
  const slug = typeof payload.slug === "string" ? payload.slug : "";

  if (!title || !slug) {
    return null;
  }

  return {
    id: item.id,
    sourceCollection: "composiciones",
    sourceFormat: "json",
    title,
    slug,
    set: normalizedSet,
    tier:
      typeof payload.tier === "string"
        ? payload.tier
        : typeof payload.rango === "string"
          ? payload.rango
          : "B Tier",
    author:
      typeof payload.author === "string"
        ? payload.author
        : typeof payload.autor === "string"
          ? payload.autor
          : "AKACompos",
    cover: typeof payload.cover === "string" ? payload.cover : undefined,
    date: typeof payload.date === "string" ? payload.date : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    status: computedStatus,
    isDraft: computedStatus === "draft",
    tags,
    excerpt: getExcerpt(tips, ...development.map((entry) => entry.text)),
    compCode:
      typeof payload.compCode === "string"
        ? payload.compCode
        : typeof payload.compcode === "string"
          ? payload.compcode
          : undefined,
    board,
    tips,
    development,
    priorities,
  };
}

async function fetchLegacyCompositions(set?: string) {
  const params: Record<string, unknown> = {
    populate: "*",
    "sort[0]": "createdAt:desc",
    "pagination[pageSize]": 100,
  };

  if (set === "set16") {
    params["filters[Set][$eq]"] = "set16";
  }

  const publishedResponse = await safeStrapiRequest("compositions", {
    ...params,
    status: "published",
  });
  const published = (publishedResponse.data || [])
    .map((item: Record<string, any>) => normalizeLegacyComposition(item, "published"))
    .filter((composition: NormalizedComposition) => !set || composition.set === set);

  if (!STRAPI_PREVIEW) {
    return published;
  }

  const draftResponse = await safeStrapiRequest("compositions", {
    ...params,
    status: "draft",
  });
  const drafts = (draftResponse.data || [])
    .map((item: Record<string, any>) => normalizeLegacyComposition(item, "draft"))
    .filter((composition: NormalizedComposition) => !set || composition.set === set);

  return [...published, ...drafts];
}

async function fetchJsonCompositions(set?: string) {
  const params: Record<string, unknown> = {
    populate: "*",
    "sort[0]": "createdAt:desc",
    "pagination[pageSize]": 100,
  };

  const publishedResponse = await fetchJsonCollectionRequest({
    ...params,
    status: "published",
  });
  const published = (publishedResponse.data || [])
    .map((item: Record<string, any>) => normalizeJsonComposition(item, "published"))
    .filter((composition: NormalizedComposition | null): composition is NormalizedComposition => Boolean(composition))
    .filter((composition) => STRAPI_PREVIEW || !composition.isDraft)
    .filter((composition) => !set || composition.set === set);

  if (!STRAPI_PREVIEW) {
    return published;
  }

  const draftResponse = await fetchJsonCollectionRequest({
    ...params,
    status: "draft",
  });
  const drafts = (draftResponse.data || [])
    .map((item: Record<string, any>) => normalizeJsonComposition(item, "draft"))
    .filter((composition: NormalizedComposition | null): composition is NormalizedComposition => Boolean(composition))
    .filter((composition) => !set || composition.set === set);

  return [...published, ...drafts];
}

async function fetchJsonCollectionRequest(
  params: Record<string, unknown>,
) {
  try {
    return await strapiRequest("composiciones", params);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("404")) {
      throw error;
    }

    return await safeStrapiRequest("composicion", params);
  }
}
function shouldReadLegacyCollection(set?: string | null) {
  return !set || set === "set16";
}

function shouldReadJsonCollection(set?: string | null) {
  return !set || set !== "set16";
}

export async function getCompositions(set?: string) {
  try {
    const normalizedSet = normalizeCompositionSet(set);
    const compositions = [
      ...(shouldReadLegacyCollection(normalizedSet)
        ? await fetchLegacyCompositions(normalizedSet || undefined)
        : []),
      ...(shouldReadJsonCollection(normalizedSet)
        ? await fetchJsonCompositions(normalizedSet || undefined)
        : []),
    ];

    return { data: dedupeCompositions(compositions), error: null };
  } catch (error: any) {
    console.error("Error fetching compositions:", error);

    let errorMessage = "Error desconocido";
    if (error?.message?.includes("403")) {
      errorMessage = "Sin permisos para acceder a las composiciones";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return { data: [] as NormalizedComposition[], error: errorMessage };
  }
}

export async function getComposition(slug: string, set?: string) {
  const { data, error } = await getCompositions(set);
  if (error) {
    return { data: null, error };
  }

  const normalizedSet = normalizeCompositionSet(set);
  const composition = data.find(
    (entry) => entry.slug === slug && (!normalizedSet || entry.set === normalizedSet),
  ) || null;

  return { data: composition, error: null };
}

export async function getCompositionsByTier(tier?: string) {
  const { data, error } = await getCompositions();
  if (error) {
    return { data: [] as NormalizedComposition[], error };
  }

  return {
    data: tier ? data.filter((composition) => composition.tier === tier) : data,
    error: null,
  };
}

export async function getCompositionsCount() {
  const { data, error } = await getCompositions();
  if (error) {
    return { data: 0, error };
  }

  return { data: data.length, error: null };
}

export type Composition = NormalizedComposition;
export type Board = CompositionBoard;





