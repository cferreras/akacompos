// ============================================================================
// TRAITS DATA - Origins and Classes from TFT Set 16 (Lore & Legends)
// ============================================================================

// ============================================================================
// TRAIT ICONS IMPORTS - SET 16
// ============================================================================
// Origins
import bilgewaterIcon from "../assets/Traits/Trait_Icon_16_Bilgewater.TFT_Set16.png";
import demaciaIcon from "../assets/Traits/Trait_Icon_16_Demacia.TFT_Set16.png";
import freljordIcon from "../assets/Traits/Trait_Icon_16_Freljord.TFT_Set16.png";
import ioniaIcon from "../assets/Traits/Trait_Icon_16_Ionia.TFT_Set16.png";
import ixtalIcon from "../assets/Traits/Trait_Icon_16_Ixtal.TFT_Set16.png";
import noxusIcon from "../assets/Traits/Trait_Icon_16_Noxus.TFT_Set16.png";
import piltoverIcon from "../assets/Traits/Trait_Icon_16_Piltover.TFT_Set16.png";
import shadowIslesIcon from "../assets/Traits/Trait_Icon_16_ShadowIsles.TFT_Set16.png";
import shurimaIcon from "../assets/Traits/Trait_Icon_16_Shurima.TFT_Set16.png";
import targonIcon from "../assets/Traits/Trait_Icon_16_Targon.TFT_Set16.png";
import voidIcon from "../assets/Traits/Trait_Icon_16_Void.TFT_Set16.png";
import yordleIcon from "../assets/Traits/Trait_Icon_16_Yordle.TFT_Set16.png";
import zaunIcon from "../assets/Traits/Trait_Icon_16_Zaun.TFT_Set16.png";

// Classes
import arcanistIcon from "../assets/Traits/Trait_Icon_16_Arcanist.TFT_Set16.png";
import bruiserIcon from "../assets/Traits/Trait_Icon_16_Brawler.TFT_Set16.png";
import defenderIcon from "../assets/Traits/Trait_Icon_16_Defender.TFT_Set16.png";
import disruptorIcon from "../assets/Traits/Trait_Icon_16_Disruptor.TFT_Set16.png";
import gunslingerIcon from "../assets/Traits/Trait_Icon_16_Gunslinger.TFT_Set16.png";
import invokerIcon from "../assets/Traits/Trait_Icon_16_Invoker.TFT_Set16.png";
import juggernautIcon from "../assets/Traits/Trait_Icon_16_Juggernaut.TFT_Set16.png";
import longshotIcon from "../assets/Traits/Trait_Icon_16_Longshot.TFT_Set16.png";
import quickstrikerIcon from "../assets/Traits/Trait_Icon_16_Quickstriker.TFT_Set16.png";
import slayerIcon from "../assets/Traits/Trait_Icon_16_Slayer.TFT_Set16.png";
import vanquisherIcon from "../assets/Traits/Trait_Icon_16_Vanquisher.TFT_Set16.png";
import wardenIcon from "../assets/Traits/Trait_Icon_16_Warden.TFT_Set16.png";

// Unique Traits
import ascendantIcon from "../assets/Traits/Trait_Icon_16_Ascendant.TFT_Set16.png";
import assimilatorIcon from "../assets/Traits/Trait_Icon_16_Assimilator.TFT_Set16.png";
import blacksmithIcon from "../assets/Traits/Trait_Icon_16_Blacksmith.TFT_Set4.5.png";
import caretakerIcon from "../assets/Traits/Trait_Icon_16_Caretaker.TFT_Set16.png";
import chainbreakerIcon from "../assets/Traits/Trait_Icon_16_Chainbreaker.TFT_Set16.png";
import chronokeeperIcon from "../assets/Traits/Trait_Icon_16_Chronokeeper.TFT_Set16.png";
import darkChildIcon from "../assets/Traits/Trait_Icon_16_DarkChild.TFT_Set16.png";
import darkinIcon from "../assets/Traits/Trait_Icon_16_Darkin.TFT_Set16.png";
import dragonbornIcon from "../assets/Traits/Trait_Icon_16_Dragonborn.TFT_Set16.png";
import emperorIcon from "../assets/Traits/Trait_Icon_16_Emperor.TFT_Set16.png";
import eternalIcon from "../assets/Traits/Trait_Icon_16_Eternal.TFT_Set16.png";
import gluttonIcon from "../assets/Traits/Trait_Icon_16_Glutton.TFT_Set16.png";
import harvesterIcon from "../assets/Traits/Trait_Icon_16_Harvester.TFT_Set16.png";
import heroicIcon from "../assets/Traits/Trait_Icon_16_Heroic.TFT_Set16.png";
import huntressIcon from "../assets/Traits/Trait_Icon_16_Huntress.TFT_Set16.png";
import immortalIcon from "../assets/Traits/Trait_Icon_16_Immortal.TFT_Set16.png";
import riftscourgeIcon from "../assets/Traits/Trait_Icon_16_Riftscourge.TFT_Set16.png";
import runeMageIcon from "../assets/Traits/Trait_Icon_16_RuneMage.TFT_Set16.png";
import soulboundIcon from "../assets/Traits/Trait_Icon_16_Soulbound.TFT_Set16.png";
import worldEnderIcon from "../assets/Traits/Trait_Icon_16_WorldEnder.TFT_Set16.png";

