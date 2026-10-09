// Server-side input validation. Every admin Server Action runs its inputs through
// these before writing to the database — the client-side `accept`/`maxLength`
// attributes on forms are a UX nicety, not security; a request can always be sent
// directly, bypassing the browser entirely, so the real checks live here.

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class ValidationError extends Error {}

export function assertValidImage(file: File) {
  if (!file || file.size === 0) throw new ValidationError("No file provided.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ValidationError("Only JPEG, PNG, WebP, or GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ValidationError("Image must be under 5MB.");
  }
}

/** Trims and hard-caps a string's length. Empty input becomes null for optional fields. */
export function cleanText(value: FormDataEntryValue | null, maxLen: number): string {
  return String(value ?? "").trim().slice(0, maxLen);
}

export function cleanOptionalText(value: FormDataEntryValue | null, maxLen: number): string | null {
  const v = cleanText(value, maxLen);
  return v.length ? v : null;
}

/** Comma-separated input -> a capped array of short, trimmed strings. Used for
 * project tech-stack tags, profile role tags, and the "tags" section layout
 * (e.g. a Skills chip grid) — same shape, same limits. */
export function cleanList(value: FormDataEntryValue | null, maxItems: number, maxItemLen: number): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim().slice(0, maxItemLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function assertValidUrlOrEmpty(value: FormDataEntryValue | null, label: string): string | null {
  const v = cleanText(value, 500);
  if (!v) return null;
  const normalized = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
  try {
    const url = new URL(normalized);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || /\s/.test(v) || url.username || url.password) throw new Error();
    return url.href;
  } catch {
    throw new ValidationError(`${label}: enter a full website address, for example https://www.linkedin.com/in/your-name, or leave it blank.`);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function assertValidEmailOrEmpty(value: FormDataEntryValue | null): string | null {
  const v = cleanText(value, 254);
  if (!v) return null;
  if (!EMAIL_RE.test(v)) throw new ValidationError("That doesn't look like a valid email address.");
  return v;
}

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;
export function assertValidHexColor(value: FormDataEntryValue | null, fallback: string): string {
  const v = cleanText(value, 7);
  return HEX_COLOR_RE.test(v) ? v : fallback;
}

/**
 * Validates the shape of section "items" content (used by the cards/two-col
 * layouts) so a malformed or oversized JSON payload can't corrupt the public
 * page's rendering or balloon the database row.
 */
export function assertValidSectionItems(raw: string): { title: string; body: string; tag?: string }[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ValidationError("Items must be valid JSON — check the brackets/quotes.");
  }
  if (!Array.isArray(parsed)) throw new ValidationError("Items must be a JSON array.");
  if (parsed.length > 24) throw new ValidationError("Keep it to 24 items or fewer per section.");

  return parsed.map((item, i) => {
    if (typeof item !== "object" || item === null) {
      throw new ValidationError(`Item ${i + 1} must be an object.`);
    }
    const o = item as Record<string, unknown>;
    if (typeof o.title !== "string" || !o.title.trim()) {
      throw new ValidationError(`Item ${i + 1} needs a "title".`);
    }
    return {
      title: o.title.trim().slice(0, 120),
      body: typeof o.body === "string" ? o.body.trim().slice(0, 2000) : "",
      ...(typeof o.tag === "string" && o.tag.trim() ? { tag: o.tag.trim().slice(0, 60) } : {}),
    };
  });
}
