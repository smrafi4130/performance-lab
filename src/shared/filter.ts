import type { Transaction } from "./types";

export interface Filters {
  search: string;
  category: string; // "all" or a Category
}

/** Pure filter used by both implementations, so they do identical work. */
export function filterTransactions(rows: Transaction[], filters: Filters): Transaction[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter((t) => {
    if (filters.category !== "all" && t.category !== filters.category) return false;
    if (q && !t.merchant.toLowerCase().includes(q)) return false;
    return true;
  });
}

export interface Summary {
  count: number;
  income: number;
  spend: number;
  net: number;
}

export function summarize(rows: Transaction[]): Summary {
  let income = 0;
  let spend = 0;
  for (const t of rows) {
    if (t.amount > 0) income += t.amount;
    else spend += t.amount;
  }
  return { count: rows.length, income, spend, net: income + spend };
}
