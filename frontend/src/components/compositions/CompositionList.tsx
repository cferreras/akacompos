import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  memo,
} from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import {
  itemAssets,
  championRarity,
  getChampionNames,
  getItemNames,
} from "../../utils/assets";
import { championThumbs } from "../../utils/champion-thumbs";
import { calculateActiveTraits } from "../../utils/traits";
import { getAugment, getAugmentTierColor } from "../../utils/augments";
import {
  tierStyles,
  getTierHeaderBg,
  type TierLevel,
  type TierStyleConfig,
} from "../../utils/tierStyles";
import { TFTBoardReact } from "./TFTBoardReact";

dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(relativeTime);

// ─── Types ───────────────────────────────────────────────────────────────────

interface Champion {
  name: string;
  position: { row: number; col: number };
  items?: string[];
  stars?: number;
}

interface Board {
  champions: Champion[];
}

interface CoreItem {
  name: string;
  description: string;
}

interface AugmentData {
  name: string;
  description: string;
  icon: string;
}

interface Composition {
  id: number;
  title: string;
  slug: string;
  tier: string;
  tags: string | string[];
  cover?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: "draft" | "published";
  description?: any;
  gameplayMode?: any;
  compCode?: string;
  board?: Board;
  coreItems?: CoreItem[];
  augments?: AugmentData[];
  [key: string]: any;
}

interface CompositionListProps {
  compositions: Composition[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const tierOrder: TierLevel[] = ["S Tier", "A Tier", "B Tier", "C Tier"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getImgSrc(asset: any): string | null {
  if (!asset) return null;
  return typeof asset === "string" ? asset : asset.src || null;
}

function getUpdateTime(composition: Composition) {
  return dayjs(composition.updatedAt || composition.createdAt)
    .utc()
    .fromNow();
}

function parseJsonField<T>(data: any): T | null {
  if (!data) return null;

  // If it's already an object/array, return as-is
  if (typeof data !== "string") {
    return data as T;
  }

  // If it's a string, try to parse it as JSON
  if (typeof data === "string") {
    try {
      // Handle empty strings or just whitespace
      if (data.trim() === "") return null;

      // Try to parse as JSON
      return JSON.parse(data);
    } catch (error) {
      console.warn("Failed to parse JSON field:", data, error);
      return null;
    }
  }

  return data as T;
}

// Pre-compute keyword lists once at module level
const _allChampionNames = getChampionNames();
const _allItemNames = getItemNames();
const _allKeywords = _allItemNames.concat(_allChampionNames);

// Build replacement map once
const _keywordReplacements: Map<
  string,
  { regex: RegExp; replacement: string }
> = new Map();
for (const matchName of _allKeywords) {
  const imgSrc = _allChampionNames.includes(matchName)
    ? getImgSrc(championThumbs[matchName])
    : getImgSrc(itemAssets[matchName]);
  if (imgSrc) {
    _keywordReplacements.set(matchName, {
      regex: new RegExp(`\\b${matchName}\\b`, "gi"),
      replacement: `<b>${matchName}</b> <img src="${imgSrc}" alt="${matchName}" class="rounded-full aspect-square h-4 inline align-middle border border-slate-600"/>`,
    });
  }
}

// Cache parsed results to avoid re-computing
const _parseCache = new Map<string, string>();

/** Convert Strapi description (string or blocks) to plain text with inline images */
function parseImages(description: any): string {
  let result: string;
  if (typeof description === "string") {
    result = description;
  } else if (Array.isArray(description)) {
    result = description
      .map((block: any) => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || "").join("");
        }
        return "";
      })
      .join("\n");
  } else {
    return "";
  }

  // Check cache
  const cached = _parseCache.get(result);
  if (cached) return cached;

  const original = result;
  for (const [, { regex, replacement }] of _keywordReplacements) {
    result = result.replace(regex, replacement);
  }

  _parseCache.set(original, result);
  return result;
}

