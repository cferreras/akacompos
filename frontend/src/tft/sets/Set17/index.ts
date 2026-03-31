import { createPressKitRuntime } from "../../pressKit";

const championModules = import.meta.glob(
  "../../../../../Set17/Champions/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const traitModules = import.meta.glob(
  "../../../../../Set17/Trait Icons/*/*.{png,svg}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const championNameOverrides: Record<string, string> = {
  BelVeth: "Bel'Veth",
  ChoGath: "Cho'Gath",
  KaiSa: "Kai'Sa",
  Leblanc: "LeBlanc",
  RekSai: "Rek'Sai",
};

const championAliases: Record<string, string> = {
  "Bel Veth": "Bel'Veth",
  ChoGath: "Cho'Gath",
  "Cho Gath": "Cho'Gath",
  KaiSa: "Kai'Sa",
  "Kai Sa": "Kai'Sa",
  Leblanc: "LeBlanc",
  "Le Blanc": "LeBlanc",
  MasterYi: "Master Yi",
  "Maestro Yi": "Master Yi",
  MissFortune: "Miss Fortune",
  RekSai: "Rek'Sai",
  "Rek Sai": "Rek'Sai",
  TahmKench: "Tahm Kench",
  TwistedFate: "Twisted Fate",
  Bardo: "Bard",
  Megamecha: "Summon",
};

const traitAliases: Record<string, string> = {
  Anima: "AnimaTech",
  Sentenciador: "Arbiter",
  "Estrella Oscura": "Dark Star",
  DarkStar: "Dark Star",
  Primordiano: "Primordian",
  Psionico: "PsyOps",
  Psiónico: "PsyOps",
  "Onda Espacial": "Space Groove",
  SpaceGroove: "Space Groove",
  Astral: "Stargazer",
  "Disruptor Temporal": "Timebreaker",
  Pastor: "Shepherd",
  "Bestia Fiestera": "Party Animal",
  Bastión: "Bastion",
  Luchador: "Brawler",
  Contendiente: "Challenger",
  Canalizador: "Channeler",
  Comandante: "Commander",
  "Yelmo sombrío": "Dark Lady",
  "Yelmo Sombrio": "Dark Lady",
  "Duelista divino": "Divine Duelist",
  Tejedestinos: "Fateweaver",
  Replicador: "Replicator",
  Pícaro: "Rogue",
  Picaro: "Rogue",
  Francotirador: "Sniper",
  Vanguardia: "Vanguard",
  Viajante: "Voyager",
};

const championRarity: Record<string, number> = {
  Briar: 1,
  Leona: 1,
  "Cho'Gath": 1,
  Poppy: 1,
  Aatrox: 1,
  "Rek'Sai": 1,
  Nasus: 1,
  Talon: 1,
  Ezreal: 1,
  Lissandra: 1,
  Teemo: 1,
  Caitlyn: 1,
  Veigar: 1,
  "Twisted Fate": 1,
  Jinx: 2,
  Zoe: 2,
  Mordekaiser: 2,
  Gnar: 2,
  Akali: 2,
  "Bel'Veth": 2,
  Gragas: 2,
  Gwen: 2,
  Jax: 2,
  Milio: 2,
  Pantheon: 2,
  Pyke: 2,
  Meepsie: 2,
  Aurora: 3,
  Illaoi: 3,
  Diana: 3,
  "Kai'Sa": 3,
  Urgot: 3,
  Maokai: 3,
  Viktor: 3,
  Samira: 3,
  Ornn: 3,
  Lulu: 3,
  Fizz: 3,
  Karma: 4,
  "Aurelion Sol": 4,
  Corki: 4,
  Kindred: 4,
  Nami: 4,
  Nunu: 4,
  Riven: 4,
  LeBlanc: 4,
  Blitzcrank: 5,
  Fiora: 5,
  Jhin: 5,
  Sona: 5,
  Bard: 5,
};

