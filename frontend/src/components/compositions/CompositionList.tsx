import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import type { Composition } from "../../lib/strapi";
import type {
  CompositionBoard,
  CompositionPriority,
  LegacyAugmentReference,
  LegacyCoreItem,
} from "../../tft/types";
import { renderRichTextWithSetMentions } from "../../tft/richText";
import { getSetRuntime, getSetLabel } from "../../tft/sets/registry";
import type { SetRuntime } from "../../tft/types";
import {
  tierStyles,
  type TierLevel,
  type TierStyleConfig,
} from "../../utils/tierStyles";
import { getCompositionListPath, getCompositionPath, normalizeCompositionSet } from "../../utils/compositionPaths";
import { TFTBoardReact } from "./TFTBoardReact";

dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(relativeTime);

interface CompositionListProps {
  compositions: Composition[];
  initialExpandedSlug?: string;
}

const tierOrder: TierLevel[] = ["S Tier", "A Tier", "B Tier", "C Tier"];

function getImgSrc(asset: unknown): string | null {
  if (!asset) return null;
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && asset !== null && "src" in asset) {
    const src = (asset as { src?: unknown }).src;
    return typeof src === "string" ? src : null;
  }
  return null;
}

function getUpdateTime(composition: Composition) {
  return dayjs(composition.updatedAt || composition.createdAt || composition.date)
    .utc()
    .fromNow();
}

function getCompositionSlugFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 2) {
    return null;
  }

  if (segments[0] === "compositions") {
    return normalizeCompositionSet(segments[1]) ? null : decodeURIComponent(segments[1]);
  }

  return normalizeCompositionSet(segments[0]) ? decodeURIComponent(segments[1]) : null;
}

function getCompositionListPathFromLocation(pathname: string, fallbackSet?: string | null): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "compositions") {
    return getCompositionListPath(normalizeCompositionSet(segments[1]));
  }

  const pathSet = normalizeCompositionSet(segments[0]);
  return getCompositionListPath(pathSet ?? fallbackSet);
}