export type TraitType = "origin" | "class" | "unique";

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
  icon: any; // Import metadata from Astro
}

// ============================================================================
// ORIGINS (REGIONS)
// ============================================================================

export const origins: Trait[] = [
  {
    id: "bilgewater",
    name: "Bilgewater",
    type: "origin",
    description: "Bilgewater units gain Attack Damage and Ability Power. Each player combat, components held by surviving Bilgewater units become completed items. On victory, completed items are put away and they re-equip their components.",
    tiers: [
      { count: 3, effect: "15% AD/AP" },
      { count: 5, effect: "30% AD/AP" },
      { count: 7, effect: "45% AD/AP" },
      { count: 9, effect: "65% AD/AP" },
    ],
    champions: ["Fizz", "Gangplank", "Graves", "Illaoi", "Miss Fortune", "Nautilus", "Tahm Kench", "Twisted Fate"],
    icon: bilgewaterIcon,
  },
  {
    id: "demacia",
    name: "Demacia",
    type: "origin",
    description: "Demacia units gain bonus Armor and Magic Resist. At the start of combat, units in the first 2 rows gain a shield equal to 125% of their bonus Armor and Magic Resist for 10 seconds.",
    tiers: [
      { count: 3, effect: "15 Armor & MR, 200 Shield" },
      { count: 5, effect: "35 Armor & MR, 400 Shield" },
      { count: 7, effect: "65 Armor & MR, 700 Shield" },
      { count: 9, effect: "110 Armor & MR, 1200 Shield" },
    ],
    champions: ["Galio", "Garen", "Jarvan IV", "Lux", "Poppy", "Sona", "Vayne", "Xin Zhao"],
    icon: demaciaIcon,
  },
  {
    id: "freljord",
    name: "Freljord",
    type: "origin",
    description: "Every 2 seconds, Freljord units Chill enemies within 2 hexes by 15% for 2 seconds. This effect stacks and Freljord units are immune to Chill. Chilled enemies gain increased Chill duration and take more damage from Freljord units.",
    tiers: [
      { count: 3, effect: "+3% Damage, +15% Chill duration" },
      { count: 5, effect: "+8% Damage, +30% Chill duration" },
      { count: 7, effect: "+15% Damage, +50% Chill duration" },
      { count: 9, effect: "+25% Damage, +75% Chill duration" },
    ],
    champions: ["Anivia", "Ashe", "Braum", "Lissandra", "Ornn", "Sejuani", "Tryndamere", "Volibear"],
    icon: freljordIcon,
  },
  {
    id: "ionia",
    name: "Ionia",
    type: "origin",
    description: "Ionia units gain Attack Speed. After the first ally Ionia unit casts per combat, all allies gain bonus Attack Speed for 5 seconds.",
    tiers: [
      { count: 3, effect: "10% AS, 15% bonus" },
      { count: 5, effect: "20% AS, 25% bonus" },
      { count: 7, effect: "35% AS, 45% bonus" },
      { count: 9, effect: "60% AS, 75% bonus" },
    ],
    champions: ["Ahri", "Jhin", "Kennen", "Sett", "Shen", "Wukong", "Xin Zhao", "Yasuo", "Yone", "Yunara"],
    icon: ioniaIcon,
  },
  {
    id: "ixtal",
    name: "Ixtal",
    type: "origin",
    description: "Ixtal units gain bonus Health and Ability Power. Once per combat when you would be eliminated, allies instead gain 50% of that bonus Health.",
    tiers: [
      { count: 3, effect: "150 Health, 15 AP" },
      { count: 5, effect: "300 Health, 30 AP" },
      { count: 7, effect: "500 Health, 50 AP" },
    ],
    champions: ["Brock", "Milio", "Neeko", "Nidalee", "Qiyana", "Skarner"],
    icon: ixtalIcon,
  },
  {
    id: "noxus",
    name: "Noxus",
    type: "origin",
    description: "Noxus units gain bonus Health. Once per combat at 50% Health, they become unstoppable for 1.5 seconds and gain a percent of their missing Health.",
    tiers: [
      { count: 3, effect: "150 Health, 25% missing Health" },
      { count: 5, effect: "275 Health, 30% missing Health" },
      { count: 7, effect: "450 Health, 35% missing Health" },
      { count: 9, effect: "700 Health, 45% missing Health" },
    ],
    champions: ["Ambessa", "Briar", "Darius", "Draven", "LeBlanc", "Mel", "Sion", "Swain"],
    icon: noxusIcon,
  },
  {
    id: "piltover",
    name: "Piltover",
    type: "origin",
    description: "Piltover units gain 10 Starting Mana. For every 100 Mana spent, gain 1 Charge. At full Charge, gain an Innovation.",
    tiers: [
      { count: 2, effect: "10 Charges" },
      { count: 4, effect: "8 Charges; 1 component" },
      { count: 6, effect: "6 Charges; 1 completed item" },
      { count: 8, effect: "4 Charges; 1 radiant item" },
    ],
    champions: ["Caitlyn", "Loris", "Orianna", "Seraphine", "T-Hex", "Vi"],
    icon: piltoverIcon,
  },
  {
    id: "shadowisles",
    name: "Shadow Isles",
    type: "origin",
    description: "Shadow Isles units gain +1 soul for each combat they survive. Shadow Isles units gain bonus Health and Ability Power.",
    tiers: [
      { count: 2, effect: "3 Health, 1 AP per soul" },
      { count: 4, effect: "6 Health, 2 AP per soul" },
      { count: 6, effect: "10 Health, 3 AP per soul" },
      { count: 8, effect: "15 Health, 5 AP per soul" },
    ],
    champions: ["Gwen", "Kalista", "Thresh", "Viego", "Yorick"],
    icon: shadowIslesIcon,
  },
  {
    id: "shurima",
    name: "Shurima",
    type: "origin",
    description: "After 8 seconds, Shurima units become Ascended. This effect is tripled for Azir. Ascended: 25% Attack Speed and 15% max Health",
    tiers: [
      { count: 3, effect: "+50% Ascended effect" },
      { count: 5, effect: "+100% Ascended effect" },
      { count: 7, effect: "+160% Ascended effect" },
      { count: 9, effect: "+250% Ascended effect" },
    ],
    champions: ["Azir", "Nasus", "Renekton", "Xerath"],
    icon: shurimaIcon,
  },
  {
    id: "targon",
    name: "Targon",
    type: "origin",
    description: "After participating in 2 player combats, Targon units permanently gain 10% Attack Speed and 10 Ability Power. This effect stacks.",
    tiers: [
      { count: 2, effect: "1 unit gains bonuses" },
      { count: 3, effect: "All gain bonuses; +5% AS, +5 AP" },
      { count: 4, effect: "All gain bonuses; +10% AS, +10 AP" },
      { count: 5, effect: "All gain bonuses; +15% AS, +15 AP" },
    ],
    champions: ["Aphelios", "Diana", "Leona", "Taric", "Zoe"],
    icon: targonIcon,
  },
  {
    id: "void",
    name: "Void",
    type: "origin",
    description: "While in the Void Rift: Void champions execute targets below 25% Health. Void units gain the same stats for every combat they survive. Combat victories grant double. Stats: 3% Attack Speed, 4 Attack Damage, 4 Ability Power",
    tiers: [
      { count: 2, effect: "Enter the Void Rift when you fall below 40 Health" },
      { count: 4, effect: "Enter at 60 Health" },
      { count: 6, effect: "Enter at 80 Health. Stats increased by 50%" },
      { count: 8, effect: "Enter at 100 Health. Stats increased by 100%" },
    ],
    champions: ["Baron Nashor", "Bel'Veth", "Cho'Gath", "Kai'Sa", "Kog'Maw", "Malzahar", "Rek'Sai", "Rift Herald"],
    icon: voidIcon,
  },
  {
    id: "yordle",
    name: "Yordle",
    type: "origin",
    description: "Yordle units gain bonus Health. For every 3-star Yordle champion on your board, your team gains the same bonus.",
    tiers: [
      { count: 3, effect: "125 Health" },
      { count: 5, effect: "225 Health" },
      { count: 7, effect: "375 Health" },
      { count: 9, effect: "600 Health" },
    ],
    champions: ["Fizz", "Kennen", "Kobuko & Yuumi", "Lulu", "Poppy", "Rumble", "Teemo", "Tristana", "Veigar", "Ziggs"],
    icon: yordleIcon,
  },
  {
    id: "zaun",
    name: "Zaun",
    type: "origin",
    description: "After 10 seconds, a toxic cloud surrounds Zaun units for the rest of combat. Enemies within the cloud take 2% of their max Health as true damage each second and have 20% reduced healing.",
    tiers: [
      { count: 2, effect: "Cloud radius: 1 hex" },
      { count: 4, effect: "Cloud radius: 2 hexes" },
      { count: 6, effect: "Cloud radius: 3 hexes" },
      { count: 8, effect: "Cloud radius: 4 hexes" },
    ],
    champions: ["Blitzcrank", "Dr. Mundo", "Ekko", "Jinx", "Singed", "Vi", "Warwick", "Ziggs"],
    icon: zaunIcon,
  },
];

