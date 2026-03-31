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
import { getCompositionPath } from "../../utils/compositionPaths";
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
  set?: string;
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
  if (typeof data !== "string") return data as T;
  try {
    if (data.trim() === "") return null;
    return JSON.parse(data);
  } catch (error) {
    console.warn("Failed to parse JSON field:", data, error);
    return null;
  }
}

const _allChampionNames = getChampionNames();
const _allItemNames = getItemNames();
const _allKeywords = _allItemNames.concat(_allChampionNames);
const _keywordReplacements: Map<string, { regex: RegExp; replacement: string }> = new Map();
for (const matchName of _allKeywords) {
  const imgSrc = _allChampionNames.includes(matchName)
    ? getImgSrc(championThumbs[matchName])
    : getImgSrc(itemAssets[matchName]);
  if (imgSrc) {
    _keywordReplacements.set(matchName, {
      regex: new RegExp(`\\b${matchName}\\b`, "gi"),
      replacement: `<b>${matchName}</b> <img src="${imgSrc}" alt="${matchName}" class="rounded-full aspect-square h-4 inline align-middle border border-[#292524]"/>`,
    });
  }
}
const _parseCache = new Map<string, string>();

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

  const cached = _parseCache.get(result);
  if (cached) return cached;

  const original = result;
  for (const [, { regex, replacement }] of _keywordReplacements) {
    result = result.replace(regex, replacement);
  }

  _parseCache.set(original, result);
  return result;
}

function getTraitColor(tierIndex: number, totalTiers: number): string {
  if (totalTiers === 1) return "#d4af37"; // Single tier -> Gold
  if (totalTiers === 2) return tierIndex === 0 ? "#b45309" : "#d4af37"; // Bronze, Gold
  if (tierIndex === 0) return "#b45309"; // Bronze
  if (tierIndex === 1) return "#a8a29e"; // Silver
  if (tierIndex === 2) return "#d4af37"; // Gold
  return "#7f1d1d"; // Prismatic / Max -> Dark Red / Magic
}

function getTraitBgClass(tierIndex: number, totalTiers: number): string {
  if (totalTiers === 1) return "rgba(212,175,55,0.1)"; 
  if (totalTiers === 2) return tierIndex === 0 ? "rgba(180,83,9,0.1)" : "rgba(212,175,55,0.1)";
  if (tierIndex === 0) return "rgba(180,83,9,0.1)"; 
  if (tierIndex === 1) return "rgba(168,162,158,0.1)"; 
  if (tierIndex === 2) return "rgba(212,175,55,0.1)"; 
  return "rgba(127,29,29,0.15)";
}

// --- Champion Avatar Row (compact preview) -----------------------------------

