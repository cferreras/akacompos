// ============================================================================
// TRAITS DATA - Origins and Classes from TFT Set 15
// ============================================================================
// Data scraped from https://tactics.tools/info/traits

// ============================================================================
// TRAIT ICONS IMPORTS
// ============================================================================
import battleAcademiaIcon from "../assets/Traits/Trait_Icon_15_Battle Academia.svg";
import crystalGambitIcon from "../assets/Traits/Trait_Icon_15_Crystal Gambit.svg";
import luchadorIcon from "../assets/Traits/Trait_Icon_15_Luchador.svg";
import mentorIcon from "../assets/Traits/Trait_Icon_15_Mentor.svg";
import mightyMechIcon from "../assets/Traits/Trait_Icon_15_Mighty Mech.svg";
import monsterTrainerIcon from "../assets/Traits/Trait_Icon_15_MonsterTrainer.svg";
import rogueCaptainIcon from "../assets/Traits/Trait_Icon_15_RogueCaptain.svg";
import rosemotherIcon from "../assets/Traits/Trait_Icon_15_Rosemother.svg";
import soulFighterIcon from "../assets/Traits/Trait_Icon_15_SoulFighter.svg";
import stanceMasterIcon from "../assets/Traits/Trait_Icon_15_Stance Master.svg";
import starGuardianIcon from "../assets/Traits/Trait_Icon_15_StarGuardian.svg";
import supremeCellsIcon from "../assets/Traits/Trait_Icon_15_SupremeCells.svg";
import theChampIcon from "../assets/Traits/Trait_Icon_15_The Champ.svg";
import theCrewIcon from "../assets/Traits/Trait_Icon_15_StarCrew.svg";
import wraithIcon from "../assets/Traits/Trait_Icon_15_Wraith.svg";

import bastionIcon from "../assets/Traits/Trait_Icon_15_Bastion.svg";
import duelistIcon from "../assets/Traits/Trait_Icon_15_Duelist.svg";
import edgelordIcon from "../assets/Traits/Trait_Icon_15_Edgelord.svg";
import executionerIcon from "../assets/Traits/Trait_Icon_15_Executioner.svg";
import heavyweightIcon from "../assets/Traits/Trait_Icon_15_Heavyweight.svg";
import juggernautIcon from "../assets/Traits/Trait_Icon_15_Juggernaut.svg";
import prodigyIcon from "../assets/Traits/Trait_Icon_15_Prodigy.svg";
import protectorIcon from "../assets/Traits/Trait_Icon_15_Protector.svg";
import sniperIcon from "../assets/Traits/Trait_Icon_15_Sniper.svg";
import sorcererIcon from "../assets/Traits/Trait_Icon_15_Sorcerer.svg";
import strategistIcon from "../assets/Traits/Trait_Icon_15_Amp.svg";

export type TraitType = "origin" | "class";

export interface TraitTier {
  count: number;
  effect: string;
}

export interface Trait {
  id: string;
  name: string;
  type: TraitType;
  description: string;
  tiers: TraitTier[];
  champions: string[];
  icon: ImageMetadata;
}

// ============================================================================
// ORIGINS
// ============================================================================

