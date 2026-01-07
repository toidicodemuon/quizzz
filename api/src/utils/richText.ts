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
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || href.startsWith("/uploads/");
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
  const results = new Set<string>();
  const re = /<img[^>]+src\\s*=\\s*["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null = null;
  while ((match = re.exec(input)) !== null) {
    const src = match[1]?.trim();
    if (src) results.add(src);
  }
  return Array.from(results);
}