// ============================================================================
// CLASSES
// ============================================================================

export const classes: Trait[] = [
  {
    id: "arcanist",
    name: "Arcanist",
    type: "class",
    description: "Arcanists gain Ability Power. When they cast their Ability, they grant stacking Ability Power to themselves and the nearest Arcanist for 6 seconds.",
    tiers: [
      { count: 2, effect: "15 AP; +10 per stack" },
      { count: 4, effect: "35 AP; +15 per stack" },
      { count: 6, effect: "60 AP; +25 per stack" },
      { count: 8, effect: "100 AP; +40 per stack" },
    ],
    champions: ["Ahri", "Annie", "Kog'Maw", "Lulu", "Lux", "Neeko", "Swain", "Sylas", "Veigar"],
    icon: arcanistIcon,
  },
  {
    id: "bruiser",
    name: "Bruiser",
    type: "class",
    description: "Bruisers gain bonus max Health. When they cast their Ability, they heal a percent of their max Health.",
    tiers: [
      { count: 2, effect: "15% Health; 25% heal" },
      { count: 4, effect: "30% Health; 30% heal" },
      { count: 6, effect: "50% Health; 35% heal" },
    ],
    champions: ["Dr. Mundo", "Illaoi", "Kobuko & Yuumi", "Rift Herald", "Shen", "Tahm Kench", "Volibear", "Wukong"],
    icon: bruiserIcon,
  },
  {
    id: "defender",
    name: "Defender",
    type: "class",
    description: "Defenders gain Armor and Magic Resist. When they cast their Ability, they grant 15 Armor and Magic Resist to allies within 2 hexes for 4 seconds.",
    tiers: [
      { count: 2, effect: "30 Armor & MR" },
      { count: 4, effect: "70 Armor & MR" },
      { count: 6, effect: "125 Armor & MR" },
      { count: 8, effect: "225 Armor & MR" },
    ],
    champions: ["Darius", "Garen", "Jarvan IV", "Kennen", "Neeko", "Rumble", "Sejuani", "Sylas", "Vi"],
    icon: defenderIcon,
  },
  {
    id: "disruptor",
    name: "Disruptor",
    type: "class",
    description: "Disruptors gain Mana whenever an enemy casts. At the start of combat, they gain a Shield for 8 seconds and increase the Mana cost of the nearest enemy's first Ability by 35%.",
    tiers: [
      { count: 2, effect: "10 Mana; 200 Shield" },
      { count: 4, effect: "20 Mana; 400 Shield" },
      { count: 6, effect: "30 Mana; 700 Shield" },
    ],
    champions: ["Azir", "Ekko", "Gwen", "Malzahar", "Mel", "Seraphine"],
    icon: disruptorIcon,
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    type: "class",
    description: "Gunslingers gain bonus Attack Damage and Attack Speed. Every 4th attack from a Gunslinger fires additional bullets at random targets.",
    tiers: [
      { count: 2, effect: "10% AS, 8% AD; 1 bullet" },
      { count: 4, effect: "20% AS, 16% AD; 2 bullets" },
      { count: 6, effect: "35% AS, 24% AD; 3 bullets" },
    ],
    champions: ["Graves", "Jhin", "Jinx", "Lucian & Senna", "Miss Fortune", "T-Hex", "Tristana"],
    icon: gunslingerIcon,
  },
  {
    id: "invoker",
    name: "Invoker",
    type: "class",
    description: "Invokers gain Mana each second. If they're already holding 50 or more Mana, they heal the lowest Health ally instead.",
    tiers: [
      { count: 2, effect: "2 Mana/sec; 30 Heal" },
      { count: 4, effect: "4 Mana/sec; 60 Heal" },
      { count: 6, effect: "6 Mana/sec; 100 Heal" },
      { count: 8, effect: "10 Mana/sec; 200 Heal" },
    ],
    champions: ["Anivia", "Kobuko & Yuumi", "LeBlanc", "Lissandra", "Milio", "Orianna", "Sona", "Zilean"],
    icon: invokerIcon,
  },
  {
    id: "juggernaut",
    name: "Juggernaut",
    type: "class",
    description: "Juggernauts gain bonus Armor, Magic Resist, and Attack Damage.",
    tiers: [
      { count: 2, effect: "40 Armor, 40 MR, 12% AD" },
      { count: 4, effect: "90 Armor, 90 MR, 24% AD" },
      { count: 6, effect: "175 Armor, 175 MR, 40% AD" },
    ],
    champions: ["Blitzcrank", "Briar", "Cho'Gath", "Nautilus", "Poppy", "Shyvana", "Singed", "Swain"],
    icon: juggernautIcon,
  },
  {
    id: "longshot",
    name: "Longshot",
    type: "class",
    description: "Longshot units gain bonus Attack Damage and Ability Power (enhanced if 4+ hexes away from their target).",
    tiers: [
      { count: 2, effect: "8% AD/AP; 16% enhanced" },
      { count: 4, effect: "18% AD/AP; 36% enhanced" },
      { count: 6, effect: "30% AD/AP; 60% enhanced" },
    ],
    champions: ["Caitlyn", "Kai'Sa", "Kog'Maw", "Teemo", "Vayne", "Ziggs"],
    icon: longshotIcon,
  },
  {
    id: "quickstriker",
    name: "Quickstriker",
    type: "class",
    description: "Quickstriker attacks deal bonus damage and grant bonus Attack Speed and Move Speed for 3 seconds.",
    tiers: [
      { count: 2, effect: "20% bonus AD; 15% AS & MS" },
      { count: 3, effect: "40% bonus AD; 30% AS & MS" },
      { count: 4, effect: "65% bonus AD; 50% AS & MS" },
    ],
    champions: ["Ashe", "Draven", "Kindred", "Twisted Fate", "Viego", "Warwick", "Yunara"],
    icon: quickstrikerIcon,
  },
  {
    id: "slayer",
    name: "Slayer",
    type: "class",
    description: "Slayers gain bonus Attack Speed. After they gain a takedown, this bonus is tripled for 6 seconds.",
    tiers: [
      { count: 2, effect: "15% AS" },
      { count: 4, effect: "40% AS" },
      { count: 6, effect: "75% AS" },
    ],
    champions: ["Aatrox", "Bel'Veth", "Briar", "Gangplank", "Qiyana", "Tryndamere", "Yasuo", "Yone"],
    icon: slayerIcon,
  },
  {
    id: "vanquisher",
    name: "Vanquisher",
    type: "class",
    description: "Vanquishers gain Attack Damage and Ability Power. Their attacks and abilities ignore 20% of Armor and Magic Resist. On scoring a takedown, they create an explosion at the target's location that deals physical damage.",
    tiers: [
      { count: 2, effect: "10% AD/AP; 80% target's max HP" },
      { count: 4, effect: "20% AD/AP; 100% target's max HP" },
      { count: 6, effect: "35% AD/AP; 120% target's max HP" },
    ],
    champions: ["Ambessa", "Fiddlesticks", "Gangplank", "Kalista", "Rek'Sai"],
    icon: vanquisherIcon,
  },
  {
    id: "warden",
    name: "Warden",
    type: "class",
    description: "Wardens gain bonus Armor and Magic Resist. This bonus is increased by 20% for each enemy targeting them.",
    tiers: [
      { count: 2, effect: "30 Armor & MR" },
      { count: 4, effect: "80 Armor & MR" },
      { count: 6, effect: "200 Armor & MR" },
    ],
    champions: ["Braum", "Loris", "Nautilus", "Ornn", "Skarner", "Thresh", "Xin Zhao", "Yorick"],
    icon: wardenIcon,
  },
];

