// ============================================================================
// AUGMENTS DATA - TFT Set 16
// ============================================================================

// Tier-specific placeholder images
import SilverTierImg from "../assets/AugmentIcons/tier-silver.webp";
import GoldTierImg from "../assets/AugmentIcons/tier-gold.webp";
import PrismaticTierImg from "../assets/AugmentIcons/tier-prismatic.webp";

// ============================================================================
// TYPES
// ============================================================================

export type AugmentTier = "silver" | "gold" | "prismatic";
export type AugmentCategory = "general" | "hero" | "trait";

export interface Augment {
  id: string;
  name: string;
  tier: AugmentTier;
  category: AugmentCategory;
  description: string;
  image: any;
}

// ============================================================================
// TIER 1 AUGMENTS (SILVER)
// ============================================================================

export const tier1Augments: Augment[] = [
  {
    id: "air-axiom",
    name: "Air Axiom",
    tier: "silver",
    category: "general",
    description:
      "Gain an Air Hex. Champions within gain 20% Attack Speed and their damage 30% Sunders enemies for 5 seconds.",
    image: SilverTierImg,
  },
  {
    id: "artillery-barrage",
    name: "Artillery Barrage",
    tier: "silver",
    category: "hero",
    description:
      "Gain a Rumble. Your strongest Rumble gains +7 Range and constantly fires missiles at enemies, increased with Attack Speed.",
    image: SilverTierImg,
  },
  {
    id: "backup-bows",
    name: "Backup Bows",
    tier: "silver",
    category: "general",
    description:
      "Gain a Recurve Bow. After your team attacks 1200 times, gain 2 more.",
    image: SilverTierImg,
  },
  {
    id: "boxing-lessons",
    name: "Boxing Lessons",
    tier: "silver",
    category: "general",
    description:
      "Your team gains 30 Health for each ally that starts combat in the front row.",
    image: SilverTierImg,
  },
  {
    id: "carve-a-path",
    name: "Carve A Path",
    tier: "silver",
    category: "general",
    description:
      "Gain a B.F. Sword. After your units deal 70,000 physical damage, gain 2 more.",
    image: SilverTierImg,
  },
  {
    id: "continuous-conjuration",
    name: "Continuous Conjuration",
    tier: "silver",
    category: "general",
    description:
      "Gain a Needlessly Large Rod. After your units deal 40,000 magic damage, gain 2 more.",
    image: SilverTierImg,
  },
  {
    id: "critical-success",
    name: "Critical Success",
    tier: "silver",
    category: "general",
    description:
      "Gain a Sparring Glove. After your champions critical strike 400 times, gain 2 more.",
    image: SilverTierImg,
  },
  {
    id: "earth-axiom",
    name: "Earth Axiom",
    tier: "silver",
    category: "general",
    description:
      "Gain an Earth Hex. Champions within gain 25 Armor and Magic Resist. At 50% Health, they Stun enemies within 2 hexes for 1.5 seconds.",
    image: SilverTierImg,
  },
  {
    id: "extra-buckles",
    name: "Extra Buckles",
    tier: "silver",
    category: "general",
    description:
      "Gain a Giant's Belt. After your team takes 100,000 damage, gain 2 more.",
    image: SilverTierImg,
  },
  {
    id: "fire-axiom",
    name: "Fire Axiom",
    tier: "silver",
    category: "general",
    description:
      "Gain a Fire Hex. Champions within gain 15% Attack Damage and Ability Power. Their damage 1% Burns and 33% Wounds for 6 seconds.",
    image: SilverTierImg,
  },
  {
    id: "flowing-tears",
    name: "Flowing Tears",
    tier: "silver",
    category: "general",
    description:
      "Gain a Tear of the Goddess. After your team spends 7,500 mana, gain 2 more.",
    image: SilverTierImg,
  },
  {
    id: "focused-fire",
    name: "Focused Fire",
    tier: "silver",
    category: "general",
    description:
      "Your team gains 5% Attack Damage. Gain 5% more every 4 seconds.",
    image: SilverTierImg,
  },
  {
    id: "four-score",
    name: "Four Score",
    tier: "silver",
    category: "general",
    description: "Gain 3 random 4-cost champions.",
    image: SilverTierImg,
  },
  {
    id: "leap-of-faith",
    name: "Leap of Faith",
    tier: "silver",
    category: "hero",
    description:
      "Gain an Illaoi. Your strongest Illaoi becomes a Fighter. Her ability is replaced with an airborne slam that's recast when she kills her target.",
    image: SilverTierImg,
  },
  {
    id: "on-a-roll",
    name: "On A Roll",
    tier: "silver",
    category: "general",
    description:
      "Whenever you star up a champion that you fielded last combat, gain 3 free Shop rerolls. Gain 3 gold.",
    image: SilverTierImg,
  },
  {
    id: "slightly-magic-roll",
    name: "Slightly Magic Roll",
    tier: "silver",
    category: "general",
    description: "Roll a single die and gain a bonus depending on the result.",
    image: SilverTierImg,
  },
  {
    id: "small-grab-bag",
    name: "Small Grab Bag",
    tier: "silver",
    category: "general",
    description: "Gain 2 random components.",
    image: SilverTierImg,
  },
  {
    id: "twin-guardians",
    name: "Twin Guardians",
    tier: "silver",
    category: "general",
    description:
      "If you only have 2 allies in your first row, they gain 35 Armor and Magic Resist.",
    image: SilverTierImg,
  },
  {
    id: "water-axiom",
    name: "Water Axiom",
    tier: "silver",
    category: "general",
    description:
      "Gain a Water Hex. Champions within gain 3 Mana Regen. Their damage 30% Shreds enemies for 5 seconds.",
    image: SilverTierImg,
  },
  {
    id: "wood-axiom",
    name: "Wood Axiom",
    tier: "silver",
    category: "general",
    description:
      "Gain a Wood Hex. Champions within gain 12% max Health. After combat, they permanently gain 30 Health.",
    image: SilverTierImg,
  },
];

