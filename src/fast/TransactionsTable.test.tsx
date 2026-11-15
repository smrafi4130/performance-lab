import { render, screen } from "@testing-library/react";
import { generateTransactions } from "../shared/data";
import { TransactionsTable } from "./TransactionsTable";

describe("TransactionsTable (virtualized)", () => {
  it("renders only a window of rows, not all of them", () => {
    render(<TransactionsTable rows={generateTransactions(5000)} />);
    // jsdom has no layout, so clientHeight is 0; only overscan rows render.
    // The assertion that matters: far fewer than 5000 data rows are in the DOM.
    const rendered = screen.getAllByRole("row").length;
    expect(rendered).toBeLessThan(100);
  });
});
