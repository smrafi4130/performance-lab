import { generateTransactions } from "./data";

describe("generateTransactions", () => {
  it("is deterministic for a given seed", () => {
    const a = generateTransactions(100, 42);
    const b = generateTransactions(100, 42);
    expect(a).toEqual(b);
    expect(a).toHaveLength(100);
  });

  it("produces income as positive and spend as negative", () => {
    for (const t of generateTransactions(500)) {
      if (t.category === "Income") expect(t.amount).toBeGreaterThan(0);
      else expect(t.amount).toBeLessThan(0);
    }
  });
});
