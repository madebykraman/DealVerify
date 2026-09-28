import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertAmazonIndiaUrl, extractAmazonProduct } from "@/lib/extractors/amazon";
import { canonicalizeDeal } from "@/lib/canonicalize";
import { verifyCandidate } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    if (!claimsData?.claims?.sub) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json();
    const claimedPrice = Number(body.claimedPrice);
    const recentPrices = Array.isArray(body.recentPrices) ? body.recentPrices.map(Number) : [];
    const rawUrl = String(body.productUrl ?? "");

    if (!Number.isFinite(claimedPrice) || claimedPrice < 0) {
      return NextResponse.json({ error: "A valid claimed price is required." }, { status: 400 });
    }

    const url = assertAmazonIndiaUrl(rawUrl);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DealVerify/0.1 (+verified-deal-fetcher)",
        "Accept-Language": "en-IN,en;q=0.9"
      },
      redirect: "manual",
      cache: "no-store"
    });

    if (response.status >= 300 && response.status < 400) {\n      return NextResponse.json({ error: "Redirected product URLs are rejected." }, { status: 400 });\n    }\n\n    if (!response.ok) {
      return NextResponse.json({ error: "Amazon product could not be fetched." }, { status: 502 });
    }

    const html = await response.text();
    const product = extractAmazonProduct(html, url.toString());
    const verification = verifyCandidate({
      claimedPrice,
      livePrice: product.price,
      inStock: product.inStock,
      deliverable: Boolean(body.deliverable),
      recentPrices
    });

    return NextResponse.json({
      product,
      canonicalKey: canonicalizeDeal({
        productUrl: product.productUrl,
        productTitle: product.title,
        asin: product.asin ?? undefined
      }),
      verification
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Amazon verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}