const ChampionAvatarRow = memo(function ChampionAvatarRow({
  board,
  runtime,
}: {
  board?: CompositionBoard | null;
  runtime: SetRuntime;
}) {
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
        (a, b) =>
          (runtime.getChampionRarity(b.name) || 1) -
          (runtime.getChampionRarity(a.name) || 1),
      ),
    [board.champions, runtime],
  );

  const visible = sorted.slice(0, 9);
  const hiddenCount = Math.max(0, sorted.length - visible.length);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((champ, i) => {
        const src = getImgSrc(runtime.getChampionThumb(champ.name));
        const rarity = runtime.getChampionRarity(champ.name) || 1;
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

const TraitsDisplayReact = memo(function TraitsDisplayReact({
  champions,
  runtime,
  compact = false,
}: {
  champions: string[];
  runtime: SetRuntime;
  compact?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const activeTraits = useMemo(
    () => runtime.calculateActiveTraits(champions),
    [champions, runtime],
  );

  if (activeTraits.length === 0) {
    return (
      <div className="p-3 bg-[#1c1917]/30 text-center border border-[#292524]">
        <p className="text-[#a8a29e] text-xs uppercase tracking-widest">
          Sinergias no disponibles para este set
        </p>
      </div>
    );
  }

  const highlighted = activeTraits.filter((trait) => trait.activeTier);
  const inactive = activeTraits.filter((trait) => !trait.activeTier);
  const visibleTraits = showAll ? activeTraits : highlighted;

  const getTraitColor = (tierIndex: number, totalTiers: number) => {
    if (totalTiers === 1) return "#d4af37";
    if (totalTiers === 2) return tierIndex === 0 ? "#b45309" : "#d4af37";
    if (tierIndex === 0) return "#b45309";
    if (tierIndex === 1) return "#a8a29e";
    if (tierIndex === 2) return "#d4af37";
    return "#7f1d1d";
  };

  const getTraitBgClass = (tierIndex: number, totalTiers: number) => {
    if (totalTiers === 1) return "rgba(212,175,55,0.1)";
    if (totalTiers === 2) return tierIndex === 0 ? "rgba(180,83,9,0.1)" : "rgba(212,175,55,0.1)";
    if (tierIndex === 0) return "rgba(180,83,9,0.1)";
    if (tierIndex === 1) return "rgba(168,162,158,0.1)";
    if (tierIndex === 2) return "rgba(212,175,55,0.1)";
    return "rgba(127,29,29,0.15)";
  };

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
                    <img
                      src={iconSrc}
                      alt={trait.name}
                      loading="lazy"
                      className={compact ? "w-5 h-5 object-contain" : "w-6 h-6 object-contain"}
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
      {inactive.length > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-[10px] tracking-[0.2em] uppercase font-bold text-[#d4af37] hover:text-[#f5f5f4] transition-colors border-b border-[#d4af37]/30 pb-1"
        >
          Revelar {inactive.length} Sinergias Menores
        </button>
      )}
      {showAll && inactive.length > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-4 text-[10px] tracking-[0.2em] uppercase font-bold text-[#d4af37] hover:text-[#f5f5f4] transition-colors border-b border-[#d4af37]/30 pb-1"
        >
          Ocultar Sinergias Menores
        </button>
      )}
    </div>
  );
});

const LegacyItemsDisplay = memo(function LegacyItemsDisplay({
  items,
  runtime,
}: {
  items: LegacyCoreItem[];
  runtime: SetRuntime;
}) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const src = getImgSrc(runtime.getItemAsset(item.name));
        return (
          <div key={`${item.name}-${i}`} className="flex items-start gap-4 p-3 bg-[#0c0a09] border border-[#292524] hover:border-[#d4af37]/20 transition-colors">
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

const LegacyAugmentsDisplay = memo(function LegacyAugmentsDisplay({
  augments,
  runtime,
}: {
  augments: LegacyAugmentReference[];
  runtime: SetRuntime;
}) {
  if (!augments.length) return null;

  return (
    <div className="space-y-3">
      {augments.map((augment, i) => {
        const resolved = runtime.getAugment(augment.name);
        const imgSrc = getImgSrc(resolved?.image) || augment.icon || null;
        return (
          <div key={`${augment.name}-${i}`} className="flex items-start gap-4 p-3 bg-[#0c0a09] border border-[#57534e] hover:bg-[#1c1917] transition-colors">
            <div className="w-10 h-10 overflow-hidden flex-shrink-0 bg-[#1c1917] flex items-center justify-center p-1 rounded-sm">
              {imgSrc ? (
                <img src={imgSrc} alt={augment.name} loading="lazy" className="w-full h-full object-contain filter contrast-125" />
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles text-[#292524] text-xs" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="font-serif text-lg leading-tight truncate mb-0.5 text-[#f5f5f4]">{augment.name}</p>
              {augment.description && (
                <p className="text-xs text-[#a8a29e] leading-relaxed font-light">{augment.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

const PrioritiesDisplay = memo(function PrioritiesDisplay({
  priorities,
  runtime,
}: {
  priorities: CompositionPriority[];
  runtime: SetRuntime;
}) {
  if (!priorities.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {priorities.map((priority, i) => {
        const resolved = runtime.resolveEntity(
          priority.name,
          priority.type === "custom" ? undefined : priority.type,
        );
        const isChampionPriority =
          priority.type === "champion" || resolved?.type === "champion";
        const iconSrc = priority.icon || (
          isChampionPriority
            ? getImgSrc(runtime.getChampionThumb(resolved?.name || priority.name))
            : getImgSrc(resolved?.icon)
        );
        return (
          <div key={`${priority.name}-${i}`} className="flex items-start gap-4 p-3 bg-[#0c0a09] border border-[#292524] hover:border-[#d4af37]/20 transition-colors">
            <div className="w-11 h-11 bg-[#1c1917] overflow-hidden flex-shrink-0 border border-[#d4af37]/10 p-1 flex items-center justify-center">
              {iconSrc ? (
                <img src={iconSrc} alt={priority.name} loading="lazy" className="w-full h-full object-contain" />
              ) : (
                <i className="fa-solid fa-crosshairs text-[#d4af37] text-sm" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-[#f5f5f4] leading-tight">{priority.name}</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#a8a29e] mt-1">
                {priority.type || resolved?.type || "priority"}
              </p>
              {(priority.description || resolved?.description) && (
                <p className="text-xs text-[#a8a29e] leading-relaxed font-light mt-2">
                  {priority.description || resolved?.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

const DevelopmentDisplay = memo(function DevelopmentDisplay({
  composition,
  runtime,
}: {
  composition: Composition;
  runtime: SetRuntime;
}) {
  if (!composition.development.length) return null;

  return (
    <div className="space-y-4">
      {composition.development.map((entry, index) => (
        <div key={`${entry.phase}-${index}`} className="border border-[#292524] bg-[#0c0a09] p-4 md:p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center min-w-20 px-3 py-1 border border-[#d4af37]/30 text-[10px] tracking-[0.2em] uppercase text-[#d4af37] font-bold">
              {entry.phase}
            </span>
            {entry.title && (
              <p className="text-sm text-[#f5f5f4] font-medium">{entry.title}</p>
            )}
          </div>
          <div
            className="text-[#a8a29e] font-light text-base leading-relaxed max-w-none [&_b]:text-[#f5f5f4] [&_b]:font-medium [&_img]:inline [&_img]:mx-1 [&_img]:align-sub"
            dangerouslySetInnerHTML={{
              __html: renderRichTextWithSetMentions(entry.text, runtime),
            }}
          />
        </div>
      ))}
    </div>
  );
});

const ExpandedDetail = memo(function ExpandedDetail({ comp }: { comp: Composition }) {
  const [showNames, setShowNames] = useState(true);
  const [copyText, setCopyText] = useState("Copiar Código");
  const panelRef = useRef<HTMLDivElement>(null);
  const runtime = useMemo(() => getSetRuntime(comp.set), [comp.set]);
  const boardData = comp.board;
  const coreItemsData = comp.legacy?.coreItems || [];
  const legacyAugments = comp.legacy?.augments || [];
  const championsList = useMemo(
    () => (boardData?.champions ? boardData.champions.map((champion) => champion.name) : []),
    [boardData],
  );
  const tipsHtml = useMemo(
    () => renderRichTextWithSetMentions(comp.tips || comp.legacy?.description, runtime),
    [comp.tips, comp.legacy?.description, runtime],
  );
  const gameplayHtml = useMemo(
    () => renderRichTextWithSetMentions(comp.legacy?.gameplayMode, runtime),
    [comp.legacy?.gameplayMode, runtime],
  );

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
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div ref={panelRef} className="animate-fade-in-up bg-[#0c0a09] border-t border-[#292524]">
      <div className="px-6 py-8 md:px-10 space-y-12">
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
                  <input type="checkbox" checked={showNames} onChange={(event) => setShowNames(event.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-4 bg-[#1c1917] border border-[#292524] peer-focus:outline-none peer peer-checked:after:translate-x-[24px] peer-checked:after:bg-[#d4af37] after:content-[''] after:absolute after:top-0 after:left-0 after:bg-[#a8a29e] after:h-4 after:w-4 after:transition-all"></div>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-8">
              <div className="border border-[#292524] bg-[#1c1917] p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>
                <div className="w-full flex justify-center relative z-10">
                  <TFTBoardReact boardData={boardData} runtime={runtime} showNames={showNames} />
                </div>
              </div>
              {championsList.length > 0 && (
                <div className="border border-[#292524] bg-[#1c1917] p-6 relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/5 blur-xl pointer-events-none"></div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-6">Sinergias Activas</h4>
                  <TraitsDisplayReact champions={championsList} runtime={runtime} compact />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {comp.priorities.length > 0 && (
            <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8 xl:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-bullseye text-[#d4af37] text-xs" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Prioridades</h4>
              </div>
              <PrioritiesDisplay priorities={comp.priorities} runtime={runtime} />
            </div>
          )}

          {coreItemsData.length > 0 && (
            <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-hammer text-[#d4af37] text-xs" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Artefactos Legacy</h4>
              </div>
              <LegacyItemsDisplay items={coreItemsData} runtime={runtime} />
            </div>
          )}

          {legacyAugments.length > 0 && (
            <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-bolt text-[#d4af37] text-xs" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Aumentos Legacy</h4>
              </div>
              <LegacyAugmentsDisplay augments={legacyAugments} runtime={runtime} />
            </div>
          )}
        </div>

        {(tipsHtml || gameplayHtml || comp.development.length > 0) && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {(tipsHtml || gameplayHtml) && (
              <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8 space-y-10">
                {tipsHtml && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <i className="fa-solid fa-scroll text-[#d4af37] text-xs" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Consejos y Trucos</h4>
                    </div>
                    <div className="text-[#a8a29e] font-light text-base leading-relaxed max-w-none [&_b]:text-[#f5f5f4] [&_b]:font-medium [&_img]:inline [&_img]:mx-1 [&_img]:align-sub" dangerouslySetInnerHTML={{ __html: tipsHtml }} />
                  </div>
                )}
                {gameplayHtml && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <i className="fa-solid fa-chess-knight text-[#d4af37] text-xs" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Ejecución Legacy</h4>
                    </div>
                    <div className="text-[#a8a29e] font-light text-base leading-relaxed max-w-none [&_b]:text-[#f5f5f4] [&_b]:font-medium [&_img]:inline [&_img]:mx-1 [&_img]:align-sub" dangerouslySetInnerHTML={{ __html: gameplayHtml }} />
                  </div>
                )}
              </div>
            )}

            {comp.development.length > 0 && (
              <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-route text-[#d4af37] text-xs" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Desarrollo</h4>
                </div>
                <DevelopmentDisplay composition={comp} runtime={runtime} />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#292524]">
          {comp.compCode ? (
            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-3 border border-[#d4af37]/30 px-6 py-3 text-[10px] tracking-[0.2em] font-bold uppercase text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0c0a09] transition-all">
              <i className={`fa-solid ${copyText === "¡Sellado!" ? "fa-check" : "fa-copy"} text-xs`} />
              {copyText}
            </button>
          ) : <div />}
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.pathname = getCompositionPath(comp);
              url.search = "";
              url.hash = "";
              navigator.clipboard.writeText(url.toString());
              const button = document.getElementById(`share-btn-${comp.set}-${comp.slug}`);
              if (button) {
                const originalHtml = button.innerHTML;
                button.innerHTML = '¡Enlace Copiado! <i class="fa-solid fa-check ml-2"></i>';
                setTimeout(() => {
                  button.innerHTML = originalHtml;
                }, 2000);
              }
            }}
            id={`share-btn-${comp.set}-${comp.slug}`}
            className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold uppercase text-[#a8a29e] hover:text-[#f5f5f4] transition-all group cursor-pointer"
          >
            Compartir Composición
            <i className="fa-solid fa-share-nodes group-hover:-translate-y-0.5 group-hover:text-[#d4af37] transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
});

const CompositionRow = memo(function CompositionRow({
  comp,
  isExpanded,
  onToggle,
  tierConfig,
}: {
  comp: Composition;
  isExpanded: boolean;
  onToggle: (slug: string) => void;
  tierConfig: TierStyleConfig;
}) {
  const runtime = useMemo(() => getSetRuntime(comp.set), [comp.set]);
  const handleClick = useCallback(() => onToggle(comp.slug), [onToggle, comp.slug]);
  const updateTime = useMemo(
    () => getUpdateTime(comp),
    [comp.updatedAt, comp.createdAt, comp.date],
  );

  return (
    <article id={`comp-${comp.slug}`} className={`group relative border ${isExpanded ? "border-[#d4af37] bg-[#1c1917]" : "border-[#292524] bg-[#0c0a09] hover:border-[#d4af37]/50"} transition-all duration-500 overflow-hidden mb-4`}>
      {isExpanded && <div className="absolute top-0 left-0 w-1 h-full bg-[#d4af37]"></div>}
      <button type="button" onClick={handleClick} aria-expanded={isExpanded} className="w-full text-left p-6 md:p-8 focus:outline-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className={`font-serif text-xl md:text-2xl lg:text-3xl tracking-wide ${isExpanded ? "text-[#d4af37]" : "text-[#f5f5f4] group-hover:text-[#d4af37]"} transition-colors`}>
                {comp.title}
              </span>
              <span className="border border-[#292524] text-[#a8a29e] px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase">
                {getSetLabel(comp.set)}
              </span>
              {comp.status === "draft" && (
                <span className="border border-[#7f1d1d] text-[#7f1d1d] px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase">Boceto</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-[0.2em] uppercase">
              <span className={tierConfig.text}>Rango: {comp.tier}</span>
              <span className="w-1 h-1 rounded-full bg-[#292524]"></span>
              <span className="text-[#57534e]">Forjado {updateTime}</span>
            </div>
          </div>
          <div className="flex-shrink-0 pt-2 md:pt-0">
            <ChampionAvatarRow board={comp.board} runtime={runtime} />
          </div>
          <div className={`hidden md:flex w-12 h-12 border ${isExpanded ? "border-[#d4af37] text-[#d4af37]" : "border-[#292524] text-[#a8a29e] group-hover:border-[#d4af37]/30"} items-center justify-center transition-all duration-300 ml-4 shrink-0`}>
            <i className={`fa-solid fa-plus transition-transform duration-500 ${isExpanded ? "rotate-45" : ""}`} />
          </div>
        </div>
      </button>
      {isExpanded ? (
        <div className="overflow-hidden">
          <ExpandedDetail comp={comp} />
        </div>
      ) : null}
    </article>
  );
});

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

  const selectedComp = useMemo(
    () => initialExpandedSlug ? compositions.find((comp) => comp.slug === initialExpandedSlug) : null,
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

    const pathSlug = getCompositionSlugFromPath(window.location.pathname);
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get("comp");
    const hashSlug = window.location.hash ? window.location.hash.replace(/^#/, "").replace(/^comp-/, "") : null;
    const targetSlug = initialExpandedSlug || querySlug || pathSlug || hashSlug;
    if (!targetSlug) return;
    if (!compositions.some((composition) => composition.slug === targetSlug)) return;

    setExpandedSlug((previous) => (previous === targetSlug ? previous : targetSlug));

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
    setExpandedSlug((previous) => {
      const next = previous === slug ? null : slug;
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        const activeComposition = compositions.find(
          (composition) => composition.slug === (next ?? previous ?? initialExpandedSlug ?? ""),
        );

        url.pathname = getCompositionListPathFromLocation(
          url.pathname,
          activeComposition?.set,
        );
        url.search = next ? `?comp=${encodeURIComponent(next)}` : "";
        url.hash = "";
        window.history.replaceState({}, "", `${url.pathname}${url.search}`);
      }
      return next;
    });
  }, [compositions, initialExpandedSlug]);

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
            const tieredCompositions = compositionsByTier[tier] || [];
            const config = tierStyles[tier];
            const sectionId = tier.toLowerCase().replace(" ", "-");
            return (
              <a
                key={tier}
                href={`#${sectionId}`}
                className={`group flex items-center gap-3 px-6 py-3 border ${tieredCompositions.length > 0 ? "border-[#292524] bg-[#0c0a09] hover:border-[#d4af37]" : "border-transparent text-[#57534e] pointer-events-none"} transition-colors`}
              >
                <span className={`font-serif text-xl ${tieredCompositions.length > 0 ? config.text : "text-[#57534e]"}`}>{config.icon}</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] ${tieredCompositions.length > 0 ? "text-[#f5f5f4]" : "text-[#57534e]"}`}>{tier}</span>
                <span className={`text-xs font-serif italic ${tieredCompositions.length > 0 ? "text-[#a8a29e]" : "text-[#292524]"}`}>({tieredCompositions.length})</span>
              </a>
            );
          })}
        </div>
      </section>

      <div className="space-y-20">
        {displayTierOrder.map((tier) => {
          const rawTieredCompositions = compositionsByTier[tier] || [];
          const tieredCompositions = selectedComp && tier === selectedComp.tier
            ? [
                ...rawTieredCompositions.filter((composition) => composition.slug === selectedComp.slug),
                ...rawTieredCompositions.filter((composition) => composition.slug !== selectedComp.slug),
              ]
            : rawTieredCompositions;
          if (tieredCompositions.length === 0) return null;

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
                    {tieredCompositions.length} Estrategia{tieredCompositions.length !== 1 ? "s" : ""} Forjada{tieredCompositions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="hidden md:block h-px bg-[#292524] flex-1 ml-8"></div>
              </header>
              <div>
                {tieredCompositions.map((composition) => (
                  <CompositionRow
                    key={`${composition.set}-${composition.id}`}
                    comp={composition}
                    isExpanded={expandedSlug === composition.slug}
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