// ============================================================================
// TIER 2 AUGMENTS (GOLD)
// ============================================================================

export const tier2Augments: Augment[] = [
  {
    id: "3-threes",
    name: "3 Threes",
    tier: "gold",
    category: "general",
    description: "Gain 3 random 2-star 3-cost champions and 6 gold.",
    image: GoldTierImg,
  },
  {
    id: "advanced-loan",
    name: "Advanced Loan",
    tier: "gold",
    category: "general",
    description: "Get 25 Gold. Your next augment is one tier lower.",
    image: GoldTierImg,
  },
  {
    id: "advanced-loan-plus",
    name: "Advanced Loan Plus",
    tier: "gold",
    category: "general",
    description: "Get 35 Gold. Your next augment is one tier lower.",
    image: GoldTierImg,
  },
  {
    id: "arcane-viktor-y",
    name: "Arcane Viktor-y",
    tier: "gold",
    category: "general",
    description:
      "10 seconds into combat, stun the enemy team for 1.5 seconds. Repeat this 28 seconds into combat.",
    image: GoldTierImg,
  },
  {
    id: "bandle-bounty",
    name: "Bandle Bounty",
    tier: "gold",
    category: "trait",
    description:
      "For every Yordle you've unlocked or unlock, gain 6 gold. The Bandle Paths reveal a secret Yordle 10.",
    image: GoldTierImg,
  },
  {
    id: "birthday-reunion",
    name: "Birthday Reunion",
    tier: "gold",
    category: "general",
    description:
      "Gain a random 2-star 2 cost. At Level 6, gain a random component. At Level 9, gain a random 2-star 5 cost.",
    image: GoldTierImg,
  },
  {
    id: "blood-offering",
    name: "Blood Offering",
    tier: "gold",
    category: "general",
    description:
      "Gain a Bloodthirster. Combat Start: Allies holding Bloodthirster lose 20% Health but gain 10% AD and a 25% Health shield.",
    image: GoldTierImg,
  },
  {
    id: "bodyguard-training",
    name: "Bodyguard Training",
    tier: "gold",
    category: "general",
    description:
      "Your champions gain 10 Armor and Magic Resist, increased by 3 per player level.",
    image: GoldTierImg,
  },
  {
    id: "bringer-of-ruin",
    name: "Bringer of Ruin",
    tier: "gold",
    category: "trait",
    description:
      "Every 2 takedowns Atakhan scores permanently grants him 3% Attack Speed and 15 max Health.",
    image: GoldTierImg,
  },
  {
    id: "chaos-magic",
    name: "Chaos Magic",
    tier: "gold",
    category: "trait",
    description:
      "Arcanists gain 1 Mana Regen. After every 150 Mana is spent, a magical effect hits the board: Fireball, Magic Missiles, or Healing Wave.",
    image: GoldTierImg,
  },
  {
    id: "darkwills-invasion",
    name: "Darkwill's Invasion",
    tier: "gold",
    category: "trait",
    description:
      "Your team gains 13% Damage Amp, increased to 18% if the Noxus trait is active.",
    image: GoldTierImg,
  },
  {
    id: "defense-of-the-placidium",
    name: "Defense of the Placidium",
    tier: "gold",
    category: "trait",
    description:
      "Your team gains 10% Durability, increased to 13% if the Ionia trait is active.",
    image: GoldTierImg,
  },
  {
    id: "early-learnings",
    name: "Early Learnings",
    tier: "gold",
    category: "general",
    description:
      "Your team gains 5% Attack Damage & Ability Power. This increases by 1% after each player combat. 1-cost champions gain double.",
    image: GoldTierImg,
  },
  {
    id: "epic-rolldown",
    name: "Epic Rolldown",
    tier: "gold",
    category: "general",
    description: "When you reach Level 8, gain 23 rerolls.",
    image: GoldTierImg,
  },
  {
    id: "evolve-and-overcome",
    name: "Evolve and Overcome",
    tier: "gold",
    category: "trait",
    description:
      "For every 4 enemies that Mutated Void allies takedown, gain 2 XP. Gain a Kog'Maw and a Cho'Gath.",
    image: GoldTierImg,
  },
  {
    id: "feed-the-flames",
    name: "Feed the Flames",
    tier: "gold",
    category: "general",
    description:
      "Get a Sunfire Cape. Your units gain 15% Omnivamp when attacking Burned enemies.",
    image: GoldTierImg,
  },
  {
    id: "gain-21-gold",
    name: "Gain 21 Gold",
    tier: "gold",
    category: "general",
    description: "Gain 21 gold.",
    image: GoldTierImg,
  },
  {
    id: "heart-of-steel",
    name: "Heart of Steel",
    tier: "gold",
    category: "general",
    description:
      "Gain a Steadfast Heart. For every 10 seconds of combat their holder survives, they grant an additional permanent 15 max Health.",
    image: GoldTierImg,
  },
  {
    id: "hexgate-travel",
    name: "Hexgate Travel",
    tier: "gold",
    category: "trait",
    description:
      "Whenever 3 Piltover modules trigger, gain a random Piltover unit that costs 1 to 3g. Gain a Caitlyn and Vi.",
    image: GoldTierImg,
  },
  {
    id: "indecision-i",
    name: "Indecision I",
    tier: "gold",
    category: "general",
    description:
      "After 4 rounds, choose an augment of the same tier to replace this augment. Gain 12 Gold now.",
    image: GoldTierImg,
  },
  {
    id: "indiscriminate-killer",
    name: "Indiscriminate Killer",
    tier: "gold",
    category: "general",
    description:
      "Gain a Giant Slayer. Your Giant Slayers gain their bonus against all enemies instead of just Tanks.",
    image: GoldTierImg,
  },
  {
    id: "infinity-protection",
    name: "Infinity Protection",
    tier: "gold",
    category: "general",
    description:
      "Gain 8 Gold now. On 3-7 Gain an Infinity Force. Infinity Force gives allies in the same row a 15% Health shield.",
    image: GoldTierImg,
  },
  {
    id: "kahunahuna",
    name: "Kahunahuna",
    tier: "gold",
    category: "general",
    description:
      "Every 5th attack deals bonus true damage equal to 200% of your Basic Attack Damage.",
    image: GoldTierImg,
  },
  {
    id: "late-game-scaling",
    name: "Late Game Scaling",
    tier: "gold",
    category: "general",
    description:
      "Gain 2 XP every round. Your 5-cost champions gain 20% Health and 20% Attack Speed.",
    image: GoldTierImg,
  },
  {
    id: "legion-of-threes",
    name: "Legion of Threes",
    tier: "gold",
    category: "general",
    description:
      "Gain a random Emblem. Your 3-cost champions and all allies equipped with an Emblem gain 200 Health and 20% Attack Speed.",
    image: GoldTierImg,
  },
  {
    id: "lifting-competition",
    name: "Lifting Competition",
    tier: "gold",
    category: "trait",
    description:
      "At the start of each round, if the combined health of all your unique Bruisers is high enough, gain a reward and increase the threshold. Gain a Shen and a Sion.",
    image: GoldTierImg,
  },
  {
    id: "max-build",
    name: "Max Build",
    tier: "gold",
    category: "general",
    description:
      "Gain a Champion Duplicator and 7 free Shop rerolls. On Stage 6-1, gain these again.",
    image: GoldTierImg,
  },
  {
    id: "poison-pals",
    name: "Poison Pals",
    tier: "gold",
    category: "hero",
    description:
      "Gain a Singed and a 2-star Teemo. Every 4 seconds, Teemo fires a dart at Singed's target. When an enemy poisoned by Teemo dies, Singed gains Ability Power for the rest of combat.",
    image: GoldTierImg,
  },
  {
    id: "precision-and-grace",
    name: "Precision and Grace",
    tier: "gold",
    category: "general",
    description:
      "On takedown, your team dashes to their next target and gains 25% Attack Speed for 3 seconds.",
    image: GoldTierImg,
  },
  {
    id: "promised-protection",
    name: "Promised Protection",
    tier: "gold",
    category: "general",
    description:
      "Gain a Protector's Vow. Allies holding Protector's Vow gain 15% additional Mana from all sources.",
    image: GoldTierImg,
  },
  {
    id: "ruined-king",
    name: "Ruined King",
    tier: "gold",
    category: "hero",
    description:
      "Viego shares 30% of his passive with other Shadow Isles units. After collecting 100 souls, his Ability is replaced by a more powerful one. Gain a 2-star Viego.",
    image: GoldTierImg,
  },
  {
    id: "savings-account",
    name: "Savings Account",
    tier: "gold",
    category: "general",
    description:
      "After you earn 60 gold in interest, gain 30 gold. Your max interest is increased to 7. Gain 4 gold now.",
    image: GoldTierImg,
  },
  {
    id: "secrets-of-the-sands",
    name: "Secrets of the Sands",
    tier: "gold",
    category: "trait",
    description:
      "Gain 4 gold. Gain an Azir at Stage 3-5. Every time you unlock a Shuriman, gain an ideal item for them.",
    image: GoldTierImg,
  },
  {
    id: "seraphims-staff",
    name: "Seraphim's Staff",
    tier: "gold",
    category: "general",
    description:
      "Gain an Archangel's Staff. Archangel's Staff grants 2 additional Mana Regen if its holder has 90% or more Ability Power.",
    image: GoldTierImg,
  },
  {
    id: "silcos-revenge",
    name: "Silco's Revenge",
    tier: "gold",
    category: "trait",
    description:
      "Zaunites explode into Shimmer on death, dealing 8% of their max Health to 2 nearby enemies as magic damage and granting 2 nearby allies 30% Attack Speed for 4 seconds. Gain a Blitzcrank and an Ekko.",
    image: GoldTierImg,
  },
  {
    id: "solo-plate",
    name: "Solo Plate",
    tier: "gold",
    category: "general",
    description:
      "Gain a Gargoyle's Stoneplate. Combat start: Allies holding Gargoyle Stoneplate gain 10% max Health if they're the only one in their row.",
    image: GoldTierImg,
  },
  {
    id: "speedy-double-kill",
    name: "Speedy Double Kill",
    tier: "gold",
    category: "general",
    description:
      "Gain a Guinsoo's Rageblade. When 2 players are eliminated, gain 40 gold.",
    image: GoldTierImg,
  },
  {
    id: "spirit-of-redemption",
    name: "Spirit of Redemption",
    tier: "gold",
    category: "general",
    description:
      "Gain a Spirit Visage. Every 5 seconds, Spirit Visage heals allies within 2 hexes for 10% of their missing Health.",
    image: GoldTierImg,
  },
  {
    id: "spreading-roots",
    name: "Spreading Roots",
    tier: "gold",
    category: "general",
    description: "Gain 2 random emblems and 1 gold.",
    image: GoldTierImg,
  },
  {
    id: "spreading-roots-plus",
    name: "Spreading Roots+",
    tier: "gold",
    category: "general",
    description: "Gain 2 random emblems and gold.",
    image: GoldTierImg,
  },
  {
    id: "staffsmith",
    name: "Staffsmith",
    tier: "gold",
    category: "general",
    description:
      "Gain 2 random completed items that build from Needlessly Large Rod.",
    image: GoldTierImg,
  },
  {
    id: "swordsmith",
    name: "Swordsmith",
    tier: "gold",
    category: "general",
    description: "Gain 2 random completed items that build from B.F. Sword.",
    image: GoldTierImg,
  },
  {
    id: "the-golden-dragon",
    name: "The Golden Dragon",
    tier: "gold",
    category: "general",
    description:
      "Gain a Mogul's Mail. Champions holding Mogul's Mail take up 2 team slots but gain 500 Health and 20% Durability.",
    image: GoldTierImg,
  },
  {
    id: "timewinders",
    name: "Timewinders",
    tier: "gold",
    category: "hero",
    description:
      "Gain an Ekko. When he casts, he stores XP for the Chronokeeper trait. Enemies hit by Ekko's Ability are damaged by Zilean's bombs faster. After Ekko stores 12 XP, gain a Zilean.",
    image: GoldTierImg,
  },
  {
    id: "trials-of-twilight",
    name: "Trials of Twilight",
    tier: "gold",
    category: "hero",
    description:
      "Gain a Xin Zhao. Your strongest Xin Zhao constantly strikes nearby enemies and executes enemies. After 5 combats as a 3-star, unlock Zaahen who kills Xin Zhao and takes his items.",
    image: GoldTierImg,
  },
  {
    id: "unsealed-from-steel",
    name: "Unsealed From Steel",
    tier: "gold",
    category: "trait",
    description:
      "Choose 1 of 4 Darkin Weapons. Darkin Weapons are Artifacts that grant the Darkin trait.",
    image: GoldTierImg,
  },
  {
    id: "urf",
    name: "U.R.F.",
    tier: "gold",
    category: "general",
    description:
      "Gain a Spatula. Champions holding Spatula or Frying Pan items gain 15% Attack Speed and 2 Mana Regen.",
    image: GoldTierImg,
  },
  {
    id: "urfs-gambit",
    name: "Urf's Gambit",
    tier: "gold",
    category: "general",
    description:
      "If you win your next combat, gain a Spatula. If you lose, gain a Frying Pan. Gain a component anvil and 2 gold now.",
    image: GoldTierImg,
  },
  {
    id: "walk-the-true-path",
    name: "Walk The True Path",
    tier: "gold",
    category: "trait",
    description:
      "Gain 2 Lesser Champion Duplicators. Ionia 10 gains a Prismatic upgrade.",
    image: GoldTierImg,
  },
  {
    id: "warlords-honor",
    name: "Warlord's Honor",
    tier: "gold",
    category: "general",
    description:
      "Every round, champions on your team gain 5% Attack Damage and Ability Power, stacking up to 4 times.",
    image: GoldTierImg,
  },
  {
    id: "wild-growth",
    name: "Wild Growth",
    tier: "gold",
    category: "trait",
    description:
      "3-star Yordles become massive, move slowly, and gain 250 max Health & 20% Attack Damage and Ability Power. Gain a Rumble and Lulu.",
    image: GoldTierImg,
  },
  {
    id: "woven-magic",
    name: "Woven Magic",
    tier: "gold",
    category: "general",
    description:
      "Gain a component. Every 1650 Mana your team spends grants an additional component. (Max 3)",
    image: GoldTierImg,
  },
];