const traitChampionMap: Record<string, string[]> = {
  AnimaTech: ["Briar", "Jinx", "Aurora", "Illaoi", "Fiora"],
  Arbiter: ["Leona", "Zoe", "Diana", "LeBlanc"],
  "Dark Star": ["Cho'Gath", "Lissandra", "Mordekaiser", "Kai'Sa", "Karma", "Jhin"],
  Mecha: ["Urgot", "Aurelion Sol", "Summon"],
  Meeple: ["Poppy", "Veigar", "Gnar", "Meepsie", "Fizz", "Corki", "Rammus", "Bard"],
  "N.O.V.A": ["Aatrox", "Caitlyn", "Akali", "Maokai", "Kindred"],
  Primordian: ["Briar", "Rek'Sai", "Bel'Veth"],
  PsyOps: ["Gragas", "Pyke", "Viktor", "Master Yi", "Sona"],
  "Space Groove": ["Nasus", "Teemo", "Gwen", "Ornn", "Samira", "Nami", "Blitzcrank"],
  Stargazer: ["Talon", "Twisted Fate", "Jax", "Lulu", "Nunu", "Xayah"],
  Timebreaker: ["Ezreal", "Milio", "Pantheon", "Riven"],
  Shepherd: ["Lissandra", "Teemo", "Meepsie", "Illaoi", "LeBlanc", "Sona"],
  Bastion: ["Poppy", "Rammus", "Aatrox", "Ornn", "Jax"],
  Brawler: ["Cho'Gath", "Urgot", "Maokai", "Rek'Sai", "Gragas", "Pantheon"],
  Challenger: ["Jinx", "Diana", "Kindred", "Bel'Veth"],
  Channeler: ["Zoe", "Mordekaiser", "Aurelion Sol", "Viktor", "Bard"],
  Commander: ["Sona"],
  "Dark Lady": ["Fiora", "Urgot", "Akali", "Bel'Veth", "Master Yi"],
  "Divine Duelist": ["Fiora"],
  Fateweaver: ["Corki", "Caitlyn", "Twisted Fate", "Milio"],
  Replicator: ["Lissandra", "Veigar", "Nami", "Lulu", "Pantheon"],
  Rogue: ["Briar", "Kai'Sa", "Fizz", "Gwen", "Talon", "Riven"],
  Sniper: ["Jhin", "Gnar", "Samira", "Xayah", "Ezreal"],
  Vanguard: ["Illaoi", "Leona", "Mordekaiser", "Nasus", "Blitzcrank", "Nunu"],
  Voyager: ["Aurora", "Karma", "Pyke", "Meepsie"],
  "Party Animal": ["Blitzcrank"],
};

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/");
}

function getFileName(path: string): string {
  const normalizedPath = normalizePath(path);
  const fileName = normalizedPath.split("/").pop();
  return fileName || normalizedPath;
}

function getBaseName(path: string): string {
  return getFileName(path).replace(/\.[^.]+$/, "");
}

function buildChampionAssets() {
  return Object.fromEntries(
    Object.entries(championModules).map(([path, asset]) => {
      const rawName = getBaseName(path);
      const canonicalName = championNameOverrides[rawName] || rawName;
      return [canonicalName, asset];
    }),
  );
}

function getTraitFolderName(path: string): string {
  const normalizedPath = normalizePath(path);
  const parts = normalizedPath.split("/");
  return parts[parts.length - 2] || getBaseName(path);
}

function getTraitAssetPriority(path: string): number {
  const fileName = getFileName(path);
  let score = 0;

  if (fileName.includes(".TFT_Set17")) score += 100;
  if (!fileName.includes("Large")) score += 20;
  if (fileName.endsWith(".svg")) score += 10;

  return score;
}

function buildTraitAssets() {
  const traitAssets = new Map<string, { asset: string; score: number }>();

  Object.entries(traitModules).forEach(([path, asset]) => {
    const traitName = getTraitFolderName(path);
    const score = getTraitAssetPriority(path);
    const current = traitAssets.get(traitName);

    if (!current || score > current.score) {
      traitAssets.set(traitName, { asset, score });
    }
  });

  return Object.fromEntries(
    Array.from(traitAssets.entries()).map(([traitName, entry]) => [
      traitName,
      entry.asset,
    ]),
  );
}

export const set17Runtime = createPressKitRuntime({
  id: "set17",
  label: "Set 17",
  championAssets: buildChampionAssets(),
  traitAssets: buildTraitAssets(),
  championAliases,
  traitAliases,
  championRarity,
  traitChampionMap,
});
