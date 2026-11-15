import { useState } from "react";
import _ from "lodash";
import moment from "moment";
import { generateTransactions, CATEGORY_LIST } from "../shared/data";
import { filterTransactions, summarize } from "../shared/filter";
import { formatMoney } from "../shared/format";
import { computeInsights } from "./insights";

const ALL = generateTransactions();

/**
 * The NAIVE implementation. Every anti-pattern here is intentional and labelled:
 *  - imports all of lodash and moment (large, non-tree-shaken bundle)
 *  - recomputes filtering, sorting, the summary and an expensive aggregation on
 *    every render, none memoized
 *  - renders all ~5000 matching rows into the DOM (no virtualization)
 *  - updates search state synchronously on every keystroke, so each keystroke
 *    re-runs all of the above and re-renders thousands of nodes
 */
export function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = filterTransactions(ALL, { search, category });
  const sorted = _.orderBy(filtered, ["date"], ["desc"]);
  const summary = summarize(filtered);
  computeInsights(filtered); // result intentionally unused; the cost is the point

  return (
    <div className="app">
      <h1>
        Transactions <span className="tag">naive build</span>
      </h1>
      <p className="muted">
        {ALL.length.toLocaleString()} transactions, rendered without optimization.
      </p>

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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Status</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr key={t.id}>
                <td>{moment(t.date).format("MMM D, YYYY")}</td>
                <td>{t.merchant}</td>
                <td>{t.category}</td>
                <td>
                  <span className="status">{t.status}</span>
                </td>
                <td className={"num " + (t.amount >= 0 ? "pos" : "neg")}>
                  {formatMoney(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