// ============================================================================
// TIER 3 AUGMENTS (PRISMATIC)
// ============================================================================

export const tier3Augments: Augment[] = [
  {
    id: "band-of-thieves-ii",
    name: "Band of Thieves II",
    tier: "prismatic",
    category: "general",
    description: "Gain 2 Thief's Gloves. After 8 player combats, gain another.",
    image: PrismaticTierImg,
  },
  {
    id: "band-of-thieves-ii-plus",
    name: "Band of Thieves II+",
    tier: "prismatic",
    category: "general",
    description: "Gain 2 Thief's Gloves. After 6 player combats, gain another.",
    image: PrismaticTierImg,
  },
  {
    id: "band-of-thieves-ii-plus-plus",
    name: "Band of Thieves II++",
    tier: "prismatic",
    category: "general",
    description: "Gain 2 Thief's Gloves. After 3 player combats, gain another.",
    image: PrismaticTierImg,
  },
  {
    id: "big-spender",
    name: "Big Spender",
    tier: "prismatic",
    category: "general",
    description:
      "Your team gain 0.5% Attack Damage and Ability Power for every 1 gold in champion value on your board.",
    image: PrismaticTierImg,
  },
  {
    id: "binary-airdrop",
    name: "Binary Airdrop",
    tier: "prismatic",
    category: "general",
    description:
      "Combat start: Champions holding 2 items gain a random 3rd completed item. Gain 2 random components now.",
    image: PrismaticTierImg,
  },
  {
    id: "chosen-wolves",
    name: "Chosen Wolves",
    tier: "prismatic",
    category: "hero",
    description:
      "Gain an Ambessa and a Kindred. When Kindred casts, Ambessa always gains their protection against death and gains Attack Damage while protected. When Ambessa casts, Wolf strikes all enemies hit, dealing reduced damage.",
    image: PrismaticTierImg,
  },
  {
    id: "comeback-story",
    name: "Comeback Story",
    tier: "prismatic",
    category: "general",
    description:
      "Your team gains 6 Health and 5% Attack Speed per missing player Health.",
    image: PrismaticTierImg,
  },
  {
    id: "commerce-core",
    name: "Commerce Core",
    tier: "prismatic",
    category: "general",
    description:
      "Gain 10 free Shop rerolls now and 5 every round for the rest of the game.",
    image: PrismaticTierImg,
  },
  {
    id: "component-heist",
    name: "Component Heist",
    tier: "prismatic",
    category: "general",
    description: "After 6 Player Combats, gain 1 of each component.",
    image: PrismaticTierImg,
  },
  {
    id: "construct-a-companion",
    name: "Construct a Companion",
    tier: "prismatic",
    category: "general",
    description: "The next 1-cost unit you buy is a 3-star. Gain 5 gold.",
    image: PrismaticTierImg,
  },
  {
    id: "cursed-crown",
    name: "Cursed Crown",
    tier: "prismatic",
    category: "general",
    description:
      "Gain +2 max team size and your team gains 4% Durability, but you take double player damage when you lose a player combat.",
    image: PrismaticTierImg,
  },
  {
    id: "dragonguards",
    name: "Dragonguards",
    tier: "prismatic",
    category: "hero",
    description:
      "Gain a Shyvana and a 2-star Jarvan IV. When Jarvan casts, Shyvana gains Shield. When Shyvana breathes fire, Jarvan jumps in and deals damage based on his Armor and Magic Resist. After every player combat, gain a Jarvan IV.",
    image: PrismaticTierImg,
  },
  {
    id: "forged-in-strength",
    name: "Forged in Strength",
    tier: "prismatic",
    category: "general",
    description:
      "Gain 1 random Artifact. When you drop below 30 Health, gain 3 more random Artifacts.",
    image: PrismaticTierImg,
  },
  {
    id: "growth-mindset",
    name: "Growth Mindset",
    tier: "prismatic",
    category: "general",
    description: "Gain 40 XP. Buying XP costs 3 instead of 4 gold.",
    image: PrismaticTierImg,
  },
  {
    id: "indecision-ii",
    name: "Indecision II",
    tier: "prismatic",
    category: "general",
    description:
      "After 4 rounds, open a new augment armory of the same tier to replace this augment. Gain 18 Gold now.",
    image: PrismaticTierImg,
  },
  {
    id: "just-hit",
    name: "Just Hit",
    tier: "prismatic",
    category: "general",
    description: "Gain a Champion Duplicator, 18 Shop rerolls, and 10 Gold.",
    image: PrismaticTierImg,
  },
  {
    id: "luxury-subscription",
    name: "Luxury Subscription",
    tier: "prismatic",
    category: "general",
    description:
      "Gain a package containing a 5-cost champion, a 2-star 1-cost champion, and 5 gold. At the start of the next 2 stages, gain the package again.",
    image: PrismaticTierImg,
  },
  {
    id: "min-max",
    name: "Min-Max",
    tier: "prismatic",
    category: "general",
    description: "Gain a Golden Item Remover and 4 random components.",
    image: PrismaticTierImg,
  },
  {
    id: "money-monsoon",
    name: "Money Monsoon",
    tier: "prismatic",
    category: "general",
    description: "Gain 7 gold now and every round for the rest of the game.",
    image: PrismaticTierImg,
  },
  {
    id: "prismatic-destiny-plus",
    name: "Prismatic Destiny +",
    tier: "prismatic",
    category: "general",
    description: "Gain a random Prismatic Augment and 12 gold.",
    image: PrismaticTierImg,
  },
  {
    id: "retribution",
    name: "Retribution",
    tier: "prismatic",
    category: "general",
    description:
      "Gain 2 Hand of Justice. Allies equipped with Hand of Justice can critically strike with their Abilities.",
    image: PrismaticTierImg,
  },
  {
    id: "sentinels-of-light",
    name: "Sentinels of Light",
    tier: "prismatic",
    category: "hero",
    description:
      "Gain a Lucian & Senna and a 2-star Vayne. Vayne fires additional bolts at enemies afflicted with Black Mist and on takedown, grants Attack Speed to Lucian & Senna.",
    image: PrismaticTierImg,
  },
  {
    id: "soul-awakening",
    name: "Soul Awakening",
    tier: "prismatic",
    category: "general",
    description:
      "Combat Start: Allies gain 2.5% Attack Damage and Ability Power per second for 10 seconds. At max stacks, deal 22% bonus true damage.",
    image: PrismaticTierImg,
  },
  {
    id: "sweet-treats",
    name: "Sweet Treats",
    tier: "prismatic",
    category: "general",
    description:
      "Gain an Artifact anvil. Your team gains 30 Health for each item equipped on champions.",
    image: PrismaticTierImg,
  },
  {
    id: "the-axiomata",
    name: "The Axiomata",
    tier: "prismatic",
    category: "general",
    description:
      "Gain 3 random elemental hex augments. Future augment rounds instead grant you 1 random elemental hex and gold based on the augment's tier.",
    image: PrismaticTierImg,
  },
  {
    id: "the-trait-tree",
    name: "The Trait Tree",
    tier: "prismatic",
    category: "general",
    description: "Gain 3 random emblems and 3 gold.",
    image: PrismaticTierImg,
  },
  {
    id: "the-world-runes",
    name: "The World Runes",
    tier: "prismatic",
    category: "trait",
    description:
      "Gain 2 emblems from random regions. Each player combat with 4+ Region traits active grants a World Rune. After collecting 9 World Runes gain a Radiant Refactor and 2 component anvils.",
    image: PrismaticTierImg,
  },
  {
    id: "walk-the-true-path-plus",
    name: "Walk The True Path+",
    tier: "prismatic",
    category: "trait",
    description:
      "Gain 2 Lesser Champion Duplicators and an Infinity Edge. Ionia 10 gains a Prismatic upgrade.",
    image: PrismaticTierImg,
  },
  {
    id: "we-stick-together",
    name: "We Stick Together",
    tier: "prismatic",
    category: "general",
    description:
      "Gain a random Emblem and a Completed item anvil. Allies that share a trait with that Emblem gain 20% Attack Speed.",
    image: PrismaticTierImg,
  },
  {
    id: "win-out",
    name: "Win Out",
    tier: "prismatic",
    category: "general",
    description:
      "When you reach level 9, immediately level to 10 and gain 10 free shop rerolls. Gain 10 XP now.",
    image: PrismaticTierImg,
  },
];

// ============================================================================
// ALL AUGMENTS COMBINED
// ============================================================================

export const allAugments: Augment[] = [
  ...tier1Augments,
  ...tier2Augments,
  ...tier3Augments,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get augments by tier
 */
export function getAugmentsByTier(tier: AugmentTier): Augment[] {
  return allAugments.filter((aug) => aug.tier === tier);
}

/**
 * Get augments by category
 */
export function getAugmentsByCategory(category: AugmentCategory): Augment[] {
  return allAugments.filter((aug) => aug.category === category);
}

/**
 * Get an augment by ID
 */
export function getAugmentById(id: string): Augment | undefined {
  return allAugments.find((aug) => aug.id === id);
}

/**
 * Get augment image
 */
export function getAugmentImage(augmentId: string): any {
  const augment = getAugmentById(augmentId);
  return augment?.image;
}

/**
 * Get all augment names
 */
export function getAllAugmentNames(): string[] {
  return allAugments.map((aug) => aug.name);
}

/**
 * Search augments by name
 */
export function searchAugmentsByName(query: string): Augment[] {
  const lowerQuery = query.toLowerCase();
  return allAugments.filter((aug) =>
    aug.name.toLowerCase().includes(lowerQuery),
  );
}
