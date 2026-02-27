// ============================================================================
// TIER STYLES CONFIGURATION - Centralized tier visual styling
// ============================================================================

export type TierLevel = "S Tier" | "A Tier" | "B Tier" | "C Tier";

export interface TierStyleConfig {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  glow: string;
  icon: string;
  badge: "primary" | "success" | "warning" | "default";
  gradientFrom: string;
}

export const tierStyles: Record<TierLevel, TierStyleConfig> = {
  "S Tier": {
    text: "text-[#d4af37]",
    bg: "bg-[#d4af37]",
    bgSoft: "bg-[#d4af37]/10",
    border: "border-l-4 border-[#d4af37]",
    glow: "shadow-[0_0_30px_rgba(212,175,55,0.3)]",
    icon: "I",
    badge: "primary",
    gradientFrom: "from-[#d4af37]/30",
  },
  "A Tier": {
    text: "text-[#e5e5e5]",
    bg: "bg-[#e5e5e5]",
    bgSoft: "bg-[#e5e5e5]/10",
    border: "border-l-4 border-[#e5e5e5]",
    glow: "shadow-[0_0_20px_rgba(229,229,229,0.2)]",
    icon: "II",
    badge: "warning",
    gradientFrom: "from-[#e5e5e5]/20",
  },
  "B Tier": {
    text: "text-[#b45309]",
    bg: "bg-[#b45309]",
    bgSoft: "bg-[#b45309]/10",
    border: "border-l-4 border-[#b45309]",
    glow: "shadow-[0_0_20px_rgba(180,83,9,0.2)]",
    icon: "III",
    badge: "default",
    gradientFrom: "from-[#b45309]/20",
  },
  "C Tier": {
    text: "text-[#7f1d1d]",
    bg: "bg-[#7f1d1d]",
    bgSoft: "bg-[#7f1d1d]/10",
    border: "border-l-4 border-[#7f1d1d]",
    glow: "shadow-[0_0_20px_rgba(127,29,29,0.2)]",
    icon: "IV",
    badge: "success",
    gradientFrom: "from-[#7f1d1d]/20",
  },
};

// Header background with gradient
export const getTierHeaderBg = (tier: TierLevel): string => {
  const colors = {
    "S Tier": "from-[#d4af37]/10 via-[#d4af37]/5 to-transparent",
    "A Tier": "from-[#e5e5e5]/10 via-[#e5e5e5]/5 to-transparent",
    "B Tier": "from-[#b45309]/10 via-[#b45309]/5 to-transparent",
    "C Tier": "from-[#7f1d1d]/10 via-[#7f1d1d]/5 to-transparent",
  };
  return `bg-gradient-to-r ${colors[tier]}`;
};

// Helper to safely get tier style (returns C Tier as fallback)
export const getTierStyle = (tier: string): TierStyleConfig => {
  return tierStyles[tier as TierLevel] || tierStyles["C Tier"];
};

// Check if a string is a valid tier
export const isValidTier = (tier: string): tier is TierLevel => {
  return tier in tierStyles;
};