export const origins: Trait[] = [
  {
    id: "battleacademia",
    name: "Battle Academia",
    type: "origin",
    description: "Battle Academia champions upgrade their abilities and gain Potential. Potential improves their abilities. Prismatic: Earn 1 point for every Completed item a champions uses in combat. Graduate at 160 points.",
    tiers: [
      { count: 3, effect: "3 Potential" },
      { count: 5, effect: "5 Potential" },
      { count: 7, effect: "7 Potential + True Potential Unlocked: +10 Potential" },
    ],
    champions: ["Ezreal", "Garen", "Katarina", "Rakan", "Caitlyn", "Jayce", "Leona", "Yuumi"],
    icon: battleAcademiaIcon,
  },
  {
    id: "crystalgambit",
    name: "Crystal Gambit",
    type: "origin",
    description: "Kills and losses during player combats earn Gem Power. Every 3 player combats choose to convert Gem Power into rewards or Double Down. While Double Down is active losses grant 100% more Gem Power, but wins lose 50% Gem Power and cash out immediately.",
    tiers: [
      { count: 3, effect: "Earn Gem Power per kill and loss" },
      { count: 5, effect: "Every X kills, gain bonus loot and reroll" },
      { count: 7, effect: "130% rewards. Crystal Gambit units gain 300 Health and 15% Damage Amplification" },
    ],
    champions: ["Syndra", "Janna", "Vi", "Swain", "Ashe", "Zyra"],
    icon: crystalGambitIcon,
  },
  {
    id: "luchador",
    name: "Luchador",
    type: "origin",
    description: "Luchadors gain bonus Attack Damage. At 50% health, Luchadors cleanse negative effects, heal, and leap back into the fight, Stunning enemies in a 1-hex radius for 1 seconds.",
    tiers: [
      { count: 2, effect: "15% Attack Damage; 25% Health heal" },
      { count: 4, effect: "40% Attack Damage; 50% Health heal" },
    ],
    champions: ["Gnar", "Dr. Mundo", "Volibear", "Braum"],
    icon: luchadorIcon,
  },
  {
    id: "mentor",
    name: "Mentor",
    type: "origin",
    description: "This trait is active only when you have exactly 1 or 4 unique Mentors.",
    tiers: [
      { count: 1, effect: "Allies gain the bonus" },
      { count: 4, effect: "Mentors gain all bonuses and upgrade their abilities. Kobuko: 6% Damage Reduction, Udyr: 8% Attack Damage and Ability Power, Yasuo: 10% Attack Speed, Ryze: Attacks grant 2 bonus Mana" },
    ],
    champions: ["Kobuko", "Udyr", "Yasuo", "Ryze"],
    icon: mentorIcon,
  },
  {
    id: "mightymech",
    name: "Mighty Mech",
    type: "origin",
    description: "Gain The Mighty Mech. Mighty Mechs heal it for 12% of the damage they deal. Each Mighty Mech champion's star level increases The Mighty Mech's power.",
    tiers: [
      { count: 3, effect: "The Mighty Mech arrives" },
      { count: 5, effect: "Blade Protocol: Level 1" },
      { count: 7, effect: "Blade Protocol: Level 2" },
    ],
    champions: ["Aatrox", "Lucian", "Gangplank", "Senna", "JarvanIV", "Karma", "Yone"],
    icon: mightyMechIcon,
  },
  {
    id: "monstertrainer",
    name: "Monster Trainer",
    type: "origin",
    description: "Choose which monster Lulu summons to replace her in combat!",
    tiers: [
      { count: 1, effect: "Summon a monster" },
    ],
    champions: ["Lulu"],
    icon: monsterTrainerIcon,
  },
  {
    id: "roguecaptain",
    name: "Rogue Captain",
    type: "origin",
    description: "Twisted Fate upgrades the Crew Ship to deal 15% of it's damage as true damage and draws Bounty Cards each round that grant random rewards.",
    tiers: [
      { count: 1, effect: "Upgrade Crew Ship" },
    ],
    champions: ["Twisted Fate"],
    icon: rogueCaptainIcon,
  },
  {
    id: "rosemother",
    name: "Rosemother",
    type: "origin",
    description: "Gain 1/1/8 placeable plants, based on Zyra's star level. Plants in the front two rows grow into durable Grasping Roots, while plants in the back two rows grow into Deadly Spines. When Zyra casts, her plant restores 35% Health and gains 35% Attack Speed.",
    tiers: [
      { count: 1, effect: "Gain plants based on star level" },
    ],
    champions: ["Zyra"],
    icon: rosemotherIcon,
  },
  {
    id: "soulfighter",
    name: "Soul Fighter",
    type: "origin",
    description: "Soul Fighters gain bonus Health, and gain Attack Damage and Ability Power every second up to 8 stacks. At max stacks deal bonus true damage. Prismatic: Defeat 10 players in combat.",
    tiers: [
      { count: 2, effect: "120 Health, 1% AD/AP, +10% damage" },
      { count: 4, effect: "240 Health, 2% AD/AP, +16% damage" },
      { count: 6, effect: "425 Health, 3% AD/AP, +22% damage" },
      { count: 8, effect: "600 Health, 4% AD/AP, +28% damage" },
    ],
    champions: ["Kalista", "Naafiri", "Lux", "Xin Zhao", "Viego", "Samira", "Sett", "Gwen"],
    icon: soulFighterIcon,
  },
  {
    id: "stancemaster",
    name: "Stance Master",
    type: "origin",
    description: "When you field Lee Sin, choose between Duelist Stance, Executioner Stance, and Juggernaut Stance! Each stance has a unique ability, and grants Lee Sin the associated trait.",
    tiers: [
      { count: 1, effect: "Choose stance for Lee Sin" },
    ],
    champions: ["Lee Sin"],
    icon: stanceMasterIcon,
  },
  {
    id: "starguardian",
    name: "Star Guardian",
    type: "origin",
    description: "Star Guardians have a unique Teamwork bonus that is granted to all Star Guardians. Every Star Guardian fielded increases the bonus! Prismatic: Spend 18500 mana.",
    tiers: [
      { count: 2, effect: "Rell: Gain shields" },
      { count: 3, effect: "Syndra: Gain Ability Power" },
      { count: 4, effect: "Xayah: Magic damage on attack" },
      { count: 5, effect: "Ahri: On cast, gain Mana" },
      { count: 6, effect: "Neeko: Increase heals & shields" },
      { count: 7, effect: "Poppy: Heal at low Health" },
      { count: 8, effect: "Jinx: Gain Attack Speed" },
      { count: 9, effect: "Seraphine: Gain every stat" },
    ],
    champions: ["Rell", "Syndra", "Xayah", "Ahri", "Neeko", "Jinx", "Poppy", "Seraphine"],
    icon: starGuardianIcon,
  },
  {
    id: "supremecells",
    name: "Supreme Cells",
    type: "origin",
    description: "The Cell who dealt the most damage last combat is Supreme. When the Supreme Cell dies, the Cell with the highest current damage becomes Supreme. Cells gain Damage Amp. The Supreme Cell gains more and executes enemies under 10% Health.",
    tiers: [
      { count: 2, effect: "8% Damage Amp | 12% Damage Amp (Supreme)" },
      { count: 3, effect: "18% Damage Amp | 30% Damage Amp (Supreme)" },
      { count: 4, effect: "28% Damage Amp | 50% Damage Amp (Supreme). Gain a second Supreme" },
    ],
    champions: ["Kennen", "Kai'Sa", "Darius", "Akali"],
    icon: supremeCellsIcon,
  },
  {
    id: "thechamp",
    name: "The Champ",
    type: "origin",
    description: "The Champ's victories against players grant Poro-fans equal to his star level. On loss, Poro-fans prevent 1 Tactician damage each, then lose all of your Poro-fans.",
    tiers: [
      { count: 1, effect: "Gain Poro-fans on victories" },
    ],
    champions: ["Braum"],
    icon: theChampIcon,
  },
  {
    id: "thecrew",
    name: "The Crew",
    type: "origin",
    description: "Crew champions gain 5% Health and Attack Speed for each Crew member fielded. Every 3-star Crew champion grants an additional bonus.",
    tiers: [
      { count: 2, effect: "5% Health and Attack Speed per Crew" },
      { count: 3, effect: "+1 XP per paid reroll (1x 3-star)" },
      { count: 4, effect: "+1 free reroll/round (2x 3-star)" },
      { count: 5, effect: "Fire rockets (3x 3-star)" },
      { count: 6, effect: "Fire rockets more often (4x 3-star)" },
      { count: 7, effect: "Fire the Planet Cracker (5x 3-star)" },
    ],
    champions: ["Malphite", "Sivir", "Shen", "Ziggs", "Twisted Fate"],
    icon: theCrewIcon,
  },
  {
    id: "wraith",
    name: "Wraith",
    type: "origin",
    description: "Every 4 seconds, the Shadow Realm strikes the 3 closest enemies, dealing total magic damage equal to a portion of damage dealt by Wraiths since the last trigger. Your lowest health Wraith heals for 18% of damage dealt.",
    tiers: [
      { count: 2, effect: "20% damage" },
      { count: 4, effect: "40% damage" },
      { count: 6, effect: "60% damage" },
    ],
    champions: ["Kayle", "Zac", "Jhin", "Malzahar", "K'Sante", "Varus"],
    icon: wraithIcon,
  },
];