// ============================================================================
// UNIQUE TRAITS
// ============================================================================

export const uniqueTraits: Trait[] = [
  {
    id: "ascendant",
    name: "Ascendant",
    type: "unique",
    description: "Ascendants are permanently Ascended. When they deal damage, they heal the 2 nearest Shurima allies for 2% of the damage dealt.",
    tiers: [
      { count: 1, effect: "Xerath is always Ascended" },
    ],
    champions: ["Xerath"],
    icon: ascendantIcon,
  },
  {
    id: "assimilator",
    name: "Assimilator",
    type: "unique",
    description: "At the start of combat, Assimilators copy the stats from the 2 nearest non-Assimilator allies (the same unit can be targeted twice).",
    tiers: [
      { count: 1, effect: "Copy 10% Health, 10 Armor, 10 MR, 10% AD, 10% AS, 10 AP" },
    ],
    champions: ["Kai'Sa"],
    icon: assimilatorIcon,
  },
  {
    id: "blacksmith",
    name: "Blacksmith",
    type: "unique",
    description: "At the start of combat, Blacksmiths forge their team a special artifact lasting the rest of combat.",
    tiers: [
      { count: 1, effect: "Grant your team a random artifact item" },
    ],
    champions: ["Ornn"],
    icon: blacksmithIcon,
  },
  {
    id: "caretaker",
    name: "Caretaker",
    type: "unique",
    description: "Your team gains maximum Health. When scoring a takedown, Caretakers heal themselves and their nearest ally.",
    tiers: [
      { count: 1, effect: "100 max Health; heal 8% max Health" },
    ],
    champions: ["Bard"],
    icon: caretakerIcon,
  },
  {
    id: "chainbreaker",
    name: "Chainbreaker",
    type: "unique",
    description: "At the start of combat, become empowered. This effect ends once Sylas has cast 3 stolen spells. Empowered: 350 bonus Health, 20 Armor, 20 Magic Resist, 35% Attack Speed",
    tiers: [
      { count: 1, effect: "Sylas steals abilities from enemies" },
    ],
    champions: ["Sylas"],
    icon: chainbreakerIcon,
  },
  {
    id: "chronokeeper",
    name: "Chronokeeper",
    type: "unique",
    description: "When Zilean casts, he speeds up time for all allies, granting them 15% Attack Speed for the rest of combat. When he dies for the first time, instead travel back to when combat started.",
    tiers: [
      { count: 1, effect: "15% AS per cast; revive once per combat" },
    ],
    champions: ["Zilean"],
    icon: chronokeeperIcon,
  },
  {
    id: "darkchild",
    name: "Dark Child",
    type: "unique",
    description: "Combat start: Annie summons Tibbers with a percentage of Annie's Health. When Tibbers dies, he detonates, dealing magic damage to all adjacent enemies. When Annie dies, Tibbers also dies.",
    tiers: [
      { count: 1, effect: "Tibbers: 100% Annie's Health" },
    ],
    champions: ["Annie"],
    icon: darkChildIcon,
  },
  {
    id: "darkin",
    name: "Darkin",
    type: "unique",
    description: "For each enemy unit death, Darkin gain bonus stacking Attack Speed and Omnivamp.",
    tiers: [
      { count: 2, effect: "+6% AS, +2% Omnivamp per death" },
    ],
    champions: ["Aatrox", "Zaahen"],
    icon: darkinIcon,
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    type: "unique",
    description: "Combat start: Transform into a dragon, gaining bonus maximum Health and Durability.",
    tiers: [
      { count: 1, effect: "+750 max Health, +18% Durability for 20 seconds" },
    ],
    champions: ["Shyvana"],
    icon: dragonbornIcon,
  },
  {
    id: "emperor",
    name: "Emperor",
    type: "unique",
    description: "At the start of combat, summon a Sand Soldier near the Azir. Azir's attacks instead command the nearest Sand Soldier to attack his target.",
    tiers: [
      { count: 1, effect: "Azir commands Sand Soldiers" },
    ],
    champions: ["Azir"],
    icon: emperorIcon,
  },
  {
    id: "eternal",
    name: "Eternal",
    type: "unique",
    description: "Eternals gain stacking Omnivamp for the rest of combat as they deal damage with attacks or Abilities.",
    tiers: [
      { count: 1, effect: "+1% Omnivamp per 1000 damage dealt" },
    ],
    champions: ["Kindred"],
    icon: eternalIcon,
  },
  {
    id: "glutton",
    name: "Glutton",
    type: "unique",
    description: "When the Glutton scores a takedown, they permanently gain Attack Damage and Ability Power. They gain tripled bonuses from eating champions.",
    tiers: [
      { count: 1, effect: "5% AD, 5 AP per takedown; 15% AD, 15 AP per eaten champion" },
    ],
    champions: ["Tahm Kench"],
    icon: gluttonIcon,
  },
  {
    id: "harvester",
    name: "Harvester",
    type: "unique",
    description: "When Fiddlesticks drains the life from an enemy, he harvests 1 Fear. Afterwards, gain bonus Health and Ability Power.",
    tiers: [
      { count: 1, effect: "40 Health, 4 AP per Fear" },
    ],
    champions: ["Fiddlesticks"],
    icon: harvesterIcon,
  },
  {
    id: "heroic",
    name: "Heroic",
    type: "unique",
    description: "After participating in 4 player combats, become Heroic. Heroic: 600 Health, 75 Armor and MR, 60 AD, 60 AP",
    tiers: [
      { count: 1, effect: "Become Heroic after 4 combats" },
    ],
    champions: ["Galio"],
    icon: heroicIcon,
  },
  {
    id: "huntress",
    name: "Huntress",
    type: "unique",
    description: "Gain Attack Speed and Ability Power. Takedowns on Fighters and Tanks grant bonus Attack Speed and Ability Power for the rest of combat.",
    tiers: [
      { count: 1, effect: "25% AS, 25 AP; +10% AS, +10 AP per bonus takedown" },
    ],
    champions: ["Nidalee"],
    icon: huntressIcon,
  },
  {
    id: "immortal",
    name: "Immortal",
    type: "unique",
    description: "The first time an Immortal would die, they instead return to life with 75% Health after 2 seconds.",
    tiers: [
      { count: 1, effect: "Revive once per combat with 75% Health" },
    ],
    champions: ["Zaahen"],
    icon: immortalIcon,
  },
  {
    id: "riftscourge",
    name: "Riftscourge",
    type: "unique",
    description: "Baron Nashor is gigantic and takes up 3 hexes. He gains 90% damage reduction for 5 seconds when entering combat, then gains 25 Armor and Magic Resist.",
    tiers: [
      { count: 1, effect: "Baron Nashor is a 3-hex unit" },
    ],
    champions: ["Baron Nashor"],
    icon: riftscourgeIcon,
  },
  {
    id: "runemage",
    name: "Rune Mage",
    type: "unique",
    description: "Before each player combat, choose a Region from your bench and board. Ryze and Rune Mages gain unique bonuses based on the chosen Region.",
    tiers: [
      { count: 1, effect: "Ryze adapts to the chosen region" },
    ],
    champions: ["Ryze"],
    icon: runeMageIcon,
  },
  {
    id: "soulbound",
    name: "Soulbound",
    type: "unique",
    description: "Lucian and Senna are one unit. Senna's attacks Drain 12 mana from enemies. After gaining 110 Mana, Senna afflicts enemies with Black Mist, draining 1 Armor per second for 8 seconds.",
    tiers: [
      { count: 1, effect: "Lucian & Senna fight together" },
    ],
    champions: ["Lucian & Senna"],
    icon: soulboundIcon,
  },
  {
    id: "starforger",
    name: "Star Forger",
    type: "unique",
    description: "Aurelion Sol takes up 3 hexes. At the start of combat, create a star that orbits him dealing magic damage to enemies it hits. The stars's orbit grows every 6 seconds.",
    tiers: [
      { count: 1, effect: "Aurelion Sol is a 3-hex unit with orbital star" },
    ],
    champions: ["Aurelion Sol"],
    icon: targonIcon,
  },
  {
    id: "theboss",
    name: "The Boss",
    type: "unique",
    description: "Sett grabs the closest enemy and hurls them through the largest group of enemies. The grabbed enemy's missing Health increases the damage dealt.",
    tiers: [
      { count: 1, effect: "Sett's ability ignores 100% Armor" },
    ],
    champions: ["Sett"],
    icon: targonIcon,
  },
  {
    id: "worldender",
    name: "World Ender",
    type: "unique",
    description: "Combat start: Transform into a World Ender for 12 seconds gaining bonus Attack Damage and bonus size.",
    tiers: [
      { count: 1, effect: "+100% AD" },
    ],
    champions: ["Aatrox"],
    icon: worldEnderIcon,
  },
];

