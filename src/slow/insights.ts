import type { Transaction } from "../shared/types";

/**
 * A deliberately expensive, synchronous aggregation that runs on the main
 * thread. In the slow app it is recomputed on every render (not memoized),
 * which is a common real-world cause of input latency (poor INP/TBT).
 */
export function computeInsights(rows: Transaction[]): Record<string, number> {
  const byMerchant: Record<string, number> = {};
  for (let pass = 0; pass < 6; pass++) {
    for (const t of rows) {
      byMerchant[t.merchant] =
        (byMerchant[t.merchant] ?? 0) + Math.sqrt(Math.abs(t.amount)) / (pass + 1);
    }
  }
  return byMerchant;
}
