import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
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

// --- Types -------------------------------------------------------------------

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
  tags?: string | string[];
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
  initialExpandedSlug?: string;
}

// --- Constants ---------------------------------------------------------------

const tierOrder: TierLevel[] = ["S Tier", "A Tier", "B Tier", "C Tier"];

// --- Helpers -----------------------------------------------------------------

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

// --- Champion Avatar Row (compact preview) -----------------------------------

const ChampionAvatarRow = memo<{ board?: Board }>(({ board }) => {
  if (!board?.champions?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-500">
        Sin tablero cargado
      </div>
    );
  }

  const sorted = useMemo(
    () =>
      [...board.champions].sort(
        (a, b) => (championRarity[b.name] || 1) - (championRarity[a.name] || 1),
      ),
    [board.champions],
  );

  const visible = sorted.slice(0, 9);
  const hiddenCount = Math.max(0, sorted.length - visible.length);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((champ, i) => {
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
            key={`${champ.name}-${i}`}
            className={`h-9 w-9 md:h-10 md:w-10 rounded-full border-2 ${borderColor} overflow-hidden bg-slate-900 shadow-md`}
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
      {hiddenCount > 0 && (
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-900 px-2 text-xs font-semibold text-slate-300 md:h-10 md:min-w-10">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
});

// --- Inline Traits Display (React) ------------------------------------------

const TraitsDisplayReact = memo<{ champions: string[]; compact?: boolean }>(
  ({ champions, compact = false }) => {
    const [showAll, setShowAll] = useState(false);
    const activeTraits = useMemo(
      () => calculateActiveTraits(champions),
      [champions.join(",")],
    );

    if (activeTraits.length === 0) {
      return (
        <div className="p-3 bg-slate-800/30 rounded-lg text-center border border-white/10">
          <p className="text-slate-400 text-sm">
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
              ? "flex flex-col gap-2"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5"
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
                className={`group ${compact ? "py-1.5 px-2" : "p-2.5"} rounded-lg border border-white/10 flex items-center gap-2 ${activeTier ? "bg-slate-800/55" : "bg-slate-800/25 opacity-75"}`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`${compact ? "w-7 h-7" : "w-9 h-9"} rounded flex items-center justify-center`}
                    style={{ background: bgColor }}
                  >
                    {iconSrc && (
                      <div
                        className={
                          compact ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]"
                        }
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
                    className={`absolute -bottom-1 -right-1 ${compact ? "w-4 h-4 text-[9px]" : "w-[18px] h-[18px] text-[10px]"} flex items-center justify-center font-semibold rounded-full border border-slate-900 ${activeTier ? "bg-primary text-white" : "bg-slate-700 text-slate-300"}`}
                  >
                    {count}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm truncate ${activeTier ? "text-white" : "text-slate-300"}`}
                  >
                    {trait.name}
                  </p>
                  {!compact && (
                    <p className="text-[11px] text-slate-500 uppercase">
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
            className="mt-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            +{hiddenCount} más...
          </button>
        )}
        {showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="mt-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Mostrar menos
          </button>
        )}
      </div>
    );
  },
);

// --- Inline Core Items Display ----------------------------------------------

const CoreItemsDisplay = memo<{ items: CoreItem[] }>(({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const src = getImgSrc(itemAssets[item.name]);
        return (
          <div
            key={i}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/45"
          >
            <div className="w-11 h-11 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
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
              <p className="text-sm font-semibold text-white truncate">
                {item.name}
              </p>
              {item.description && (
                <p className="text-sm text-slate-400 leading-snug">
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

// --- Inline Augments Display ------------------------------------------------

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
    <div className="flex flex-col gap-2.5">
      {processedAugments.map((aug, i) => {
        const resolved = getAugment(aug.name);
        const imgSrc = resolved ? getImgSrc(resolved.image) : aug.icon || null;
        const tier = resolved?.tier || "silver";
        const colors = getAugmentTierColor(tier);
        return (
          <div
            key={i}
            className={`flex items-start gap-3 p-2.5 rounded-xl ${colors.bg}`}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
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
              <p className={`text-sm font-semibold truncate ${colors.text}`}>
                {aug.name}
              </p>
              <p className="text-xs uppercase tracking-[0.1em] text-slate-500">
                {tier}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// --- Expanded Detail Panel --------------------------------------------------

const ExpandedDetail = memo<{
  comp: Composition;
}>(({ comp }) => {
  const [showNames, setShowNames] = useState(true);
  const [copyText, setCopyText] = useState("Copiar codigo");
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
      setTimeout(() => setCopyText("Copiar codigo"), 2000);
    } catch {
      setCopyText("Error");
      setTimeout(() => setCopyText("Copiar codigo"), 2000);
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
      <div className="px-4 pb-5 pt-2 md:px-6 md:pb-6 space-y-5">
        {/* Board + Traits row */}
        {boardData && (
          <div className="bg-slate-900/75 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white flex items-center gap-2">
                <i className="fa-solid fa-chess-board text-primary text-xs" />
                Tablero final
              </h4>
              <label className="flex items-center gap-2 cursor-pointer select-none rounded-full bg-slate-800/70 px-3 py-1.5">
                <span className="text-xs text-slate-300">Nombres</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showNames}
                    onChange={(e) => setShowNames(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[19px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </div>
              </label>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-2xl p-3 md:p-4 bg-slate-950/35">
                <div className="w-full flex justify-center overflow-hidden">
                  <TFTBoardReact boardData={boardData} showNames={showNames} />
                </div>
              </div>
              {championsList.length > 0 && (
                <div className="px-4 pb-4 pt-3 xl:pt-4 bg-slate-900/65">
                  <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-[0.12em]">
                    Sinergias activas
                  </h4>
                  <TraitsDisplayReact champions={championsList} compact />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items + Augments + Strategy — dense 3-col grid on desktop, full width when only strategy */}
        <div
          className={`grid grid-cols-1 gap-4 ${(coreItemsData?.length || 0) + (augmentsData?.length || 0) > 0 ? "xl:grid-cols-3" : "xl:grid-cols-1"}`}
        >
          {/* Core Items */}
          {coreItemsData &&
            Array.isArray(coreItemsData) &&
            coreItemsData.length > 0 && (
              <div className="rounded-2xl bg-slate-900/70 p-4 md:p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-3 flex items-center gap-2">
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
              <div className="rounded-2xl bg-slate-900/70 p-4 md:p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-500 text-xs" />
                  Aumentos
                </h4>
                <AugmentsDisplay augments={augmentsData} />
              </div>
            )}

          {/* Strategy (description + gameplay merged) */}
          {(descriptionHtml || gameplayHtml) && (
            <div
              className={`rounded-2xl bg-slate-900/70 p-4 md:p-5 space-y-4 ${(coreItemsData?.length || 0) + (augmentsData?.length || 0) === 0 ? "xl:col-span-1" : ""}`}
            >
              {descriptionHtml && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-lightbulb text-yellow-500 text-xs" />
                    Cuando jugarla
                  </h4>
                  <div
                    className="text-slate-300 text-[15px] leading-7 prose prose-invert max-w-none [&_b]:text-primary [&_b]:font-semibold [&_img]:inline [&_img]:mx-0.5"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                </div>
              )}
              {gameplayHtml && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-white mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-gamepad text-blue-500 text-xs" />
                    Modo de juego
                  </h4>
                  <div
                    className="text-slate-300 text-[15px] leading-7 prose prose-invert max-w-none [&_b]:text-primary [&_b]:font-semibold [&_img]:inline [&_img]:mx-0.5"
                    dangerouslySetInnerHTML={{ __html: gameplayHtml }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {comp.compCode ? (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
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
            href={`/compositions/${encodeURIComponent(comp.slug)}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/70 text-sm text-slate-300 hover:text-white transition-colors"
          >
            Ver en listado
            <i className="fa-solid fa-arrow-right text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
});

// --- Compact Composition Row ------------------------------------------------

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
    <article
      id={`comp-${comp.slug}`}
      className={`overflow-hidden rounded-2xl transition-all duration-300 ${
        isExpanded
          ? "bg-slate-900/95 shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
          : "bg-slate-900/60 hover:bg-slate-900/80"
      }`}
    >
      <button
        onClick={handleClick}
        aria-expanded={isExpanded}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="p-4 md:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isExpanded
                      ? "bg-primary/20 text-primary"
                      : "bg-slate-800/85 text-slate-400"
                  }`}
                >
                  <i
                    className={`fa-solid fa-chevron-right text-xs transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-lg font-semibold text-white md:text-xl">
                      {comp.title}
                    </h4>
                    {comp.status === "draft" && (
                      <span className="inline-flex items-center rounded-md border border-amber-400/35 bg-amber-400/15 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-amber-300">
                        Preview
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium sm:hidden ${tierConfig.bgSoft} ${tierConfig.text}`}
                    >
                      {comp.tier}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Actualizado {updateTime}
                  </p>
                </div>
              </div>

              <span
                className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${tierConfig.bgSoft} ${tierConfig.text}`}
              >
                {comp.tier}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <ChampionAvatarRow board={boardData || undefined} />
            </div>

            <p className="text-xs text-slate-500 sm:text-sm">
              {isExpanded
                ? "Pulsa para ocultar detalle de esta composicion."
                : "Pulsa para abrir tablero, sinergias y guia completa."}
            </p>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-white/10">
          <ExpandedDetail comp={comp} />
        </div>
      )}
    </article>
  );
});

// --- Main CompositionList Component -----------------------------------------

export const CompositionList: React.FC<CompositionListProps> = ({
  compositions,
  initialExpandedSlug,
}) => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(
    initialExpandedSlug ?? null,
  );

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

  const selectedComp = useMemo(
    () =>
      initialExpandedSlug
        ? compositions.find((comp) => comp.slug === initialExpandedSlug)
        : null,
    [compositions, initialExpandedSlug],
  );

  const displayTierOrder = useMemo(() => {
    if (!selectedComp) return tierOrder;
    const selectedTier = selectedComp.tier as TierLevel;
    if (!tierOrder.includes(selectedTier)) return tierOrder;
    return [selectedTier, ...tierOrder.filter((tier) => tier !== selectedTier)];
  }, [selectedComp]);

  const openFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    if (initialExpandedSlug) return;

    const pathMatch = window.location.pathname.match(/^\/compositions\/([^/]+)\/?$/);
    const pathSlug = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get("comp");
    const hashSlug = window.location.hash
      ? window.location.hash.replace(/^#/, "").replace(/^comp-/, "")
      : null;
    const targetSlug = initialExpandedSlug || pathSlug || querySlug || hashSlug;
    if (!targetSlug) return;

    const exists = compositions.some((comp) => comp.slug === targetSlug);
    if (!exists) return;

    setExpandedSlug((prev) => (prev === targetSlug ? prev : targetSlug));

    const scrollToTarget = () => {
      const target = document.getElementById(`comp-${targetSlug}`);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return true;
      }
      return false;
    };

    if (!scrollToTarget()) {
      let tries = 0;
      const tick = () => {
        tries += 1;
        if (scrollToTarget() || tries > 20) return;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [compositions, initialExpandedSlug]);

  useLayoutEffect(() => {
    openFromUrl();
  }, [openFromUrl]);

  const handleToggle = useCallback((slug: string) => {
    setExpandedSlug((prev) => {
      const next = prev === slug ? null : slug;

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (next) {
          url.pathname = `/compositions/${encodeURIComponent(next)}`;
        } else {
          url.pathname = "/compositions";
        }
        url.search = "";
        url.hash = "";

        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }

      return next;
    });
  }, []);

  const totalCompositions = compositions.length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-800/70 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Resumen del meta
            </p>
            <h2 className="mt-2 text-2xl font-display text-white md:text-3xl">
              Explora composiciones por tier
            </h2>
            <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300">
              Abre cualquier composicion para ver tablero final, sinergias y
              plan de juego en una vista clara.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <i className="fa-solid fa-layer-group text-xs" />
            {totalCompositions} composiciones activas
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tierOrder.map((tier) => {
            const tieredComps = compositionsByTier[tier] || [];
            const config = tierStyles[tier];
            const sectionId = tier.toLowerCase().replace(" ", "-");
            return (
              <a
                key={tier}
                href={`#${sectionId}`}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${tieredComps.length > 0 ? "bg-slate-800/70 text-white hover:bg-slate-700/70" : "bg-slate-900/60 text-slate-500"}`}
              >
                <span>{config.icon}</span>
                <span>{tier}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${config.bgSoft} ${config.text}`}
                >
                  {tieredComps.length}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {displayTierOrder.map((tier) => {
        const rawTieredComps = compositionsByTier[tier] || [];
        const tieredComps =
          selectedComp && tier === selectedComp.tier
            ? [
                ...rawTieredComps.filter((comp) => comp.slug === selectedComp.slug),
                ...rawTieredComps.filter((comp) => comp.slug !== selectedComp.slug),
              ]
            : rawTieredComps;
        if (tieredComps.length === 0) return null;

        const config = tierStyles[tier];
        const sectionId = tier.toLowerCase().replace(" ", "-");

        return (
          <section
            key={tier}
            id={sectionId}
            className="relative overflow-hidden rounded-3xl bg-slate-900/45 p-3 md:p-4 backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <header
              className={`mb-4 rounded-2xl px-4 py-3 ${getTierHeaderBg(tier)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/70 text-xl">
                    {config?.icon || ""}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-bold tracking-wide ${config?.text || "text-slate-300"}`}
                    >
                      {tier}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {tieredComps.length} composicion
                      {tieredComps.length !== 1 ? "es" : ""} en este tier
                    </p>
                  </div>
                </div>
                <div
                  className={`hidden sm:flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${config?.bgSoft} ${config?.text}`}
                >
                  Prioridad {tier}
                </div>
              </div>
            </header>

            <div className="space-y-3">
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
          </section>
        );
      })}

      {compositions.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-slate-900/45">
          <i className="fa-solid fa-folder-open text-4xl text-slate-700 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
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
