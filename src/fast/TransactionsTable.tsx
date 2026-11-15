import { memo } from "react";
import type { Transaction } from "../shared/types";
import { formatDate, formatMoney } from "../shared/format";
import { useVirtualRows } from "./useVirtualRows";

const ROW_H = 37;

/**
 * Virtualized table: renders only the visible window of rows regardless of how
 * many match. memo() keeps it from re-rendering while unrelated state (e.g. a
 * deferred search value still settling) changes.
 */
export const TransactionsTable = memo(function TransactionsTable({
  rows,
}: {
  rows: Transaction[];
}) {
  const { scrollRef, range, topSpacer, bottomSpacer } = useVirtualRows({
    count: rows.length,
    rowHeight: ROW_H,
  });
  const slice = rows.slice(range.start, range.end);

  return (
    <div className="table-wrap">
      <div ref={scrollRef} style={{ maxHeight: "60vh", overflow: "auto" }}>
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
            <tr style={{ height: topSpacer }} aria-hidden />
            {slice.map((t) => (
              <tr key={t.id} style={{ height: ROW_H }}>
                <td>{formatDate(t.date)}</td>
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
            <tr style={{ height: bottomSpacer }} aria-hidden />
          </tbody>
        </table>
      </div>
    </div>
  );
});