// ============================================================================
// EXPORT ALL TRAITS
// ============================================================================

export const allTraits: Trait[] = [...origins, ...classes, ...uniqueTraits];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a trait by its name
 * @param name - Trait name (case insensitive)
 * @returns The trait object or undefined if not found
 */
export function getTraitByName(name: string): Trait | undefined {
  return allTraits.find(
    (trait) => trait.name.toLowerCase() === name.toLowerCase(),
  );
}

/**
 * Get traits filtered by type
 * @param type - The trait type (origin, class, or unique)
 * @returns Array of traits matching the type
 */
export function getTraitsByType(type: TraitType): Trait[] {
  return allTraits.filter((trait) => trait.type === type);
}

/**
 * Get trait by ID
 * @param id - Trait ID
 * @returns The trait object or undefined if not found
 */
export function getTraitById(id: string): Trait | undefined {
  return allTraits.find((trait) => trait.id === id);
}

/**
 * Interface for active trait information
 */
export interface ActiveTrait {
  trait: Trait;
  count: number;
  activeTier: TraitTier | null;
  tierIndex: number;
}

/**
 * Calculate active traits based on champion names
 * @param championNames - Array of champion names in the composition
 * @returns Array of active traits with their counts and active tiers
 */
export function calculateActiveTraits(championNames: string[]): ActiveTrait[] {
  const traitCounts = new Map<string, number>();

  // Count how many champions have each trait
  championNames.forEach((championName) => {
    allTraits.forEach((trait) => {
      if (trait.champions.includes(championName)) {
        traitCounts.set(trait.id, (traitCounts.get(trait.id) || 0) + 1);
      }
    });
  });

  // Convert to ActiveTrait objects and calculate active tiers
  const activeTraits: ActiveTrait[] = [];

  traitCounts.forEach((count, traitId) => {
    const trait = getTraitById(traitId);
    if (!trait) return;

    // Find the highest active tier
    let activeTier: TraitTier | null = null;
    let tierIndex = -1;

    for (let i = trait.tiers.length - 1; i >= 0; i--) {
      if (count >= trait.tiers[i].count) {
        activeTier = trait.tiers[i];
        tierIndex = i;
        break;
      }
    }

    activeTraits.push({
      trait,
      count,
      activeTier,
      tierIndex,
    });
  });

  // Sort by type (origins first, then classes, then unique) and then by count
  return activeTraits.sort((a, b) => {
    const typeOrder = { origin: 0, class: 1, unique: 2 };
    const typeCompare = typeOrder[a.trait.type] - typeOrder[b.trait.type];
    if (typeCompare !== 0) return typeCompare;
    return b.count - a.count;
  });
}

