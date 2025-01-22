export function formatNumber(value: number, style: "currency" | "decimal" = "decimal"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style,
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
}

