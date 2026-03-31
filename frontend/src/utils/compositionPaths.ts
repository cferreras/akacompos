const COMPOSITION_SET_PATTERN = /^set[a-z0-9-]+$/i;

type CompositionPathInput = {
  set?: string | null;
  slug: string;
};

export function normalizeCompositionSet(value?: string | null): string | null {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue || !COMPOSITION_SET_PATTERN.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export function isCompositionSet(value?: string | null): boolean {
  return normalizeCompositionSet(value) !== null;
}

export function getCompositionPath({ set, slug }: CompositionPathInput): string {
  const encodedSlug = encodeURIComponent(slug);
  const normalizedSet = normalizeCompositionSet(set);

  if (normalizedSet) {
    return `/${normalizedSet}/${encodedSlug}`;
  }

  return `/compositions/${encodedSlug}`;
}

export function isCompositionSectionPath(pathname: string): boolean {
  return pathname.startsWith("/compositions") || /^\/set[^/]+(?:\/|$)/i.test(pathname);
}