/**
 * Get all traits for a specific champion
 * @param championName - Name of the champion
 * @returns Array of traits that the champion belongs to
 */
export function getChampionTraits(championName: string): Trait[] {
  return allTraits.filter((trait) => trait.champions.includes(championName));
}

/**
 * Check if a champion has a specific trait
 * @param championName - Name of the champion
 * @param traitId - ID of the trait to check
 * @returns True if the champion has the trait
 */
export function championHasTrait(championName: string, traitId: string): boolean {
  const trait = getTraitById(traitId);
  return trait ? trait.champions.includes(championName) : false;
}

/**
 * Get champions that have a specific trait
 * @param traitId - ID of the trait
 * @returns Array of champion names
 */
export function getChampionsByTrait(traitId: string): string[] {
  const trait = getTraitById(traitId);
  return trait ? trait.champions : [];
}

/**
 * Find synergies between two champions
 * @param champion1 - First champion name
 * @param champion2 - Second champion name
 * @returns Array of shared traits
 */
export function getChampionSynergies(champion1: string, champion2: string): Trait[] {
  const traits1 = getChampionTraits(champion1);
  const traits2 = getChampionTraits(champion2);

  return traits1.filter((trait) =>
    traits2.some((t) => t.id === trait.id)
  );
}

/**
 * Get the next tier threshold for a trait
 * @param traitId - ID of the trait
 * @param currentCount - Current count of champions with this trait
 * @returns The next tier count needed, or null if at max tier
 */
