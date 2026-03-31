import { getAugment, tier1Augments, tier2Augments, tier3Augments } from "../../../utils/augments";
import {
  championImagePositions,
  championRarity,
  getChampionImageMeta,
  getChampionNames,
  getItemImageMeta,
  getItemNames,
  resolveChampionName,
} from "../../../utils/assets";
import { getChampionThumb } from "../../../utils/champion-thumbs";
import {
  allTraits,
  calculateActiveTraits,
  getTraitByName,
} from "../../../utils/traits";
import type { MentionEntityType, ResolvedSetEntity, SetRuntime } from "../../types";

function simplifyName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveSet16ItemName(name: string): string {
  const normalizedName = name.trim();
  const itemNames = getItemNames();

  if (itemNames.includes(normalizedName)) {
    return normalizedName;
  }

  const simplified = simplifyName(normalizedName);
  const match = itemNames.find((itemName) => simplifyName(itemName) === simplified);
  return match || normalizedName;
}

function resolveSet16Entity(
  name: string,
  preferredType?: MentionEntityType,
): ResolvedSetEntity | undefined {
  const resolverOrder: MentionEntityType[] = preferredType
    ? ([preferredType, "champion", "item", "trait", "augment"].filter(
        (type, index, values) => values.indexOf(type) === index,
      ) as MentionEntityType[])
    : ["champion", "item", "trait", "augment"];

  for (const type of resolverOrder) {
    if (type === "champion") {
      const resolvedName = resolveChampionName(name);
      const icon = getChampionThumb(resolvedName) || getChampionImageMeta(resolvedName);
      if (icon) {
        return { type, name: resolvedName, icon };
      }
    }

    if (type === "item") {
      const resolvedName = resolveSet16ItemName(name);
      const icon = getItemImageMeta(resolvedName);
      if (icon) {
        return { type, name: resolvedName, icon };
      }
    }

    if (type === "trait") {
      const trait = getTraitByName(name);
      if (trait) {
        return {
          type,
          name: trait.name,
          icon: trait.icon,
          description: trait.description,
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

export const set16Runtime: SetRuntime = {
  id: "set16",
  label: "Set 16",
  championNames: getChampionNames(),
  itemNames: getItemNames(),
  traitNames: allTraits.map((trait) => trait.name),
  augmentNames: [...tier1Augments, ...tier2Augments, ...tier3Augments].map(
    (augment) => augment.name,
  ),
  resolveChampionName,
  getChampionAsset: getChampionImageMeta,
  getChampionThumb,
  getChampionRarity: (name) => championRarity[resolveChampionName(name)],
  getChampionImagePosition: (name) =>
    championImagePositions[resolveChampionName(name)] || championImagePositions.Default,
  resolveItemName: resolveSet16ItemName,
  getItemAsset: getItemImageMeta,
  getTrait: getTraitByName,
  calculateActiveTraits,
  getAugment,
  resolveEntity: resolveSet16Entity,
};

