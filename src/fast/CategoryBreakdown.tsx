import { useMemo } from "react";
import type { Transaction } from "../shared/types";
import { formatMoney } from "../shared/format";

/** Lazy-loaded widget: spend per category as a simple bar list. */
export default function CategoryBreakdown({ rows }: { rows: Transaction[] }) {
  const bars = useMemo(() => {
    const totals = new Map<string, number>();
    for (const t of rows)
      if (t.amount < 0) totals.set(t.category, (totals.get(t.category) ?? 0) - t.amount);
    const entries = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] ?? 1;
    return entries.map(([cat, total]) => ({ cat, total, pct: Math.round((total / max) * 100) }));
  }, [rows]);

  if (bars.length === 0) return null;
  return (
    <div className="stat" style={{ marginBottom: 16 }}>
      <span>Spend by category</span>
      <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
        {bars.map((b) => (
          <div
            key={b.cat}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 90px",
              alignItems: "center",
              gap: 8,
              fontSize: ".8rem",
            }}
          >
            <span>{b.cat}</span>
            <span style={{ background: "#eef2ff", borderRadius: 4, height: 10 }}>
              <span
                style={{
                  display: "block",
                  width: `${b.pct}%`,
                  height: "100%",
                  background: "var(--accent)",
                  borderRadius: 4,
                }}
              />
            </span>
            <span className="num" style={{ textAlign: "right" }}>
              {formatMoney(b.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
