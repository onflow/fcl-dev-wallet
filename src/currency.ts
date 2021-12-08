export function currency(amount: string | number) {
  return parseFloat((amount || 0).toString()).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
