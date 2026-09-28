import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalizeDeal } from "@/lib/canonicalize";
import { verifyCandidate, type VerificationInput } from "@/lib/verification";

export type TrustedDealCandidate = Omit<VerificationInput, "recentPrices"> & {
  productTitle: string;
  productUrl: string;
  xPostUrl?: string | null;
  sourceHandle?: string | null;
  asin?: string | null;
  fsn?: string | null;
  pincode: string;
};

export async function persistVerifiedCandidate(candidate: TrustedDealCandidate) {
  if (!/^\d{6}$/.test(candidate.pincode)) throw new Error("Invalid pincode.");
  if (!candidate.productTitle.trim()) throw new Error("Product title is required.");

  const canonicalKey = canonicalizeDeal({
    asin: candidate.asin,
    fsn: candidate.fsn,
    productUrl: candidate.productUrl,
    title: candidate.productTitle
  });

  const supabase = createAdminClient();

  const { data: observations, error: historyError } = await supabase
    .from("price_observations")
    .select("price, observed_at")
    .eq("canonical_key", canonicalKey)
    .order("observed_at", { ascending: true })
    .limit(90);

  if (historyError) throw historyError;

  const recentPrices = [
    ...(observations ?? []).map((row) => Number(row.price)),
    candidate.livePrice
  ];

  const verification = verifyCandidate({
    claimedPrice: candidate.claimedPrice,
    livePrice: candidate.livePrice,
    inStock: candidate.inStock,
    deliverable: candidate.deliverable,
    recentPrices
  });

  if (!verification.passed) {
    return { stored: false, verification };
  }

  const { error: observationError } = await supabase
    .from("price_observations")
    .insert({
      canonical_key: canonicalKey,
      price: candidate.livePrice
    });

  if (observationError) throw observationError;

  const { data: existing } = await supabase
    .from("verified_deals")
    .select("id")
    .eq("canonical_key", canonicalKey)
    .eq("pincode_checked", candidate.pincode)
    .maybeSingle();

  const payload = {
    product_title: candidate.productTitle,
    verified_price: candidate.livePrice,
    claimed_price: candidate.claimedPrice,
    product_url: candidate.productUrl,
    x_post_url: candidate.xPostUrl ?? null,
    history_note: verification.historyNote,
    source_handle: candidate.sourceHandle ?? null,
    pincode_checked: candidate.pincode,
    canonical_key: canonicalKey,
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  };

  if (existing) {
    const { data, error } = await supabase
      .from("verified_deals")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return { stored: true, updated: true, deal: data, verification };
  }

  const { data, error } = await supabase
    .from("verified_deals")
    .insert({
      ...payload,
      is_high_priority: candidate.livePrice <= 500
    })
    .select()
    .single();

  if (error) throw error;
  return { stored: true, updated: false, deal: data, verification };
}
