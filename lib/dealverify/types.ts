export type UserSettings = {
  id: string;
  pincode: string | null;
  high_priority_threshold: number;
};

export type VerifiedDeal = {
  id: string;
  product_title: string;
  verified_price: number;
  claimed_price: number;
  product_url: string;
  x_post_url: string;
  history_note: "Near 30-day low" | "Significant drop" | "Average" | "Insufficient history";
  is_high_priority: boolean;
  pincode_checked: string;
  source_handle: string | null;
  first_seen_at: string;
  expires_at: string | null;
};