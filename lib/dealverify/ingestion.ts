import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalizeDeal } from "@/lib/canonicalize";
import { verifyCandidate, type VerificationInput } from "@/lib/verification";

export type TrustedDealCandidate = VerificationInput & {
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

  const verification = verifyCandidate(candidate);
  if (!verification.passed) {
    return { stored: false, verification };
  }

  const canonicalKey = canonicalizeDeal({
    asin: candidate.asin,
    fsn: candidate.fsn,
    productUrl: candidate.productUrl,
    title: candidate.productTitle
  });

  const supabase = createAdminClient();

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

  if (existing) {
    const { data, error } = await supabase
      .from("verified_deals")
      .update({
        product_title: candidate.productTitle,
        verified_price: candidate.livePrice,
        claimed_price: candidate.claimedPrice,
        product_url: candidate.productUrl,
        x_post_url: candidate.xPostUrl ?? null,
        history_note: verification.historyNote,
        source_handle: candidate.sourceHandle ?? null,
        first_seen_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return { stored: true, updated: true, deal: data, verification };
  }

  const { data, error } = await supabase
    .from("verified_deals")
    .insert({
      product_title: candidate.productTitle,
      verified_price: candidate.livePrice,
      claimed_price: candidate.claimedPrice,
      product_url: candidate.productUrl,
      x_post_url: candidate.xPostUrl ?? null,
      history_note: verification.historyNote,
      is_high_priority: candidate.livePrice <= 500,
      pincode_checked: candidate.pincode,
      canonical_key: canonicalKey,
      source_handle: candidate.sourceHandle ?? null,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return { stored: true, updated: false, deal: data, verification };
}
