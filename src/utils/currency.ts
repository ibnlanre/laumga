export function formatCurrency(amount: number | null) {
  if (amount === null) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function formatCurrencyFromKobo(value?: number | null) {
  return formatCurrency(Math.round((value ?? 0) / 100));
}

export function formatPercentage(value: number | null) {
  return new Intl.NumberFormat("en-NG", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format((value ?? 0) / 100);
}
