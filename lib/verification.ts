export type VerificationInput = {
  claimedPrice: number;
  livePrice: number | null;
  inStock: boolean;
  deliverable: boolean;
  recentPrices: number[];
};

export type VerificationResult = {
  passed: boolean;
  checks: {
    priceMatch: boolean;
    availability: boolean;
    historicalValue: boolean;
  };
  historyNote: "Near 30-day low" | "Significant drop" | "Average" | "Insufficient history";
};

export function assessHistory(recentPrices: number[]): Pick<VerificationResult, "historicalValue" | "historyNote"> {
  const prices = recentPrices.filter((price) => Number.isFinite(price) && price >= 0);
  if (prices.length < 3) return { historicalValue: false, historyNote: "Insufficient history" };

  const current = prices[prices.length - 1];
  const historical = prices.slice(0, -1);
  const minimum = Math.min(...historical);
  const average = historical.reduce((sum, price) => sum + price, 0) / historical.length;

  // Conservative thresholds: a deal must be meaningfully below the recent baseline.
  if (current <= minimum * 1.03) return { historicalValue: true, historyNote: "Near 30-day low" };
  if (current <= average * 0.80) return { historicalValue: true, historyNote: "Significant drop" };
  if (current <= average * 0.95) return { historicalValue: true, historyNote: "Average" };

  return { historicalValue: false, historyNote: "Average" };
}

export function verifyCandidate(input: VerificationInput): VerificationResult {
  const priceMatch =
    input.livePrice !== null &&
    Number.isFinite(input.livePrice) &&
    input.livePrice >= 0 &&
    input.livePrice <= input.claimedPrice;

  const availability = input.inStock && input.deliverable;
  const history = assessHistory(input.recentPrices);

  return {
    passed: priceMatch && availability && history.historicalValue,
    checks: {
      priceMatch,
      availability,
      historicalValue: history.historicalValue
    },
    historyNote: history.historyNote
  };
}