// ============================================================================
// CLASSES
// ============================================================================

export const classes: Trait[] = [
  {
    id: "bastion",
    name: "Bastion",
    type: "class",
    description: "Your team gains 10 Armor and Magic Resist. Bastions gain more, and the value doubles in the first 10 seconds of combat.",
    tiers: [
      { count: 2, effect: "18 Armor/MR" },
      { count: 4, effect: "40 Armor/MR" },
      { count: 6, effect: "75 Armor/MR; Non-Bastions gain an additional 25 Armor/MR" },
    ],
    champions: ["Garen", "Rell", "Shen", "Xin Zhao", "Swain", "Leona", "Braum"],
    icon: bastionIcon,
  },
  {
    id: "duelist",
    name: "Duelist",
    type: "class",
    description: "Duelists gain Attack Speed on each attack, stacking up to 12 times.",
    tiers: [
      { count: 2, effect: "4% Attack Speed" },
      { count: 4, effect: "7% Attack Speed" },
      { count: 6, effect: "10% Attack Speed; Duelists gain 12% Damage Reduction" },
    ],
    champions: ["Kayle", "Gangplank", "Kai'Sa", "Udyr", "Viego", "Ashe"],
    icon: duelistIcon,
  },
  {
    id: "edgelord",
    name: "Edgelord",
    type: "class",
    description: "Edgelords gain Omnivamp and Attack Damage. While attacking enemies under 50% Health, they gain 40% Attack Speed.",
    tiers: [
      { count: 2, effect: "10% Omnivamp, 15% Attack Damage" },
      { count: 4, effect: "12% Omnivamp, 40% Attack Damage" },
      { count: 6, effect: "15% Omnivamp, 60% Attack Damage" },
    ],
    champions: ["Shen", "Xayah", "Yasuo", "Samira", "Volibear", "Yone"],
    icon: edgelordIcon,
  },
  {
    id: "executioner",
    name: "Executioner",
    type: "class",
    description: "Executioners gain Critical Strike Chance and Critical Strike Damage. Their Ability can critically strike.",
    tiers: [
      { count: 2, effect: "25% Crit Chance; 10% Crit Damage" },
      { count: 3, effect: "35% Crit Chance; 12% Crit Damage" },
      { count: 4, effect: "50% Crit Chance; 18% Crit Damage" },
      { count: 5, effect: "55% Crit Chance; 28% Crit Damage" },
    ],
    champions: ["Kalista", "Katarina", "Senna", "Akali", "Ryze"],
    icon: executionerIcon,
  },
  {
    id: "heavyweight",
    name: "Heavyweight",
    type: "class",
    description: "Your team gains 100 Health. Heavyweights gain additional bonus Health, and Attack Damage equal to a percentage of their Health.",
    tiers: [
      { count: 2, effect: "20% Health | 0.2% Health to AD" },
      { count: 4, effect: "40% Health | 0.4% Health to AD" },
      { count: 6, effect: "65% Health | 0.6% Health to AD" },
    ],
    champions: ["Aatrox", "Zac", "Kobuko", "Darius", "Jayce", "Poppy"],
    icon: heavyweightIcon,
  },
  {
    id: "juggernaut",
    name: "Juggernaut",
    type: "class",
    description: "Juggernauts gain Durability, increased above 50% health. When a Juggernaut dies, other Juggernauts heal for 10% of their max Health.",
    tiers: [
      { count: 2, effect: "15% or 25% Damage Reduction" },
      { count: 4, effect: "20% or 30% Damage Reduction" },
      { count: 6, effect: "25% or 35% Damage Reduction" },
    ],
    champions: ["Aatrox", "Naafiri", "Dr. Mundo", "Vi", "Udyr", "Sett"],
    icon: juggernautIcon,
  },
  {
    id: "prodigy",
    name: "Prodigy",
    type: "class",
    description: "Your team gains Mana Regen. Prodigies gain more.",
    tiers: [
      { count: 2, effect: "1 Mana Regen | 3 Mana Regen (Prodigy)" },
      { count: 3, effect: "1 Mana Regen | 4 Mana Regen (Prodigy)" },
      { count: 4, effect: "1 Mana Regen | 6 Mana Regen (Prodigy)" },
      { count: 5, effect: "1 Mana Regen | 7 Mana Regen (Prodigy) | Prodigy abilities heal an ally for 12% of the damage dealt" },
    ],
    champions: ["Ezreal", "Syndra", "Malzahar", "Yuumi", "Seraphine"],
    icon: prodigyIcon,
  },
  {
    id: "protector",
    name: "Protector",
    type: "class",
    description: "Units gain 5% Durability while shielded. Once per combat at 50% Health, Protectors shield themselves and their closest ally for a percent of their maximum Health. Shields stack.",
    tiers: [
      { count: 2, effect: "18% Health shield" },
      { count: 4, effect: "36% Health shield" },
      { count: 6, effect: "55% Health shield" },
    ],
    champions: ["Kennen", "Malphite", "Janna", "Rakan", "Neeko", "K'Sante"],
    icon: protectorIcon,
  },
  {
    id: "sniper",
    name: "Sniper",
    type: "class",
    description: "Snipers gain Damage Amp, increased against targets farther away.",
    tiers: [
      { count: 2, effect: "13% Damage Amp; +3% per hex" },
      { count: 3, effect: "16% Damage Amp; +5% per hex" },
      { count: 4, effect: "22% Damage Amp; +7% per hex" },
      { count: 5, effect: "25% Damage Amp; +10% per hex" },
    ],
    champions: ["Gnar", "Sivir", "Jhin", "Caitlyn", "Jinx", "Varus"],
    icon: sniperIcon,
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    type: "class",
    description: "Sorcerers gain bonus Ability Power. When an enemy dies after being damaged by a Sorcerer, they deal a percentage of that enemy's maximum Health to another enemy.",
    tiers: [
      { count: 2, effect: "20% Ability Power; 8% max Health" },
      { count: 4, effect: "50% Ability Power; 10% max Health" },
      { count: 6, effect: "80% Ability Power; 12% max Health to 2 enemies" },
    ],
    champions: ["Kennen", "Lucian", "Lux", "Ahri", "Swain", "Karma", "Gwen"],
    icon: sorcererIcon,
  },
  {
    id: "strategist",
    name: "Strategist",
    type: "class",
    description: "Combat Start: Allies in the front 2 rows gain a shield for 15 seconds. Allies in the back 2 rows gain Damage Amp. Strategists gain triple.",
    tiers: [
      { count: 2, effect: "150 Shield; 4% Damage Amp" },
      { count: 3, effect: "225 Shield; 6% Damage Amp" },
      { count: 4, effect: "350 Shield; 10% Damage Amp" },
      { count: 5, effect: "450 Shield; 14% Damage Amp" },
    ],
    champions: ["Janna", "Ziggs", "JarvanIV", "Ryze"],
    icon: strategistIcon,
  },
];