export function getNextTierCount(traitId: string, currentCount: number): number | null {
  const trait = getTraitById(traitId);
  if (!trait) return null;

  for (const tier of trait.tiers) {
    if (currentCount < tier.count) {
      return tier.count;
    }
  }

  return null; // Already at max tier
}

/**
 * Check if adding a champion would activate or upgrade a trait
 * @param currentChampions - Current champion names in composition
 * @param newChampion - Champion to potentially add
 * @returns Array of traits that would be activated or upgraded
 */
export function calculateTraitImpact(
  currentChampions: string[],
  newChampion: string
): { trait: Trait; oldTierIndex: number; newTierIndex: number }[] {
  const currentTraits = calculateActiveTraits(currentChampions);
  const newTraits = calculateActiveTraits([...currentChampions, newChampion]);

  const impacts: { trait: Trait; oldTierIndex: number; newTierIndex: number }[] = [];

  newTraits.forEach((newTrait) => {
    const oldTrait = currentTraits.find((t) => t.trait.id === newTrait.trait.id);
    const oldTierIndex = oldTrait ? oldTrait.tierIndex : -1;
    const newTierIndex = newTrait.tierIndex;

    if (newTierIndex > oldTierIndex) {
      impacts.push({
        trait: newTrait.trait,
        oldTierIndex,
        newTierIndex,
      });
    }
  });

  return impacts;
}

