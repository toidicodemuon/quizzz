import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "img",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "width",
  "height",
];

const ALLOWED_URI = /^(?:(?:https?|mailto):|\/uploads\/)/i;

export function sanitizeHtml(input?: string | null): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: ALLOWED_URI,
  });
}

export function stripHtml(input?: string | null): string {
  if (!input) return "";
  if (typeof window !== "undefined" && window.document) {
    const el = window.document.createElement("div");
    el.innerHTML = input;
    return (el.textContent || "").replace(/\u00a0/g, " ").trim();
  }
  return input.replace(/<[^>]*>/g, " ").replace(/\u00a0/g, " ").trim();
}

export function hasRichContent(input?: string | null): boolean {
  if (!input) return false;
  const text = stripHtml(input);
  if (text.length > 0) return true;
  return /<img\b/i.test(input);
}
