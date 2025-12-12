export function formatCurrency(amount: number | null) {
  if (amount === null) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyFromKobo(value?: number | null) {
  if (value == null) return "₦0";
  return formatCurrency(Math.round(value / 100));
}
