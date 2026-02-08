import React from "react";
import {
  itemAssets,
  championRarity,
  championImagePositions,
} from "../../utils/assets";
import { championThumbs } from "../../utils/champion-thumbs";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChampionData {
  name: string;
  position: { row: number; col: number };
  items?: string[];
  stars?: number;
}

interface BoardData {
  champions: ChampionData[];
}

interface TFTBoardReactProps {
  boardData: BoardData;
  showNames?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const borderColors: Record<string, string> = {
  purple: "#8b5cf6",
  blue: "#3b82f6",
  yellow: "#eab308",
  green: "#22c55e",
  gray: "#6b7280",
  orange: "#f97316",
  red: "#ef4444",
  empty: "#1e293b",
};

function getBorderColor(name: string): string {
  const rarity = championRarity[name];
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

function getImgSrc(asset: any): string | null {
  if (!asset) return null;
  return typeof asset === "string" ? asset : asset.src || null;
}

// ─── Stars Sub-component ────────────────────────────────────────────────────

const Stars: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: -6,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}
    >
      <span
        className="text-yellow-400"
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          background: "rgba(0,0,0,0.7)",
          borderRadius: 4,
          padding: "0 3px",
          whiteSpace: "nowrap",
        }}
      >
        {"★".repeat(count)}
      </span>
    </div>
  );
};

// ─── Hex Character Sub-component ────────────────────────────────────────────

const HexCharacter: React.FC<{
  champion?: string;
  borderColor: string;
  items: string[];
  stars: number;
  showName: boolean;
}> = ({ champion, borderColor, items, stars, showName }) => {
  const hexClip = "polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)";
  const color = borderColors[borderColor] || borderColors.empty;
  const imgSrc = champion ? getImgSrc(championThumbs[champion]) : null;
  const imgPos = champion
    ? championImagePositions[champion] || championImagePositions["Default"]
    : "center";
  const validItems = items
    .slice(0, 3)
    .filter((item) => item in itemAssets);

  const nameLen = champion ? champion.length : 0;
  // Font size scales with hex size, with length-based adjustments
  let fontSize = "calc(var(--hex-size) * 0.18)";
  if (nameLen > 12) fontSize = "calc(var(--hex-size) * 0.14)";
  else if (nameLen > 8) fontSize = "calc(var(--hex-size) * 0.16)";

  return (
    <div
      className="tft-hex-char"
      style={{
        position: "relative",
        width: "var(--hex-size)",
        height: "calc(var(--hex-size) + 22px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {champion && <Stars count={stars} />}

      {/* Hexagon wrapper (border) */}
      <div
        style={{
          position: "relative",
          width: "var(--hex-size)",
          height: "var(--hex-size)",
          clipPath: hexClip,
          background: color,
          padding: 2,
          flexShrink: 0,
        }}
      >
        {/* Inner hex */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#0f172a",
            clipPath: hexClip,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={champion || ""}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: imgPos,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.02)",
              }}
            />
          )}
        </div>
      </div>

      {/* Items */}
      {validItems.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(var(--hex-size) - 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 3,
            zIndex: 10,
          }}
        >
          {validItems.map((item, i) => {
            const itemSrc = getImgSrc(itemAssets[item]);
            return (
              <div
                key={i}
                style={{
                  width: "clamp(14px, calc(var(--hex-size) * 0.30), 28px)",
                  height: "clamp(14px, calc(var(--hex-size) * 0.30), 28px)",
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "#000",
                  overflow: "hidden",
                }}
              >
                {itemSrc && (
                  <img
                    src={itemSrc}
                    alt={item}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Champion name */}
      {champion && showName && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            textAlign: "center",
            color: "white",
            fontWeight: 700,
            lineHeight: 1.1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)",
            padding: "0 4px",
            fontSize,
            zIndex: 5,
          }}
        >
          {champion}
        </div>
      )}
    </div>
  );
};

// ─── Main Board Component ───────────────────────────────────────────────────

export const TFTBoardReact: React.FC<TFTBoardReactProps> = ({
  boardData,
  showNames = true,
}) => {
  if (!boardData?.champions) return null;

  // Build 4x7 board grid
  const board: (null | {
    champion: string;
    borderColor: string;
    items: string[];
    stars: number;
  })[][] = Array(4)
    .fill(null)
    .map(() => Array(7).fill(null));

  boardData.champions.forEach((champ) => {
    if (champ.position.row < 4 && champ.position.col < 7) {
      board[champ.position.row][champ.position.col] = {
        champion: champ.name,
        borderColor: getBorderColor(champ.name),
        items: champ.items || [],
        stars: champ.stars || 1,
      };
    }
  });

  return (
    <div className="tft-board-react">
      <style>{`
        .tft-board-react {
          --hex-size: 48px;
          --board-gap: 2px;
          padding: 0.5rem;
        }
        @media (min-width: 640px) {
          .tft-board-react { --hex-size: 56px; --board-gap: 2px; }
        }
        @media (min-width: 768px) {
          .tft-board-react { --hex-size: 64px; --board-gap: 3px; }
        }
        @media (min-width: 1024px) {
          .tft-board-react { --hex-size: 72px; --board-gap: 3px; }
        }
        @media (min-width: 1280px) {
          .tft-board-react { --hex-size: 80px; --board-gap: 4px; }
        }
        @media (max-width: 480px) {
          .tft-board-react { --hex-size: 40px; --board-gap: 2px; }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--board-gap)",
        }}
      >
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              gap: "var(--board-gap)",
              justifyContent: "center",
              alignItems: "flex-start",
              position: "relative",
              zIndex: 10 - rowIndex,
              transform:
                rowIndex % 2 === 1
                  ? "translateX(calc(var(--hex-size) / 2 + var(--board-gap) / 2))"
                  : undefined,
            }}
          >
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: "var(--hex-size)",
                  height: "calc(var(--hex-size) + 12px)",
                  flexShrink: 0,
                }}
              >
                <HexCharacter
                  champion={cell?.champion}
                  borderColor={cell?.borderColor || "empty"}
                  items={cell?.items || []}
                  stars={cell?.stars || 1}
                  showName={showNames && !!cell?.champion}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
