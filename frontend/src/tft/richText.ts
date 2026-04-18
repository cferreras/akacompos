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

function containsHtmlMarkup(value: string): boolean {
  return /<\/?[a-z][^>]*>|&lt;\/?[a-z][^&]*&gt;/i.test(value);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function stripHtmlTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");
}

function stripLegacyImageFragments(value: string): string {
  return value
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/&lt;img\b[^&]*&gt;/gi, "")
    .replace(
      /[^\s<>"']*?\.(?:png|jpe?g|gif|webp|svg)(?:"|'|&quot;)(?:\s+(?:alt|class|src|width|height|loading|decoding|style|title|aria-[\w-]+)\s*=\s*(?:"[^"]*"|'[^']*'|&quot;[^&]*&quot;|[^\s>]+))*\s*\/?>?/gi,
      "",
    )
    .replace(
      /(?:\s+(?:alt|class|src|width|height|loading|decoding|style|title|aria-[\w-]+)\s*=\s*(?:"[^"]*"|'[^']*'|&quot;[^&]*&quot;|[^\s>]+)){2,}\s*\/?>?/gi,
      "",
    )
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}

export function getSanitizedRichTextPlainText(content: RichTextContent): string {
  const plainText = getRichTextPlainText(content);
  if (!plainText) return "";

  const normalized = containsHtmlMarkup(plainText)
    ? stripHtmlTags(decodeHtmlEntities(plainText))
    : decodeHtmlEntities(plainText);

  return stripLegacyImageFragments(normalized);
}

function buildMentionPattern(name: string): string {
  return Array.from(name)
    .map((char) => {
      if (/\s/.test(char)) return "\\s+";
      if (char === "'") return "(?:'|&#39;|’|&#8217;)";
      if (char === "&") return "(?:&|&amp;)";
      if (char === "\"") return "(?:\"|&quot;)";
      return escapeRegex(char);
    })
    .join("");
}

function buildMentionHtml(name: string, iconSrc: string): string {
  const safeName = escapeHtml(name);
  const safeIcon = escapeHtml(iconSrc);

  return `<b>${safeName}</b> <img src="${safeIcon}" alt="${safeName}" class="rounded-full aspect-square h-4 inline align-middle border border-[#292524]"/>`;
}

export function renderInlineDescriptionWithSetMentions(
  content: string | null | undefined,
  runtime: SetRuntime,
): string {
  if (!content) return "";

  return renderRichTextWithSetMentions(getSanitizedRichTextPlainText(content), runtime);
}

export function renderRichTextWithSetMentions(
  content: RichTextContent,
  runtime: SetRuntime,
): string {
  const plainText = getSanitizedRichTextPlainText(content);
  if (!plainText) return "";

  let rendered = escapeHtml(plainText);
  const mentionHtmlByToken = new Map<string, string>();
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

    const regex = new RegExp(
      `(^|[^a-zA-Z0-9])(${buildMentionPattern(candidate.name)})(?=$|[^a-zA-Z0-9])`,
      "gi",
    );
    rendered = rendered.replace(regex, (_match, prefix: string) => {
      const token = `__MENTION_${mentionHtmlByToken.size}__`;
      mentionHtmlByToken.set(token, buildMentionHtml(candidate.name, iconSrc));
      return `${prefix}${token}`;
    });
  }

  for (const [token, html] of mentionHtmlByToken) {
    rendered = rendered.replaceAll(token, html);
  }

  return rendered.replace(/\n/g, "<br />");
}

