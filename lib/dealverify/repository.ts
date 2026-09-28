import { createClient } from "@/lib/supabase/server";
import type { UserSettings, VerifiedDeal } from "./types";

export async function getCurrentUserSettings(): Promise<UserSettings | null> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, pincode, high_priority_threshold")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertUserSettings(input: {
  pincode: string;
  high_priority_threshold: number;
}): Promise<UserSettings> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) throw new Error("Authentication required.");

  const { data, error } = await supabase
    .from("users")
    .upsert({
      id: userId,
      pincode: input.pincode,
      high_priority_threshold: input.high_priority_threshold
    })
    .select("id, pincode, high_priority_threshold")
    .single();

  if (error) throw error;
  return data;
}

export async function getVerifiedDeals(pincode: string, highPriorityThreshold: number): Promise<VerifiedDeal[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("verified_deals")
    .select(
      "id, product_title, verified_price, claimed_price, product_url, x_post_url, history_note, is_high_priority, pincode_checked, source_handle, first_seen_at, expires_at"
    )
    .eq("pincode_checked", pincode)
    .or("expires_at.is.null,expires_at.gt.now()")
    .order("first_seen_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((deal) => ({
      ...deal,
      is_high_priority: Number(deal.verified_price) <= highPriorityThreshold
    }))
    .sort((a, b) => {
      if (a.is_high_priority !== b.is_high_priority) return a.is_high_priority ? -1 : 1;
      return new Date(b.first_seen_at).getTime() - new Date(a.first_seen_at).getTime();
    });
}