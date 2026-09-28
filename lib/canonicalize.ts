export function normalizeProductUrl(input: string): string {
  const url = new URL(input.trim());
  url.hash = "";

  const removable = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "tag", "ref", "ref_", "affid", "afftrack", "ascsubtag"
  ];

  for (const key of removable) url.searchParams.delete(key);

  return url.toString();
}

export function canonicalizeDeal(input: {
  productUrl: string;
  productTitle?: string;
  asin?: string;
  fsn?: string;
}): string {
  if (input.asin) return `asin:${input.asin.toLowerCase()}`;
  if (input.fsn) return `fsn:${input.fsn.toLowerCase()}`;

  const title = (input.productTitle ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return `${normalizeProductUrl(input.productUrl)}::${title}`;
}
