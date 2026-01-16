import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = ["p", "br", "strong", "em", "ul", "ol", "li", "a", "img"];

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
};

function isAllowedImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith("/uploads/");
}

function isAllowedLinkHref(href: string): boolean {
  return (
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    href.startsWith("/uploads/")
  );
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function extractImageSourcesFromHtml(html: string): string[] {
  const results = new Set<string>();
  const tagRe = /<img\b[^>]*>/gi;
  const srcRe = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
  let match: RegExpExecArray | null = null;
  while ((match = tagRe.exec(html)) !== null) {
    const tag = match[0];
    const srcMatch = srcRe.exec(tag);
    const src = (srcMatch?.[1] || srcMatch?.[2] || srcMatch?.[3])?.trim();
    if (src) results.add(src);
  }
  return Array.from(results);
}

export function sanitizeRichText(input?: string | null): string | null {
  if (typeof input !== "string") return input ?? null;
  return sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    exclusiveFilter: (frame) => {
      if (frame.tag === "img") {
        const src = String(frame.attribs?.src || "");
        return !isAllowedImageSrc(src);
      }
      if (frame.tag === "a") {
        const href = String(frame.attribs?.href || "");
        if (!href) return false;
        return !isAllowedLinkHref(href);
      }
      return false;
    },
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs };
        if (next.target === "_blank") {
          next.rel = next.rel || "noopener noreferrer";
        }
        return { tagName, attribs: next };
      },
    },
  });
}

export function extractImageSources(input?: string | null): string[] {
  if (!input) return [];
  let results = extractImageSourcesFromHtml(input);
  if (!results.length && /&lt;img\\b/i.test(input)) {
    results = extractImageSourcesFromHtml(decodeHtmlEntities(input));
  }
  return results;
}

export function collectImageSources(
  htmlBlocks: Array<string | null | undefined>
): Set<string> {
  const results = new Set<string>();
  for (const html of htmlBlocks) {
    for (const src of extractImageSources(html)) {
      results.add(src);
    }
  }
  return results;
}
