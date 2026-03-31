import { getAugment } from "../utils/augments";
import { getItemImageMeta, getItemNames } from "../utils/assets";
import type {
  ActiveTraitLike,
  MentionEntityType,
  ResolvedSetEntity,
  SetRuntime,
} from "./types";

type AssetRecord = Record<string, string>;

type TraitChampionMap = Record<string, string[]>;

export interface PressKitRuntimeConfig {
  id: string;
  label: string;
  championAssets: AssetRecord;
  traitAssets: AssetRecord;
  championAliases?: Record<string, string>;
  traitAliases?: Record<string, string>;
  championRarity?: Record<string, number>;
  championImagePositions?: Record<string, string>;
  traitChampionMap?: TraitChampionMap;
  augmentNames?: string[];
}

export function simplifySetEntityName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function uniqueResolverOrder(
  preferredType?: MentionEntityType,
): MentionEntityType[] {
  const resolverOrder = preferredType
    ? [preferredType, "champion", "item", "trait", "augment"]
    : ["champion", "item", "trait", "augment"];

  return resolverOrder.filter(
    (type, index, values) => values.indexOf(type) === index,
  ) as MentionEntityType[];
}

function buildNameIndex(
  canonicalNames: string[],
  aliases: Record<string, string>,
): Map<string, string> {
  const index = new Map<string, string>();

  canonicalNames.forEach((name) => {
    index.set(simplifySetEntityName(name), name);
  });

  Object.entries(aliases).forEach(([alias, canonicalName]) => {
    index.set(simplifySetEntityName(alias), canonicalName);
  });

  return index;
}

function resolveIndexedName(name: string, index: Map<string, string>): string {
  if (!name) return "";
  return index.get(simplifySetEntityName(name)) || name.trim();
}

function createActiveTraits(
  championNames: string[],
  resolveChampionName: (name: string) => string,
  resolveTraitName: (name: string) => string,
  traitAssets: AssetRecord,
  traitChampionMap?: TraitChampionMap,
): ActiveTraitLike[] {
  if (!traitChampionMap) return [];

  const counts = new Map<string, number>();
  const resolvedChampions = championNames.map(resolveChampionName);

  Object.entries(traitChampionMap).forEach(([traitName, traitChampions]) => {
    const resolvedTraitName = resolveTraitName(traitName);
    const resolvedMembers = new Set(traitChampions.map(resolveChampionName));
    const count = resolvedChampions.filter((champion) => resolvedMembers.has(champion)).length;

    if (count > 0) {
      counts.set(resolvedTraitName, count);
    }
  });

  return Array.from(counts.entries())
    .map(([traitName, count]) => ({
      trait: {
        id: simplifySetEntityName(traitName),
        name: traitName,
        type: "trait",
        tiers: [{ count: 1, effect: "Activo" }],
        icon: traitAssets[traitName],
      },
      count,
      activeTier: { count: 1, effect: "Activo" },
      tierIndex: 0,
    }))
    .sort((a, b) => b.count - a.count || a.trait.name.localeCompare(b.trait.name));
}

export function createPressKitRuntime(
  config: PressKitRuntimeConfig,
): SetRuntime {
  const championAliases = config.championAliases || {};
  const traitAliases = config.traitAliases || {};
  const championNames = Object.keys(config.championAssets);
  const traitNames = Object.keys(config.traitAssets);
  const itemNames = getItemNames();
  const itemIndex = buildNameIndex(itemNames, {});
  const championIndex = buildNameIndex(championNames, championAliases);
  const traitIndex = buildNameIndex(traitNames, traitAliases);
  const championImagePositions = config.championImagePositions || {};
  const championRarity = config.championRarity || {};
  const augmentNames = config.augmentNames || [];

  const resolveChampionName = (name: string) => resolveIndexedName(name, championIndex);
  const resolveTraitName = (name: string) => resolveIndexedName(name, traitIndex);
  const resolveItemName = (name: string) => resolveIndexedName(name, itemIndex);

  function getTrait(name: string) {
    const resolvedName = resolveTraitName(name);
    const icon = config.traitAssets[resolvedName];
    if (!icon) return undefined;

    return {
      name: resolvedName,
      icon,
    };
  }

  function resolveEntity(
    name: string,
    preferredType?: MentionEntityType,
  ): ResolvedSetEntity | undefined {
    const resolverOrder = uniqueResolverOrder(preferredType);

    for (const type of resolverOrder) {
      if (type === "champion") {
        const resolvedName = resolveChampionName(name);
        const icon = config.championAssets[resolvedName];
        if (icon) {
          return { type, name: resolvedName, icon };
        }
      }

      if (type === "item") {
        const resolvedName = resolveItemName(name);
        const icon = getItemImageMeta(resolvedName);
        if (icon) {
          return { type, name: resolvedName, icon };
        }
      }

      if (type === "trait") {
        const trait = getTrait(name);
        if (trait) {
          return {
            type,
            name: trait.name,
            icon: trait.icon,
          };
        }
      }

      if (type === "augment") {
        const augment = getAugment(name);
        if (augment) {
          return {
            type,
            name: augment.name,
            icon: augment.image,
            description: augment.description,
          };
        }
      }
    }

    return undefined;
  }

  return {
    id: config.id,
    label: config.label,
    championNames,
    itemNames,
    traitNames,
    augmentNames,
    resolveChampionName,
    getChampionAsset: (name) => config.championAssets[resolveChampionName(name)],
    getChampionThumb: (name) => config.championAssets[resolveChampionName(name)],
    getChampionRarity: (name) => championRarity[resolveChampionName(name)],
    getChampionImagePosition: (name) => championImagePositions[resolveChampionName(name)] || championImagePositions.Default,
    resolveItemName,
    getItemAsset: (name) => getItemImageMeta(resolveItemName(name)),
    getTrait,
    calculateActiveTraits: (names) =>
      createActiveTraits(
        names,
        resolveChampionName,
        resolveTraitName,
        config.traitAssets,
        config.traitChampionMap,
      ),
    getAugment,
    resolveEntity,
  };
}