const ChampionAvatarRow = memo<{ board?: Board }>(({ board }) => {
  if (!board?.champions?.length) {
    return (
      <div className="border border-dashed border-[#292524] bg-[#0c0a09]/50 px-3 py-2 text-xs uppercase tracking-widest text-[#a8a29e] text-center">
        El tablero está vacío
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
          rarity >= 5 ? "border-[#d4af37]"
            : rarity >= 4 ? "border-[#7f1d1d]"
            : rarity >= 3 ? "border-[#60a5fa]"
            : rarity >= 2 ? "border-[#4ade80]"
            : "border-[#57534e]";
        return (
          <div
            key={`${champ.name}-${i}`}
            className={`h-10 w-10 md:h-12 md:w-12 border ${borderColor} overflow-hidden bg-[#0c0a09] relative filter grayscale-[20%] hover:grayscale-0 transition-all duration-300`}
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
            <div className="absolute inset-0 border border-white/5 pointer-events-none"></div>
          </div>
        );
      })}
      {hiddenCount > 0 && (
        <span className="inline-flex h-10 min-w-10 items-center justify-center border border-[#292524] bg-[#1c1917] px-2 text-xs font-serif italic text-[#a8a29e] md:h-12 md:min-w-12">
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
        <div className="p-3 bg-[#1c1917]/30 text-center border border-[#292524]">
          <p className="text-[#a8a29e] text-xs uppercase tracking-widest">
            Sinergias Ocultas
          </p>
        </div>
      );
    }

    const highlighted = activeTraits.filter((t) => t.activeTier);
    const inactive = activeTraits.filter((t) => !t.activeTier);
    const visibleTraits = showAll ? activeTraits : highlighted;
    const hiddenCount = inactive.length;

    return (
      <div>
        <div className={compact ? "flex flex-col gap-2" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"}>
          {visibleTraits.map(({ trait, count, activeTier, tierIndex }) => {
            const iconSrc = getImgSrc(trait.icon);
            const color = activeTier ? getTraitColor(tierIndex, trait.tiers.length) : "#57534e";
            const bgColor = activeTier ? getTraitBgClass(tierIndex, trait.tiers.length) : "rgba(87,83,78,0.1)";

            return (
              <div
                key={trait.id}
                className={`group ${compact ? "py-2 px-3" : "p-3"} border border-[#292524] flex items-center gap-3 ${activeTier ? "bg-[#1c1917]" : "bg-[#0c0a09] opacity-60"} hover:border-[#d4af37]/30 transition-colors`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`${compact ? "w-8 h-8" : "w-10 h-10"} flex items-center justify-center border border-white/5`}
                    style={{ background: bgColor }}
                  >
                    {iconSrc && (
                      <div
                        className={compact ? "w-5 h-5" : "w-6 h-6"}
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
                    className={`absolute -bottom-1 -right-1 ${compact ? "w-4 h-4 text-[9px]" : "w-5 h-5 text-[10px]"} flex items-center justify-center font-serif border border-[#0c0a09] ${activeTier ? "bg-[#d4af37] text-[#0c0a09]" : "bg-[#292524] text-[#a8a29e]"}`}
                  >
                    {count}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-serif text-base tracking-wide truncate ${activeTier ? "text-[#f5f5f4]" : "text-[#a8a29e]"}`}>
                    {trait.name}
                  </p>
                  {!compact && (
                    <p className="text-[9px] tracking-[0.2em] text-[#a8a29e] uppercase mt-0.5">
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
            className="mt-4 text-[10px] tracking-[0.2em] uppercase font-bold text-[#d4af37] hover:text-[#f5f5f4] transition-colors border-b border-[#d4af37]/30 pb-1"
          >
            Revelar {hiddenCount} Sinergias Menores
          </button>
        )}
        {showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="mt-4 text-[10px] tracking-[0.2em] uppercase font-bold text-[#d4af37] hover:text-[#f5f5f4] transition-colors border-b border-[#d4af37]/30 pb-1"
          >
            Ocultar Sinergias Menores
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
    <div className="space-y-3">
      {items.map((item, i) => {
        const src = getImgSrc(itemAssets[item.name]);
        return (
          <div key={i} className="flex items-start gap-4 p-3 bg-[#0c0a09] border border-[#292524] hover:border-[#d4af37]/20 transition-colors">
            <div className="w-12 h-12 bg-[#1c1917] overflow-hidden flex-shrink-0 border border-[#d4af37]/10 p-0.5">
              {src ? (
                <img src={src} alt={item.name} loading="lazy" className="w-full h-full object-cover filter contrast-125" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fa-solid fa-gem text-[#292524] text-sm" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="font-serif text-lg text-[#f5f5f4] leading-tight mb-1 truncate">{item.name}</p>
              {item.description && (
                <p className="text-xs text-[#a8a29e] leading-relaxed font-light">{item.description}</p>
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
  if (!augments || augments.length === 0) return null;

  const processedAugments = augments
    .map((aug) => (typeof aug === "string" ? { name: aug, description: "" } : aug))
    .filter((aug) => aug && aug.name);

  if (processedAugments.length === 0) return null;

  return (
    <div className="space-y-3">
      {processedAugments.map((aug, i) => {
        const resolved = getAugment(aug.name);
        const imgSrc = resolved ? getImgSrc(resolved.image) : aug.icon || null;
        const tier = resolved?.tier || "silver";
        const borderColor = tier === 'prismatic' ? 'border-[#d4af37]' : tier === 'gold' ? 'border-[#a8a29e]' : 'border-[#57534e]';
        const textColor = tier === 'prismatic' ? 'text-[#d4af37]' : tier === 'gold' ? 'text-[#f5f5f4]' : 'text-[#a8a29e]';
        
        return (
          <div key={i} className={`flex items-start gap-4 p-3 bg-[#0c0a09] border ${borderColor} hover:bg-[#1c1917] transition-colors`}>
            <div className={`w-10 h-10 overflow-hidden flex-shrink-0 bg-[#1c1917] flex items-center justify-center p-1 rounded-sm`}>
              {imgSrc ? (
                <img src={imgSrc} alt={aug.name} loading="lazy" className="w-full h-full object-contain filter contrast-125" />
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles text-[#292524] text-xs" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`font-serif text-lg leading-tight truncate mb-0.5 ${textColor}`}>{aug.name}</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#57534e]">{tier}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// --- Expanded Detail Panel --------------------------------------------------

const ExpandedDetail = memo<{ comp: Composition }>(({ comp }) => {
  const [showNames, setShowNames] = useState(true);
  const [copyText, setCopyText] = useState("Copiar Código");
  const panelRef = useRef<HTMLDivElement>(null);

  const boardData = useMemo(() => parseJsonField<Board>(comp.board), [comp.board]);
  const coreItemsData = useMemo(() => parseJsonField<CoreItem[]>(comp.coreItems), [comp.coreItems]);
  const augmentsData = Array.isArray(comp.augments) ? comp.augments : null;

  const championsList = useMemo(() => (boardData?.champions ? boardData.champions.map((c) => c.name) : []), [boardData]);

  const descriptionHtml = useMemo(() => (comp.description ? parseImages(comp.description) : ""), [comp.description]);
  const gameplayHtml = useMemo(() => (comp.gameplayMode ? parseImages(comp.gameplayMode) : ""), [comp.gameplayMode]);

  const handleCopy = useCallback(async () => {
    if (!comp.compCode) return;
    try {
      await navigator.clipboard.writeText(comp.compCode);
      setCopyText("¡Sellado!");
      setTimeout(() => setCopyText("Copiar Código"), 2000);
    } catch {
      setCopyText("Error");
      setTimeout(() => setCopyText("Copiar Código"), 2000);
    }
  }, [comp.compCode]);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <div ref={panelRef} className="animate-fade-in-up bg-[#0c0a09] border-t border-[#292524]">
      <div className="px-6 py-8 md:px-10 space-y-12">
        {/* Board + Traits row */}
        {boardData && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="w-8 h-px bg-[#d4af37]"></span>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">La Formación</h4>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#a8a29e] group-hover:text-[#d4af37] transition-colors">Nombres</span>
                <div className="relative">
                  <input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-4 bg-[#1c1917] border border-[#292524] peer-focus:outline-none peer peer-checked:after:translate-x-[24px] peer-checked:after:bg-[#d4af37] after:content-[''] after:absolute after:top-0 after:left-0 after:bg-[#a8a29e] after:h-4 after:w-4 after:transition-all"></div>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-8">
              <div className="border border-[#292524] bg-[#1c1917] p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>
                <div className="w-full flex justify-center relative z-10">
                  <TFTBoardReact boardData={boardData} showNames={showNames} />
                </div>
              </div>
              {championsList.length > 0 && (
                <div className="border border-[#292524] bg-[#1c1917] p-6 relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/5 blur-xl pointer-events-none"></div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-6">Sinergias Activas</h4>
                  <TraitsDisplayReact champions={championsList} compact />
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-8 ${(coreItemsData?.length || 0) + (augmentsData?.length || 0) > 0 ? "xl:grid-cols-3" : "xl:grid-cols-1"}`}>
          {coreItemsData && coreItemsData.length > 0 && (
            <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-hammer text-[#d4af37] text-xs" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Artefactos</h4>
              </div>
              <CoreItemsDisplay items={coreItemsData} />
            </div>
          )}

          {augmentsData && augmentsData.length > 0 && (
            <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-bolt text-[#d4af37] text-xs" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Aumentos</h4>
              </div>
              <AugmentsDisplay augments={augmentsData} />
            </div>
          )}

          {(descriptionHtml || gameplayHtml) && (
            <div className={`border border-[#292524] bg-[#1c1917] p-6 md:p-8 space-y-10 ${(coreItemsData?.length || 0) + (augmentsData?.length || 0) === 0 ? "xl:col-span-1" : ""}`}>
              {descriptionHtml && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <i className="fa-solid fa-scroll text-[#d4af37] text-xs" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">El Plan</h4>
                  </div>
                  <div className="text-[#a8a29e] font-light text-base leading-relaxed max-w-none [&_b]:text-[#f5f5f4] [&_b]:font-medium [&_img]:inline [&_img]:mx-1 [&_img]:align-sub" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </div>
              )}
              {gameplayHtml && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <i className="fa-solid fa-chess-knight text-[#d4af37] text-xs" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Ejecución</h4>
                  </div>
                  <div className="text-[#a8a29e] font-light text-base leading-relaxed max-w-none [&_b]:text-[#f5f5f4] [&_b]:font-medium [&_img]:inline [&_img]:mx-1 [&_img]:align-sub" dangerouslySetInnerHTML={{ __html: gameplayHtml }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#292524]">
          {comp.compCode ? (
            <button onClick={handleCopy} className="inline-flex items-center gap-3 border border-[#d4af37]/30 px-6 py-3 text-[10px] tracking-[0.2em] font-bold uppercase text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0c0a09] transition-all">
              <i className={`fa-solid ${copyText === "¡Sellado!" ? "fa-check" : "fa-copy"} text-xs`} />
              {copyText}
            </button>
          ) : <div />}
          <button onClick={() => {
            const url = new URL(window.location.href);
            url.pathname = getCompositionPath(comp);
            url.search = "";
            url.hash = "";
            navigator.clipboard.writeText(url.toString());
            const btn = document.getElementById(`share-btn-${comp.slug}`);
            if (btn) {
              const originalHtml = btn.innerHTML;
              btn.innerHTML = '¡Enlace Copiado! <i class="fa-solid fa-check ml-2"></i>';
              setTimeout(() => btn.innerHTML = originalHtml, 2000);
            }
          }} id={`share-btn-${comp.slug}`} className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold uppercase text-[#a8a29e] hover:text-[#f5f5f4] transition-all group cursor-pointer">
            Compartir Composición
            <i className="fa-solid fa-share-nodes group-hover:-translate-y-0.5 group-hover:text-[#d4af37] transition-all" />
          </button>
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
  const boardData = useMemo(() => parseJsonField<Board>(comp.board), [comp.board]);
  const handleClick = useCallback(() => onToggle(comp.slug), [onToggle, comp.slug]);
  const updateTime = useMemo(() => getUpdateTime(comp), [comp.updatedAt, comp.createdAt]);

  return (
    <article id={`comp-${comp.slug}`} className={`group relative border ${isExpanded ? "border-[#d4af37] bg-[#1c1917]" : "border-[#292524] bg-[#0c0a09] hover:border-[#d4af37]/50"} transition-all duration-500 overflow-hidden mb-4`}>
      {isExpanded && <div className="absolute top-0 left-0 w-1 h-full bg-[#d4af37]"></div>}
      
      <button onClick={handleClick} aria-expanded={isExpanded} className="w-full text-left p-6 md:p-8 focus:outline-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <span className={`font-serif text-xl md:text-2xl lg:text-3xl tracking-wide ${isExpanded ? "text-[#d4af37]" : "text-[#f5f5f4] group-hover:text-[#d4af37]"} transition-colors`}>
                {comp.title}
              </span>
              {comp.status === "draft" && (
                <span className="border border-[#7f1d1d] text-[#7f1d1d] px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase">Boceto</span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase">
              <span className={tierConfig.text}>Rango: {comp.tier}</span>
              <span className="w-1 h-1 rounded-full bg-[#292524]"></span>
              <span className="text-[#57534e]">Forjado {updateTime}</span>
            </div>
          </div>

          <div className="flex-shrink-0 pt-2 md:pt-0">
            <ChampionAvatarRow board={boardData || undefined} />
          </div>

          <div className={`hidden md:flex w-12 h-12 border ${isExpanded ? "border-[#d4af37] text-[#d4af37]" : "border-[#292524] text-[#a8a29e] group-hover:border-[#d4af37]/30"} items-center justify-center transition-all duration-300 ml-4 shrink-0`}>
            <i className={`fa-solid fa-plus transition-transform duration-500 ${isExpanded ? "rotate-45" : ""}`} />
          </div>
        </div>
      </button>

      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          {isExpanded && <ExpandedDetail comp={comp} />}
        </div>
      </div>
    </article>
  );
});

// --- Main CompositionList Component -----------------------------------------

export const CompositionList: React.FC<CompositionListProps> = ({
  compositions,
  initialExpandedSlug,
}) => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(initialExpandedSlug ?? null);

  const compositionsByTier = useMemo(() => {
    return compositions.reduce((acc, comp) => {
      const tier = comp.tier;
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(comp);
      return acc;
    }, {} as Record<string, Composition[]>);
  }, [compositions]);

  const selectedComp = useMemo(() => initialExpandedSlug ? compositions.find((c) => c.slug === initialExpandedSlug) : null, [compositions, initialExpandedSlug]);

  const displayTierOrder = useMemo(() => {
    if (!selectedComp) return tierOrder;
    const selectedTier = selectedComp.tier as TierLevel;
    if (!tierOrder.includes(selectedTier)) return tierOrder;
    return [selectedTier, ...tierOrder.filter((t) => t !== selectedTier)];
  }, [selectedComp]);

  const openFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    if (initialExpandedSlug) return;

    const pathMatch = window.location.pathname.match(/^\/(?:(?:compositions)|(?:set[^/]+))\/([^/]+)\/?$/i);
    const pathSlug = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get("comp");
    const hashSlug = window.location.hash ? window.location.hash.replace(/^#/, "").replace(/^comp-/, "") : null;
    const targetSlug = initialExpandedSlug || pathSlug || querySlug || hashSlug;
    if (!targetSlug) return;

    if (!compositions.some((c) => c.slug === targetSlug)) return;

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
        const nextComposition = compositions.find((comp) => comp.slug === next);
        if (next && nextComposition) url.pathname = getCompositionPath(nextComposition);
        else if (next) url.pathname = `/compositions/${encodeURIComponent(next)}`;
        else url.pathname = "/compositions";
        url.search = "";
        url.hash = "";
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }
      return next;
    });
  }, [compositions]);

  if (compositions.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center border border-[#292524] bg-[#1c1917] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
        <i className="fa-solid fa-book-journal-whills text-6xl text-[#292524] mb-6"></i>
        <h3 className="font-serif text-3xl text-[#f5f5f4] mb-4">El Tomo está Vacío</h3>
        <p className="text-[#a8a29e] font-light max-w-md">
          Las runas están siendo descifradas. Vuelve pronto para descubrir las estrategias del parche actual.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <section className="border-b border-[#292524] pb-8">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {tierOrder.map((tier) => {
            const tieredComps = compositionsByTier[tier] || [];
            const config = tierStyles[tier];
            const sectionId = tier.toLowerCase().replace(" ", "-");
            return (
              <a
                key={tier}
                href={`#${sectionId}`}
                className={`group flex items-center gap-3 px-6 py-3 border ${tieredComps.length > 0 ? "border-[#292524] bg-[#0c0a09] hover:border-[#d4af37]" : "border-transparent text-[#57534e] pointer-events-none"} transition-colors`}
              >
                <span className={`font-serif text-xl ${tieredComps.length > 0 ? config.text : "text-[#57534e]"}`}>{config.icon}</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] ${tieredComps.length > 0 ? "text-[#f5f5f4]" : "text-[#57534e]"}`}>{tier}</span>
                <span className={`text-xs font-serif italic ${tieredComps.length > 0 ? "text-[#a8a29e]" : "text-[#292524]"}`}>({tieredComps.length})</span>
              </a>
            );
          })}
        </div>
      </section>

      <div className="space-y-20">
        {displayTierOrder.map((tier) => {
          const rawTieredComps = compositionsByTier[tier] || [];
          const tieredComps = selectedComp && tier === selectedComp.tier
            ? [
                ...rawTieredComps.filter((c) => c.slug === selectedComp.slug),
                ...rawTieredComps.filter((c) => c.slug !== selectedComp.slug),
              ]
            : rawTieredComps;
          if (tieredComps.length === 0) return null;

          const config = tierStyles[tier];
          const sectionId = tier.toLowerCase().replace(" ", "-");

          return (
            <section key={tier} id={sectionId} className="relative">
              <header className="mb-10 flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 border border-[#292524] bg-[#1c1917] flex items-center justify-center relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} opacity-10`}></div>
                  <span className={`font-serif text-3xl ${config.text}`}>{config.icon}</span>
                </div>
                <div>
                  <h3 className={`font-serif text-4xl mb-1 ${config.text}`}>{tier}</h3>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#a8a29e]">
                    {tieredComps.length} Estrategia{tieredComps.length !== 1 ? "s" : ""} Forjada{tieredComps.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="hidden md:block h-px bg-[#292524] flex-1 ml-8"></div>
              </header>

              <div>
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
      </div>
    </div>
  );
};
