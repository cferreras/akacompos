import React from "react";
import type { CompositionBoard } from "../../tft/types";
import type { SetRuntime } from "../../tft/types";

interface TFTBoardReactProps {
  boardData: CompositionBoard;
  runtime: SetRuntime;
  showNames?: boolean;
}

const borderColors: Record<string, string> = {
  purple: "#7f1d1d",
  blue: "#0284c7",
  yellow: "#d4af37",
  green: "#166534",
  gray: "#57534e",
  orange: "#b45309",
  red: "#991b1b",
  empty: "#1c1917",
};

function getImgSrc(asset: unknown): string | null {
  if (!asset) return null;
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && asset !== null && "src" in asset) {
    const src = (asset as { src?: unknown }).src;
    return typeof src === "string" ? src : null;
  }
  return null;
}

function getBorderColor(runtime: SetRuntime, name: string): string {
  const rarity = runtime.getChampionRarity(name);
  switch (rarity) {
    case 7: return "red";
    case 6: return "orange";
    case 5: return "yellow";
    case 4: return "purple";
    case 3: return "blue";
    case 2: return "green";
    case 1: return "gray";
    default: return "empty";
  }
}

const Stars: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 1) return null;
  return (
    <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
      <span style={{ color: "#d4af37", fontSize: "0.55rem", letterSpacing: "2px", background: "rgba(12,10,9,0.85)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, padding: "1px 4px", whiteSpace: "nowrap", backdropFilter: "blur(4px)" }}>
        {"★".repeat(count)}
      </span>
    </div>
  );
};

const HexCharacter: React.FC<{
  runtime: SetRuntime;
  champion?: string;
  borderColor: string;
  items: string[];
  stars: number;
  showName: boolean;
}> = ({ runtime, champion, borderColor, items, stars, showName }) => {
  const hexClip = "polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)";
  const color = borderColors[borderColor] || borderColors.empty;
  const imgSrc = champion ? getImgSrc(runtime.getChampionThumb(champion)) : null;
  const imgPos = champion ? runtime.getChampionImagePosition(champion) || "center" : "center";
  const validItems = items.slice(0, 3).filter((item) => Boolean(runtime.getItemAsset(item)));
  const nameLen = champion ? champion.length : 0;
  let fontSize = "calc(var(--hex-size) * 0.16)";
  if (nameLen > 12) fontSize = "calc(var(--hex-size) * 0.12)";
  else if (nameLen > 8) fontSize = "calc(var(--hex-size) * 0.14)";

  return (
    <div className="tft-hex-char group" style={{ position: "relative", width: "var(--hex-size)", height: "calc(var(--hex-size) + 12px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {champion && <Stars count={stars} />}
      <div style={{ position: "relative", width: "var(--hex-size)", height: "var(--hex-size)", clipPath: hexClip, background: color, padding: 1.5, flexShrink: 0, transition: "all 0.3s ease" }} className={champion ? "shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-[1.03]" : ""}>
        <div style={{ width: "100%", height: "100%", background: "#0c0a09", clipPath: hexClip, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          {imgSrc ? (
            <>
              <img src={imgSrc} alt={champion || ""} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: imgPos, filter: "contrast(1.1) grayscale(10%)", transition: "all 0.5s ease" }} className="group-hover:grayscale-0 group-hover:contrast-125" />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(12,10,9,0.7) 0%, transparent 70%)" }}></div>
            </>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "url('https://www.transparenttextures.com/patterns/stardust.png')", opacity: 0.05 }} />
          )}
        </div>
      </div>
      {validItems.length > 0 && (
        <div style={{ position: "absolute", top: "calc(var(--hex-size) - 8px)", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2, zIndex: 10 }}>
          {validItems.map((item, i) => {
            const itemSrc = getImgSrc(runtime.getItemAsset(item));
            return (
              <div key={`${item}-${i}`} style={{ width: "clamp(14px, calc(var(--hex-size) * 0.28), 26px)", height: "clamp(14px, calc(var(--hex-size) * 0.28), 26px)", borderRadius: 1, border: "1px solid rgba(212,175,55,0.4)", background: "#0c0a09", overflow: "hidden", transitionDelay: `${i * 50}ms` }} className="group-hover:-translate-y-0.5 transition-transform duration-300">
                {itemSrc && <img src={itemSrc} alt={item} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
            );
          })}
        </div>
      )}
      {champion && showName && (
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, textAlign: "center", color: "#f5f5f4", fontFamily: "'Inknut Antiqua', serif", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textShadow: "0 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.9)", padding: "0 4px", fontSize, zIndex: 5, transition: "color 0.3s ease", pointerEvents: "none" }} className="group-hover:text-[#d4af37]">
          {champion}
        </div>
      )}
    </div>
  );
};

export const TFTBoardReact: React.FC<TFTBoardReactProps> = ({ boardData, runtime, showNames = true }) => {
  if (!boardData?.champions) return null;

  const board: (null | { champion: string; borderColor: string; items: string[]; stars: number })[][] = Array(4).fill(null).map(() => Array(7).fill(null));
  boardData.champions.forEach((champ) => {
    if (champ.position.row < 4 && champ.position.col < 7) {
      board[champ.position.row][champ.position.col] = {
        champion: champ.name,
        borderColor: getBorderColor(runtime, champ.name),
        items: champ.items || [],
        stars: champ.stars || 1,
      };
    }
  });

  return (
    <div className="tft-board-react">
      <style>{`
        .tft-board-react { --hex-size: 46px; --board-gap: 4px; width: fit-content; max-width: 100%; margin-inline: auto; padding: 1rem 0.5rem; }
        @media (min-width: 640px) { .tft-board-react { --hex-size: 56px; --board-gap: 4px; } }
        @media (min-width: 768px) { .tft-board-react { --hex-size: 68px; --board-gap: 6px; } }
        @media (min-width: 1024px) { .tft-board-react { --hex-size: 76px; --board-gap: 6px; } }
        @media (min-width: 1280px) { .tft-board-react { --hex-size: 84px; --board-gap: 8px; } }
        @media (max-width: 480px) { .tft-board-react { --hex-size: 36px; --board-gap: 2px; padding: 0.5rem; } }
        @media (max-width: 360px) { .tft-board-react { --hex-size: 32px; --board-gap: 2px; padding: 0.25rem; } }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--board-gap)", transform: "translateX(calc((var(--hex-size) / 2 + var(--board-gap) / 2) / -2))" }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "var(--board-gap)", justifyContent: "center", alignItems: "flex-start", position: "relative", zIndex: 10 - rowIndex, transform: rowIndex % 2 === 1 ? "translateX(calc(var(--hex-size) / 2 + var(--board-gap) / 2))" : undefined }}>
            {row.map((cell, colIndex) => (
              <div key={colIndex} style={{ width: "var(--hex-size)", height: "calc(var(--hex-size) + 12px)", flexShrink: 0 }}>
                <HexCharacter runtime={runtime} champion={cell?.champion} borderColor={cell?.borderColor || "empty"} items={cell?.items || []} stars={cell?.stars || 1} showName={showNames && !!cell?.champion} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
