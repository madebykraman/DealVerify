export type AmazonProduct = {
  asin: string | null;
  title: string;
  price: number | null;
  currency: "INR";
  inStock: boolean;
  productUrl: string;
};

function cleanText(value: string | undefined | null) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function extractJsonLd(html: string): unknown[] {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const output: unknown[] = [];

  for (const match of blocks) {
    try {
      const parsed = JSON.parse(match[1]);
      output.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Ignore malformed structured data and continue with other sources.
    }
  }

  return output;
}

function parsePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  const price = Number(cleaned);
  return Number.isFinite(price) ? price : null;
}

export function extractAmazonProduct(html: string, productUrl: string): AmazonProduct {
  const jsonLd = extractJsonLd(html);
  const product = jsonLd.find((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const type = (entry as { "@type"?: unknown })["@type"];
    return type === "Product" || (Array.isArray(type) && type.includes("Product"));
  }) as Record<string, unknown> | undefined;

  const offers = product?.offers && typeof product.offers === "object"
    ? product.offers as Record<string, unknown>
    : null;

  const jsonTitle = typeof product?.name === "string" ? cleanText(product.name) : "";
  const jsonPrice = parsePrice(offers?.price);
  const jsonAvailability = typeof offers?.availability === "string" ? offers.availability : "";

  const titleMatch = html.match(/<span[^>]+id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i);
  const priceMatches = [
    html.match(/id=["']priceblock_ourprice["'][^>]*>\s*([^<]+)/i)?.[1],
    html.match(/id=["']priceblock_dealprice["'][^>]*>\s*([^<]+)/i)?.[1],
    html.match(/class=["'][^"']*a-price-whole[^"']*["'][^>]*>\s*([^<]+)/i)?.[1]
  ];

  const title = jsonTitle || cleanText(decodeEntities(titleMatch?.[1]));
  const price = jsonPrice ?? parsePrice(priceMatches.find(Boolean));
  const inStock = /InStock|In Stock/i.test(jsonAvailability) ||
    /id=["']availability["'][^>]*>[\s\S]*?in stock/i.test(html);

  const asin =
    (typeof product?.sku === "string" && product.sku) ||
    html.match(/(?:dp|product)\/[A-Z0-9]{10}/i)?.[0]?.split("/").pop() ||
    null;

  if (!title) throw new Error("Amazon product title could not be extracted.");

  return {
    asin,
    title,
    price,
    currency: "INR",
    inStock,
    productUrl
  };
}

export function assertAmazonIndiaUrl(rawUrl: string): URL {
  const url = new URL(rawUrl);
  const hostname = url.hostname.toLowerCase();

  if (url.protocol !== "https:" || !/(^|\.)amazon\.in$/.test(hostname)) {
    throw new Error("Only HTTPS Amazon.in product URLs are supported.");
  }

  return url;
}