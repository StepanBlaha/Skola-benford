import { normalizeNumber, type DigitRow } from "./benford"

/** MAD limits for first digits from Mark Nigrini, Benford's Law (2012) */
export const CLOSE_LIMIT = 0.006
export const ACCEPTABLE_LIMIT = 0.012
export const MARGINAL_LIMIT = 0.015

/** With fewer numbers the result is mostly random, can be changed */
export const MIN_NUMBERS = 100

/** Data should go over at least 2 orders of magnitude (e.g. from 10 to 1000) */
export const MIN_ORDERS = 2

export type Conformity = "close" | "acceptable" | "marginal" | "none"

// Mean absolute deviation, average difference between the data and Benford (0.03 = 3 %)
export function meanAbsoluteDeviation(rows: DigitRow[]) {
  let sum = 0
  for (const row of rows) {
    sum += Math.abs(row.observed - row.expected)
  }
  return sum / rows.length
}

// How close the data is to Benford based on MAD
export function conformity(mad: number): Conformity {
  if (mad <= CLOSE_LIMIT) return "close"
  if (mad <= ACCEPTABLE_LIMIT) return "acceptable"
  if (mad <= MARGINAL_LIMIT) return "marginal"
  return "none"
}

// How many orders of magnitude the numbers go over, 150 to 200 -> 0.1, 10 to 10000 -> 3
export function orderSpan(rows: string[][], column: number) {
  let smallest = Infinity
  let biggest = 0

  for (const row of rows.slice(1)) {
    const number = normalizeNumber(row[column] ?? "")
    if (number === null) continue

    // Negative numbers count by their size, zeros are skipped
    const value = Math.abs(Number(number))
    if (value === 0) continue

    if (value < smallest) smallest = value
    if (value > biggest) biggest = value
  }

  if (biggest === 0) return 0
  return Math.log10(biggest / smallest)
}
