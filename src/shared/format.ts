const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export const formatMoney = (n: number) => currency.format(n);
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
