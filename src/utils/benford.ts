export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/*
  Benforduv zakon

  Ocekavana pravdepodobnost, ze cislo zacina cislici d (1 az 9):

  P(d) = log10(1 + 1/d)

  d - prvni cislice cisla (1-9)
  P(d) - pravdepodobnost, ze nahodne vybrane cislo z dat zacina cislem d
  log10 - na kolikatou musim umocnit 10, abych dostal tohle cislo

  Napr.
  P(1) = log10(2) = 0.301 -> 30.1%
  P(9) = log10(10/9) = 0.046 -> 4.6%

  Proc zrovna logaritmus:
  Kdyz data rostou nasobenim (populace, ceny, ucty...), jsou rovnomerne rozlozena na logaritmicke ose. Cislo zacina cislici d, kdyz lezi mezi d a d+1 (krat nejaka mocnina 10).
  Na logaritmicke ose ma ten usek delku log10(d + 1) - log10(d) = log10((d + 1) / d) = log10(1 + 1/d).
  Usek od 1 do 2 je tak mnohem delsi nez od 9 do 10, proto jednicek je nejvic.

  Soucet P(1) + ... + P(9) = log10(2/1 * 3/2 * ... * 10/9) = log10(10) = 1
*/

// Count benford
export function benford(d: number) {
  return Math.log10(1 + 1 / d)
}

// Count first digits (1-9) in one column of the parsed CSV, first row is the header
export function countFirstDigits(rows: string[][], column: number) {
  const counts = DIGITS.map(() => 0)
  for (const row of rows.slice(1)) {
    const digit = firstDigit(row[column] ?? "")
    if (digit !== null) counts[digit - 1]++
  }
  return counts
}

// Get first digit of a number (1-9), or null if the cell is not a number
export function firstDigit(cell: string) {
  const number = normalizeNumber(cell)
  if (number === null || Number(number) === 0) return null

  // First character from 1 to 9, skips "-", "0" and "." (0.0045 -> 4)
  for (const char of number) {
    if (char >= "1" && char <= "9") return Number(char)
  }
  return null
}

// Whole part of a number, without or with thousands separators - found on internet
const PLAIN_WHOLE = /^[+-]?\d*$/ // 1234
const COMMA_GROUPS = /^[+-]?\d{1,3}(,\d{3})+$/ // 1,234,567
const DOT_GROUPS = /^[+-]?\d{1,3}(\.\d{3})+$/ // 1.234.567
const EXPONENT = /^e[+-]?\d+$/i // e5, E-3

/*
  Turns a cell into number text ts understands, or null when it is not a number
  "1 234,5" -> "1234.5", "1,234.5" -> "1234.5", "1.234.567" -> "1234567", "9e5" -> "9e5"
*/
export function normalizeNumber(cell: string) {
  // Remove all spaces, Excel also uses non-breaking spaces between thousands
  let text = cell.replace(/\s/g, "")

  // Cut off the exponent, 9e5 -> 9 and e5
  let exponent = ""
  const eIndex = text.toLowerCase().indexOf("e")
  if (eIndex !== -1) {
    exponent = text.slice(eIndex)
    text = text.slice(0, eIndex)
    if (!EXPONENT.test(exponent)) return null
  }

  // Find the decimal separator:
  // when both , and . are used, the last one is decimal (1,234.5 or 1.234,5)
  // when only one is used once, it is decimal (1,5 or 0.25)
  // when one is used more times, it only groups thousands (1,234,567)
  const commaCount = text.split(",").length - 1
  const dotCount = text.split(".").length - 1
  let decimal = ""
  if (commaCount > 0 && dotCount > 0) {
    decimal = text.lastIndexOf(",") > text.lastIndexOf(".") ? "," : "."
  } else if (commaCount === 1) {
    decimal = ","
  } else if (dotCount === 1) {
    decimal = "."
  }

  // Split into the whole part and the part after the decimal separator
  let whole = text
  let fraction = ""
  if (decimal !== "") {
    const decimalIndex = text.lastIndexOf(decimal)
    whole = text.slice(0, decimalIndex)
    fraction = text.slice(decimalIndex + 1)
  }

  // Thousands groups must have 3 digits, so a date like 01.01.2025 is not a number
  const wholeIsValid = PLAIN_WHOLE.test(whole) || COMMA_GROUPS.test(whole) || DOT_GROUPS.test(whole)
  const fractionIsValid = /^\d*$/.test(fraction)
  const hasDigit = /\d/.test(whole + fraction)
  if (!wholeIsValid || !fractionIsValid || !hasDigit) return null

  const cleanWhole = whole.replaceAll(",", "").replaceAll(".", "")
  if (fraction === "") return cleanWhole + exponent
  return cleanWhole + "." + fraction + exponent
}

// Index of the column with the most numbers in it
export function bestColumn(rows: string[][]) {
  const header = rows[0] ?? []
  let best = 0
  let bestCount = -1

  for (let column = 0; column < header.length; column++) {
    let count = 0
    for (const row of rows.slice(1)) {
      if (firstDigit(row[column] ?? "") !== null) count++
    }
    // >= so on a tie the later column wins, the value column is usually last (country,year,value)
    if (count >= bestCount) {
      best = column
      bestCount = count
    }
  }

  return best
}

export type DigitRow = {
  digit: number
  count: number
  // Shares from 0 to 1
  observed: number
  expected: number
}

// One row per digit, shared by the chart and the table
export function toDigitRows(counts: number[]): DigitRow[] {
  const total = counts.reduce((sum, count) => sum + count, 0)
  return DIGITS.map((digit, i) => ({
    digit,
    count: counts[i],
    observed: total ? counts[i] / total : 0,
    expected: benford(digit),
  }))
}
