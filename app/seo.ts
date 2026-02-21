export const SITE_NAME = "PayAi";
export const SITE_DESCRIPTION =
  "PayAi is a payment intelligence platform with BBPS AI assistance, flow visualization, JavaScript internals simulation, and enterprise solution workflows.";
export const SITE_KEYWORDS = [
  "PayAi",
  "BBPS assistant",
  "payment flow visualization",
  "JavaScript internals",
  "enterprise customer solutions",
  "Next.js payment platform"
];

const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawUrl: string | undefined) {
  if (!rawUrl) return DEFAULT_SITE_URL;
  try {
    return new URL(rawUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const METADATA_BASE = new URL(SITE_URL);

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