// ============================================================================
// ALL TRAITS COMBINED
// ============================================================================

export const allTraits: Trait[] = [...origins, ...classes];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all traits for a specific champion
 */
export function getChampionTraits(championName: string): Trait[] {
  return allTraits.filter((trait) =>
    trait.champions.some(
      (champ) => champ.toLowerCase() === championName.toLowerCase()
    )
  );
}

/**
 * Get origins for a specific champion
 */
export function getChampionOrigins(championName: string): Trait[] {
  return origins.filter((origin) =>
    origin.champions.some(
      (champ) => champ.toLowerCase() === championName.toLowerCase()
    )
  );
}

/**
 * Get classes for a specific champion
 */
export function getChampionClasses(championName: string): Trait[] {
  return classes.filter((classItem) =>
    classItem.champions.some(
      (champ) => champ.toLowerCase() === championName.toLowerCase()
    )
  );
}

/**
 * Get a trait by its ID
 */
export function getTraitById(traitId: string): Trait | undefined {
  return allTraits.find((trait) => trait.id === traitId);
}

/**
 * Get all champions that have a specific trait
 */
export function getChampionsWithTrait(traitId: string): string[] {
  const trait = getTraitById(traitId);
  return trait ? trait.champions : [];
}

/**
 * Check if a champion has a specific trait
 */
