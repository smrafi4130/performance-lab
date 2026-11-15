import type { Category, Status, Transaction } from "./types";

/**
 * Deterministic dataset. A seeded PRNG (mulberry32) means every build and every
 * benchmark run uses the exact same data, so the slow/fast comparison is a fair
 * one and Lighthouse numbers are reproducible.
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORIES: Category[] = [
  "Groceries",
  "Transport",
  "Utilities",
  "Dining",
  "Shopping",
  "Health",
  "Travel",
  "Income",
];
const STATUSES: Status[] = ["cleared", "pending", "flagged"];
const MERCHANTS = [
  "Blue Bottle",
  "Metro Transit",
  "City Power",
  "Thai Garden",
  "NorthMart",
  "Apex Pharmacy",
  "SkyJet",
  "Acme Payroll",
  "Corner Cafe",
  "RideShare",
  "Aqua Utilities",
  "Sushi Bar",
  "Mega Store",
  "WellCare",
  "Globe Airlines",
  "Freelance Co",
  "Green Grocer",
  "FuelUp",
];

export function generateTransactions(count = 5000, seed = 1337): Transaction[] {
  const rand = mulberry32(seed);
  const out: Transaction[] = new Array(count);
  const now = Date.UTC(2026, 9, 1);
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)]!;
    const isIncome = category === "Income";
    const amount = isIncome
      ? Math.round((1500 + rand() * 4000) * 100) / 100
      : -Math.round((3 + rand() * 480) * 100) / 100;
    out[i] = {
      id: i + 1,
      date: new Date(now - Math.floor(rand() * 365) * 86_400_000).toISOString(),
      merchant: MERCHANTS[Math.floor(rand() * MERCHANTS.length)]!,
      category,
      amount,
      status: STATUSES[Math.floor(rand() * STATUSES.length)]!,
    };
  }
  return out;
}

export const CATEGORY_LIST = CATEGORIES;
