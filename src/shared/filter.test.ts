import { filterTransactions, summarize } from "./filter";
import type { Transaction } from "./types";

const rows: Transaction[] = [
  { id: 1, date: "", merchant: "Blue Bottle", category: "Dining", amount: -10, status: "cleared" },
  { id: 2, date: "", merchant: "Acme Payroll", category: "Income", amount: 100, status: "cleared" },
  { id: 3, date: "", merchant: "Blue Train", category: "Transport", amount: -5, status: "pending" },
];

describe("filterTransactions", () => {
  it("filters by merchant substring (case-insensitive)", () => {
    expect(filterTransactions(rows, { search: "blue", category: "all" }).map((r) => r.id)).toEqual([
      1, 3,
    ]);
  });
  it("filters by category", () => {
    expect(filterTransactions(rows, { search: "", category: "Income" }).map((r) => r.id)).toEqual([
      2,
    ]);
  });
});

describe("summarize", () => {
  it("separates income and spend and nets them", () => {
    expect(summarize(rows)).toEqual({ count: 3, income: 100, spend: -15, net: 85 });
  });
});
