export function formatCurrency(value = 0) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatPercent(value = 0, digits = 1) {
  return `${(Number(value) || 0).toFixed(digits)}%`;
}
