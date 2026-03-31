export type CompositionStatus = "draft" | "published";

export type RichTextBlock = {
  children?: Array<{ text?: string }>;
  [key: string]: unknown;
};

export type RichTextContent = string | RichTextBlock[] | null | undefined;

export type PriorityType =
  | "item"
  | "augment"
  | "trait"
  | "champion"
  | "custom";

export type MentionEntityType = Exclude<PriorityType, "custom">;

export interface CompositionChampion {
  name: string;
  position: {
    row: number;
    col: number;
  };
  items?: string[];
  stars?: number;
}

export interface CompositionBoard {
  champions: CompositionChampion[];
}

export interface LegacyCoreItem {
  name: string;
  description?: string;
}

export interface LegacyAugmentReference {
  name: string;
  description?: string;
  icon?: string;
}

export interface CompositionStagePlan {
  phase: string;
  title?: string;
  text: RichTextContent;
}

export interface CompositionPriority {
  name: string;
  type?: PriorityType;
  description?: string;
  icon?: string;
}

export interface NormalizedComposition {
  id: number | string;
  sourceCollection: "compositions" | "composiciones";
  sourceFormat: "legacy" | "json";
  title: string;
  slug: string;
  set: string;
  tier: string;
  author: string;
  cover?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  status: CompositionStatus;
  isDraft: boolean;
  tags: string[];
  excerpt?: string;
  compCode?: string;
  board?: CompositionBoard | null;
  tips?: RichTextContent;
  development: CompositionStagePlan[];
  priorities: CompositionPriority[];
  legacy?: {
    description?: RichTextContent;
    gameplayMode?: RichTextContent;
    coreItems?: LegacyCoreItem[];
    augments?: LegacyAugmentReference[];
  };
}

export interface ResolvedSetEntity {
  type: MentionEntityType;
  name: string;
  icon?: unknown;
  description?: string;
}

export interface ActiveTraitLike {
  trait: {
    id: string;
    name: string;
    type: string;
    tiers: Array<{ count: number; effect: string }>;
    icon?: unknown;
  };
  count: number;
  activeTier: { count: number; effect: string } | null;
  tierIndex: number;
}

export interface SetRuntime {
  id: string;
  label: string;
  championNames: string[];
  itemNames: string[];
  traitNames: string[];
  augmentNames: string[];
  resolveChampionName(name: string): string;
  getChampionAsset(name: string): unknown;
  getChampionThumb(name: string): unknown;
  getChampionRarity(name: string): number | undefined;
  getChampionImagePosition(name: string): string | undefined;
  resolveItemName(name: string): string;
  getItemAsset(name: string): unknown;
  getTrait(name: string): { name: string; icon?: unknown } | undefined;
  calculateActiveTraits(championNames: string[]): ActiveTraitLike[];
  getAugment(name: string): { name: string; description?: string; image?: unknown } | undefined;
  resolveEntity(
    name: string,
    preferredType?: MentionEntityType,
  ): ResolvedSetEntity | undefined;
}