/** Trait tier color logic matching TraitsDisplay.astro */
function getTraitColor(tierIndex: number, totalTiers: number): string {
  if (totalTiers === 1) return "#f87171";
  if (totalTiers === 2) {
    return tierIndex === 0 ? "#d97706" : "#facc15";
  }
  if (tierIndex === 0) return "#d97706";
  if (tierIndex === 1) return "#cbd5e1";
  if (tierIndex === 2) return "#facc15";
  return "#e879f9";
}

function getTraitBgClass(tierIndex: number, totalTiers: number): string {
  if (totalTiers === 1) return "rgba(248,113,113,0.2)";
  if (totalTiers === 2) {
    return tierIndex === 0 ? "rgba(217,119,6,0.2)" : "rgba(250,204,21,0.2)";
  }
  if (tierIndex === 0) return "rgba(217,119,6,0.2)";
  if (tierIndex === 1) return "rgba(203,213,225,0.2)";
  if (tierIndex === 2) return "rgba(250,204,21,0.2)";
  return "rgba(232,121,249,0.2)";
}

// ─── Champion Avatar Row (compact preview) ───────────────────────────────────

const ChampionAvatarRow = memo<{ board?: Board }>(({ board }) => {
  if (!board?.champions?.length) return null;
  const sorted = useMemo(
    () =>
      [...board.champions].sort(
        (a, b) => (championRarity[b.name] || 1) - (championRarity[a.name] || 1),
      ),
    [board.champions],
  );
  return (
    <div className="flex items-center -space-x-1.5">
      {sorted.map((champ, i) => {
        const src = getImgSrc(championThumbs[champ.name]);
        const rarity = championRarity[champ.name] || 1;
        const borderColor =
          rarity >= 5
            ? "border-yellow-500"
            : rarity >= 4
              ? "border-purple-500"
              : rarity >= 3
                ? "border-blue-500"
                : rarity >= 2
                  ? "border-green-500"
                  : "border-slate-600";
        return (
          <div
            key={i}
            className={`w-7 h-7 rounded-full border-2 ${borderColor} overflow-hidden bg-slate-800 flex-shrink-0`}
            title={champ.name}
          >
            {src && (
              <img
                src={src}
                alt={champ.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

// ─── Inline Traits Display (React) ──────────────────────────────────────────

const TraitsDisplayReact = memo<{ champions: string[]; compact?: boolean }>(
  ({ champions, compact = false }) => {
    const [showAll, setShowAll] = useState(false);
    const activeTraits = useMemo(
      () => calculateActiveTraits(champions),
      [champions.join(",")],
    );

    if (activeTraits.length === 0) {
      return (
        <div className="p-3 bg-slate-800/30 rounded-lg text-center">
          <p className="text-slate-400 text-xs">
            No se encontraron traits activos
          </p>
        </div>
      );
    }

    // Split into active (highlighted) and inactive
    const highlighted = activeTraits.filter((t) => t.activeTier);
    const inactive = activeTraits.filter((t) => !t.activeTier);
    const visibleTraits = showAll ? activeTraits : highlighted;
    const hiddenCount = inactive.length;

    return (
      <div>
        <div
          className={
            compact
              ? "flex flex-col gap-1"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
          }
        >
          {visibleTraits.map(({ trait, count, activeTier, tierIndex }) => {
            const iconSrc = getImgSrc(trait.icon);
            const color = activeTier
              ? getTraitColor(tierIndex, trait.tiers.length)
              : "#64748b";
            const bgColor = activeTier
              ? getTraitBgClass(tierIndex, trait.tiers.length)
              : "rgba(100,116,139,0.2)";

            return (
              <div
                key={trait.id}
                className={`group ${compact ? "py-1 px-1.5" : "p-2"} rounded flex items-center gap-1.5 ${activeTier ? "bg-slate-800/40" : "bg-slate-800/20 opacity-60"}`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`${compact ? "w-6 h-6" : "w-8 h-8"} rounded flex items-center justify-center`}
                    style={{ background: bgColor }}
                  >
                    {iconSrc && (
                      <div
                        className={compact ? "w-4 h-4" : "w-5 h-5"}
                        style={{
                          maskImage: `url(${iconSrc})`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: `url(${iconSrc})`,
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          backgroundColor: color,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 ${compact ? "w-3.5 h-3.5 text-[9px]" : "w-4 h-4 text-[10px]"} flex items-center justify-center font-semibold rounded-full border border-slate-900 ${activeTier ? "bg-primary text-white" : "bg-slate-700 text-slate-400"}`}
                  >
                    {count}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${compact ? "text-sm" : "text-sm"} truncate ${activeTier ? "text-white" : "text-slate-400"}`}
                  >
                    {trait.name}
                  </p>
                  {!compact && (
                    <p className="text-[10px] text-slate-500 uppercase">
                      {trait.type}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {hiddenCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            +{hiddenCount} más...
          </button>
        )}
        {showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Mostrar menos
          </button>
        )}
      </div>
    );
  },
);

// ─── Inline Core Items Display ──────────────────────────────────────────────

const CoreItemsDisplay = memo<{ items: CoreItem[] }>(({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const src = getImgSrc(itemAssets[item.name]);
        return (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40"
          >
            <div className="w-9 h-9 rounded-lg border border-white/10 bg-slate-900 overflow-hidden flex-shrink-0">
              {src ? (
                <img
                  src={src}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fa-solid fa-gem text-slate-600 text-xs" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {item.name}
              </p>
              {item.description && (
                <p className="text-xs text-slate-400">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

// ─── Inline Augments Display ────────────────────────────────────────────────

const AugmentsDisplay = memo<{ augments: any[] }>(({ augments }) => {
  if (!augments || augments.length === 0) {
    return null;
  }

  // Handle both string names and object format
  const processedAugments = augments
    .map((aug) => {
      if (typeof aug === "string") {
        return { name: aug, description: "" };
      }
      return aug;
    })
    .filter((aug) => aug && aug.name);

  if (processedAugments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {processedAugments.map((aug, i) => {
        const resolved = getAugment(aug.name);
        const imgSrc = resolved ? getImgSrc(resolved.image) : aug.icon || null;
        const tier = resolved?.tier || "silver";
        const colors = getAugmentTierColor(tier);
        return (
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded-lg border ${colors.border}/30 ${colors.bg}`}
          >
            <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0 bg-slate-900 border border-white/5">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={aug.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fa-solid fa-wand-magic-sparkles text-slate-600 text-xs" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${colors.text}`}>
                {aug.name}
              </p>
              <p className="text-xs text-slate-500 capitalize">{tier}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// ─── Expanded Detail Panel ──────────────────────────────────────────────────

const ExpandedDetail = memo<{
  comp: Composition;
  onClose: () => void;
}>(({ comp, onClose }) => {
  const [showNames, setShowNames] = useState(true);
  const [copyText, setCopyText] = useState("Copiar código");
  const panelRef = useRef<HTMLDivElement>(null);

  // Parse JSON fields once with useMemo
  const boardData = useMemo(
    () => parseJsonField<Board>(comp.board),
    [comp.board],
  );
  const coreItemsData = useMemo(
    () => parseJsonField<CoreItem[]>(comp.coreItems),
    [comp.coreItems],
  );
  // Augments come as objects directly from Strapi API
  const augmentsData = Array.isArray(comp.augments) ? comp.augments : null;

  // Stable champions list
  const championsList = useMemo(
    () => (boardData?.champions ? boardData.champions.map((c) => c.name) : []),
    [boardData],
  );

  // Pre-parse description and gameplayMode HTML
  const descriptionHtml = useMemo(
    () => (comp.description ? parseImages(comp.description) : ""),
    [comp.description],
  );
  const gameplayHtml = useMemo(
    () => (comp.gameplayMode ? parseImages(comp.gameplayMode) : ""),
    [comp.gameplayMode],
  );

  const handleCopy = useCallback(async () => {
    if (!comp.compCode) return;
    try {
      await navigator.clipboard.writeText(comp.compCode);
      setCopyText("Copiado!");
      setTimeout(() => setCopyText("Copiar código"), 2000);
    } catch {
      setCopyText("Error");
      setTimeout(() => setCopyText("Copiar código"), 2000);
    }
  }, [comp.compCode]);

  // Scroll into view on mount
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <div
      ref={panelRef}
      className="animate-fadeInUp"
      style={{ animationDuration: "0.3s" }}
    >
      <div className="px-4 pb-3 pt-1 space-y-3">
        {/* Board + Traits row */}
        {boardData && (
          <div className="rounded-lg border border-white/5 bg-slate-800/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
              <h4 className="text-xs font-medium text-white flex items-center gap-1.5">
                <i className="fa-solid fa-chess-board text-primary text-[10px]" />
                Tablero Final
              </h4>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <span className="text-[10px] text-slate-400">Nombres</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showNames}
                    onChange={(e) => setShowNames(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
                </div>
              </label>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-start">
              <div className="flex justify-center overflow-x-auto p-3 lg:flex-shrink-0 lg:flex-grow">
                <TFTBoardReact boardData={boardData} showNames={showNames} />
              </div>
              {championsList.length > 0 && (
                <div className="px-3 pb-3 pt-1 border-t border-white/5 lg:border-t-0 lg:border-l lg:pt-3 lg:w-56 xl:w-64 lg:flex-shrink-0 lg:min-w-0">
                  <h4 className="text-sm font-medium text-white mb-1.5 uppercase tracking-wider">
                    Sinergias
                  </h4>
                  <TraitsDisplayReact champions={championsList} compact />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items + Augments + Strategy — dense 3-col grid on desktop, full width when only strategy */}
        <div className={`grid grid-cols-1 gap-4 ${(coreItemsData?.length || 0) + (augmentsData?.length || 0) > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Core Items */}
          {coreItemsData &&
            Array.isArray(coreItemsData) &&
            coreItemsData.length > 0 && (
              <div className="rounded-lg border border-white/5 bg-slate-800/30 p-4">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-gem text-purple-500 text-xs" />
                  Core Items
                </h4>
                <CoreItemsDisplay items={coreItemsData} />
              </div>
            )}

          {/* Augments */}
          {augmentsData &&
            Array.isArray(augmentsData) &&
            augmentsData.length > 0 && (
              <div className="rounded-lg border border-white/5 bg-slate-800/30 p-4">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-500 text-xs" />
                  Aumentos
                </h4>
                <AugmentsDisplay augments={augmentsData} />
              </div>
            )}

          {/* Strategy (description + gameplay merged) */}
          {(descriptionHtml || gameplayHtml) && (
            <div className={`rounded-lg border border-white/5 bg-slate-800/30 p-4 space-y-3 ${(coreItemsData?.length || 0) + (augmentsData?.length || 0) === 0 ? 'lg:col-span-1' : ''}`}>
              {descriptionHtml && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-lightbulb text-yellow-500 text-xs" />
                    Cuando jugarla
                  </h4>
                  <div
                    className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none [&_b]:text-primary [&_b]:font-semibold [&_img]:inline [&_img]:mx-0.5"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                </div>
              )}
              {gameplayHtml && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-gamepad text-blue-500 text-xs" />
                    Modo de juego
                  </h4>
                  <div
                    className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none [&_b]:text-primary [&_b]:font-semibold [&_img]:inline [&_img]:mx-0.5"
                    dangerouslySetInnerHTML={{ __html: gameplayHtml }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {comp.compCode ? (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-[11px] font-medium hover:bg-primary/30 transition-colors"
            >
              <i
                className={`fa-solid ${copyText === "Copiado!" ? "fa-check" : "fa-copy"} text-[10px]`}
              />
              {copyText}
            </button>
          ) : (
            <div />
          )}
          <a
            href={`/compositions/${comp.slug}`}
            className="text-[11px] text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
          >
            Ver pagina completa
            <i className="fa-solid fa-arrow-right text-[9px]" />
          </a>
        </div>
      </div>
    </div>
  );
});

// ─── Compact Composition Row ────────────────────────────────────────────────

const CompositionRow = memo<{
  comp: Composition;
  isExpanded: boolean;
  onToggle: (slug: string) => void;
  tierConfig: TierStyleConfig;
}>(({ comp, isExpanded, onToggle, tierConfig }) => {
  const boardData = useMemo(
    () => parseJsonField<Board>(comp.board),
    [comp.board],
  );

  const handleClick = useCallback(() => {
    onToggle(comp.slug);
  }, [onToggle, comp.slug]);

  const updateTime = useMemo(
    () => getUpdateTime(comp),
    [comp.updatedAt, comp.createdAt],
  );

  return (
    <div
      className={`transition-all duration-200 ${
        isExpanded ? "bg-slate-800/60 rounded-xl border border-white/5" : ""
      }`}
    >
      {/* Clickable Row */}
      <button
        onClick={handleClick}
        className={`w-full text-left group transition-all duration-200 ${
          isExpanded
            ? "rounded-t-xl"
            : "bg-slate-800/20 hover:bg-slate-800/40 rounded-xl"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          {/* Expand indicator */}
          <div
            className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
          >
            <i className="fa-solid fa-chevron-right text-xs text-slate-500 group-hover:text-slate-300" />
          </div>

          {/* Champion Avatars */}
          <div className="flex-shrink-0">
            <ChampionAvatarRow board={boardData || undefined} />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <h4 className="text-base font-semibold text-white truncate group-hover:text-primary transition-colors">
              {comp.title}
            </h4>

            {/* Draft badge */}
            {comp.status === "draft" && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded flex-shrink-0">
                PREVIEW
              </span>
            )}
          </div>

          {/* Update time */}
          <span className="text-sm text-slate-500 flex-shrink-0 hidden sm:block">
            {updateTime}
          </span>
        </div>
      </button>

      {/* Expanded Detail */}
      {isExpanded && <ExpandedDetail comp={comp} onClose={handleClick} />}
    </div>
  );
});

// ─── Main CompositionList Component ─────────────────────────────────────────

export const CompositionList: React.FC<CompositionListProps> = ({
  compositions,
}) => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const compositionsByTier = useMemo(() => {
    return compositions.reduce(
      (acc, comp) => {
        const tier = comp.tier;
        if (!acc[tier]) {
          acc[tier] = [];
        }
        acc[tier].push(comp);
        return acc;
      },
      {} as Record<string, Composition[]>,
    );
  }, [compositions]);

  // Stable callback that doesn't change between renders
  const handleToggle = useCallback((slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }, []);

  return (
    <div className="space-y-6">
      {/* Compositions by Tier */}
      {tierOrder.map((tier) => {
        const tieredComps = compositionsByTier[tier] || [];
        if (tieredComps.length === 0) return null;

        const config = tierStyles[tier];

        return (
          <div
            key={tier}
            id={tier.toLowerCase().replace(" ", "-")}
            className="relative"
          >
            {/* Tier Header */}
            <div
              className={`flex items-center gap-3 mb-3 ${getTierHeaderBg(tier)} ${config?.border || "border-l-4 border-slate-500"} rounded-r-xl py-2.5 px-4 backdrop-blur-sm`}
            >
              <span className="text-xl filter drop-shadow-lg">
                {config?.icon || ""}
              </span>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-base font-bold tracking-wide ${config?.text || "text-slate-300"}`}
                >
                  {tier}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${config?.bgSoft} ${config?.text}`}
                >
                  {tieredComps.length} comp
                  {tieredComps.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div
                className={`hidden sm:block flex-1 h-px ml-4 bg-gradient-to-r ${config?.gradientFrom} to-transparent`}
              />
            </div>

            {/* Composition Rows */}
            <div className="space-y-1.5">
              {tieredComps.map((comp) => (
                <CompositionRow
                  key={comp.id}
                  comp={comp}
                  isExpanded={expandedSlug === comp.slug}
                  onToggle={handleToggle}
                  tierConfig={config}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {compositions.length === 0 && (
        <div className="text-center py-16">
          <i className="fa-solid fa-folder-open text-4xl text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No hay composiciones disponibles
          </h3>
          <p className="text-slate-400 text-sm">
            Vuelve pronto para ver las composiciones del parche actual.
          </p>
        </div>
      )}
    </div>
  );
};
