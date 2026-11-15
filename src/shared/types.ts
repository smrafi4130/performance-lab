export type Category =
  "Groceries" | "Transport" | "Utilities" | "Dining" | "Shopping" | "Health" | "Travel" | "Income";
export type Status = "cleared" | "pending" | "flagged";

export interface Transaction {
  id: number;
  date: string; // ISO
  merchant: string;
  category: Category;
  amount: number; // negative = spend, positive = income
  status: Status;
}
