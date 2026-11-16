/** Decimals for percents in chart and table, can be changed */
const PERCENT_DECIMALS = 1

// 0.301 -> 30.1
export function toPercent(share: number) {
  return Number((share * 100).toFixed(PERCENT_DECIMALS))
}

// 0.301 -> "30.1%"
export function formatPercent(share: number) {
  return `${toPercent(share).toFixed(PERCENT_DECIMALS)}%`
}
