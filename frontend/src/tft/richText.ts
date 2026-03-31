import type { RichTextBlock, RichTextContent, SetRuntime } from "./types";

function getAssetSrc(asset: unknown): string | null {
  if (!asset) return null;
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && asset !== null && "src" in asset) {
    const src = (asset as { src?: unknown }).src;
    return typeof src === "string" ? src : null;
  }
  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getRichTextPlainText(content: RichTextContent): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((block: RichTextBlock) => {
      if (!Array.isArray(block.children)) return "";
      return block.children
        .map((child) => (typeof child?.text === "string" ? child.text : ""))
        .join("");
    })
    .join("\n");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMentionHtml(name: string, iconSrc: string): string {
  const safeName = escapeHtml(name);
  const safeIcon = escapeHtml(iconSrc);

  return `<b>${safeName}</b> <img src="${safeIcon}" alt="${safeName}" class="rounded-full aspect-square h-4 inline align-middle border border-[#292524]"/>`;
}

export function renderRichTextWithSetMentions(
  content: RichTextContent,
  runtime: SetRuntime,
): string {
  const plainText = getRichTextPlainText(content);
  if (!plainText) return "";

  let rendered = escapeHtml(plainText);
  const seen = new Set<string>();
  const candidates = [
    ...runtime.championNames.map((name) => ({ name, type: "champion" as const })),
    ...runtime.itemNames.map((name) => ({ name, type: "item" as const })),
    ...runtime.traitNames.map((name) => ({ name, type: "trait" as const })),
    ...runtime.augmentNames.map((name) => ({ name, type: "augment" as const })),
  ]
    .filter((candidate) => {
      const key = `${candidate.type}:${candidate.name.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.name.length - a.name.length);

  for (const candidate of candidates) {
    const resolved = runtime.resolveEntity(candidate.name, candidate.type);
    const iconSrc = getAssetSrc(resolved?.icon);
    if (!iconSrc) continue;

    const regex = new RegExp(`\\b${escapeRegex(candidate.name)}\\b`, "gi");
    rendered = rendered.replace(regex, () =>
      buildMentionHtml(candidate.name, iconSrc),
    );
  }

  return rendered.replace(/\n/g, "<br />");
}
