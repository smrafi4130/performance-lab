import { Suspense, lazy, useDeferredValue, useMemo, useState } from "react";
import { generateTransactions, CATEGORY_LIST } from "../shared/data";
import { filterTransactions, summarize } from "../shared/filter";
import { formatMoney } from "../shared/format";
import { TransactionsTable } from "./TransactionsTable";

const ALL = generateTransactions();

// Code-split: the category breakdown pulls its own small chunk and loads after
// first paint, so it never blocks the initial render.
const CategoryBreakdown = lazy(() => import("./CategoryBreakdown"));

/**
 * The OPTIMIZED implementation. Same data, same features as the naive app:
 *  - native Intl formatting (no moment); no lodash
 *  - filtering + summary memoized on their inputs
 *  - search uses useDeferredValue, so typing stays responsive while the large
 *    list re-filters at a lower priority
 *  - the table is virtualized (only visible rows in the DOM)
 *  - the breakdown widget is lazy-loaded (code splitting)
 */
export function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(
    () => filterTransactions(ALL, { search: deferredSearch, category }),
    [deferredSearch, category],
  );
  const summary = useMemo(() => summarize(filtered), [filtered]);
  const stale = search !== deferredSearch;

  return (
    <div className="app">
      <h1>
        Transactions <span className="tag">optimized build</span>
      </h1>
      <p className="muted">{ALL.length.toLocaleString()} transactions, virtualized and memoized.</p>

      <div className="controls">
        <input
          aria-label="Search merchant"
          placeholder="Search merchant…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="cards">
        <div className="stat">
          <span>Transactions</span>
          <b>{summary.count.toLocaleString()}</b>
        </div>
        <div className="stat">
          <span>Income</span>
          <b className="pos">{formatMoney(summary.income)}</b>
        </div>
        <div className="stat">
          <span>Spend</span>
          <b className="neg">{formatMoney(summary.spend)}</b>
        </div>
        <div className="stat">
          <span>Net</span>
          <b className={summary.net >= 0 ? "pos" : "neg"}>{formatMoney(summary.net)}</b>
        </div>
      </div>

      <Suspense fallback={<p className="muted">Loading breakdown…</p>}>
        <CategoryBreakdown rows={filtered} />
      </Suspense>

      <div style={{ opacity: stale ? 0.6 : 1, transition: "opacity 120ms" }}>
        <TransactionsTable rows={filtered} />
      </div>
    </div>
  );
}