export function championHasTrait(championName: string, traitId: string): boolean {
  const trait = getTraitById(traitId);
  if (!trait) return false;
  
  return trait.champions.some(
    (champ) => champ.toLowerCase() === championName.toLowerCase()
  );
}

/**
 * Get all trait names
 */
export function getAllTraitNames(): string[] {
  return allTraits.map((trait) => trait.name);
}

/**
 * Get all origin names
 */
export function getOriginNames(): string[] {
  return origins.map((origin) => origin.name);
}

/**
 * Get all class names
 */
export function getClassNames(): string[] {
  return classes.map((classItem) => classItem.name);
}

/**
 * Calculate active traits from a list of champions
 */
export function calculateActiveTraits(championNames: string[]): {
  trait: Trait;
  activeCount: number;
  activeTier: TraitTier | null;
  tierIndex: number;
}[] {
  const traitCounts = new Map<string, number>();
  
  // Count champions per trait
  championNames.forEach(championName => {
    const championTraits = getChampionTraits(championName);
    championTraits.forEach(trait => {
      const currentCount = traitCounts.get(trait.id) || 0;
      traitCounts.set(trait.id, currentCount + 1);
    });
  });
  
  // Calculate active traits with their tiers
  const activeTraits = Array.from(traitCounts.entries())
    .map(([traitId, count]) => {
      const trait = getTraitById(traitId);
      if (!trait) return null;
      
      // Find the highest tier that is active
      let activeTier: TraitTier | null = null;
      let tierIndex = -1;
      
      for (let i = trait.tiers.length - 1; i >= 0; i--) {
        if (count >= trait.tiers[i].count) {
          activeTier = trait.tiers[i];
          tierIndex = i;
          break;
        }
      }
      
      return {
        trait,
        activeCount: count,
        activeTier,
        tierIndex
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.activeTier !== null)
    .sort((a, b) => {
      // Sort by type (origins first), then by count
      if (a.trait.type !== b.trait.type) {
        return a.trait.type === 'origin' ? -1 : 1;
      }
      return b.activeCount - a.activeCount;
    });
  
  return activeTraits;
}