/**
 * Get trait statistics for the current board
 * @param championNames - Array of champion names
 * @returns Statistics object with trait counts
 */
export function getTraitStats(championNames: string[]): {
  totalTraits: number;
  activeTraits: number;
  origins: number;
  classes: number;
  unique: number;
} {
  const activeTraits = calculateActiveTraits(championNames);
  const activatedTraits = activeTraits.filter((t) => t.activeTier !== null);

  return {
    totalTraits: activeTraits.length,
    activeTraits: activatedTraits.length,
    origins: activeTraits.filter((t) => t.trait.type === "origin").length,
    classes: activeTraits.filter((t) => t.trait.type === "class").length,
    unique: activeTraits.filter((t) => t.trait.type === "unique").length,
  };
}

/**
 * Suggest champions to complete trait tiers
 * @param currentChampions - Current champion names in composition
 * @param traitId - Trait to complete
 * @returns Array of champion names that would help complete the trait
 */
export function suggestChampionsForTrait(
  currentChampions: string[],
  traitId: string
): string[] {
  const trait = getTraitById(traitId);
  if (!trait) return [];

  const activeTraits = calculateActiveTraits(currentChampions);
  const activeTrait = activeTraits.find((t) => t.trait.id === traitId);
  const currentCount = activeTrait ? activeTrait.count : 0;

  const nextTierCount = getNextTierCount(traitId, currentCount);
  if (!nextTierCount) return []; // Already at max tier

  // Return champions that have this trait but aren't in the current composition
  return trait.champions.filter((champ) => !currentChampions.includes(champ));
}

