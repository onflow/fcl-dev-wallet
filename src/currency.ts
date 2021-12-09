export function currency(amount: string | number, maximumFractionDigits = 2) {
  return parseFloat((amount || 0).toString()).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maximumFractionDigits,
  })
}
