// ============================================================================
// TIER STYLES CONFIGURATION - Centralized tier visual styling
// ============================================================================
// Usage: Import and use these configs for consistent tier colors across the app
//
// Tier colors:
// - S Tier: Purple (morado)
// - A Tier: Green (verde)
// - B Tier: Yellow (amarillo)
// - C Tier: Blue (azul)
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
    text: "text-purple-300",
    bg: "bg-purple-500",
    bgSoft: "bg-purple-500/30",
    border: "border-l-4 border-purple-500",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    icon: "👑",
    badge: "primary",
    gradientFrom: "from-purple-500/50",
  },
  "A Tier": {
    text: "text-yellow-300",
    bg: "bg-yellow-500",
    bgSoft: "bg-yellow-500/30",
    border: "border-l-4 border-yellow-500",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
    icon: "⭐",
    badge: "warning",
    gradientFrom: "from-yellow-500/50",
  },
  "B Tier": {
    text: "text-blue-300",
    bg: "bg-blue-500",
    bgSoft: "bg-blue-500/30",
    border: "border-l-4 border-blue-500",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    icon: "💎",
    badge: "default",
    gradientFrom: "from-blue-500/50",
  },
  "C Tier": {
    text: "text-green-300",
    bg: "bg-green-500",
    bgSoft: "bg-green-500/30",
    border: "border-l-4 border-green-500",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    icon: "🎯",
    badge: "success",
    gradientFrom: "from-green-500/50",
  },
};

// Header background with gradient
export const getTierHeaderBg = (tier: TierLevel): string => {
  const colors = {
    "S Tier": "from-purple-500/20 via-purple-500/10 to-transparent",
    "A Tier": "from-yellow-500/20 via-yellow-500/10 to-transparent",
    "B Tier": "from-blue-500/20 via-blue-500/10 to-transparent",
    "C Tier": "from-green-500/20 via-green-500/10 to-transparent",
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
