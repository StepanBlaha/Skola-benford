import { describe, expect, it } from "vitest"
import { benford, bestColumn, countFirstDigits, firstDigit, toDigitRows } from "./benford"

describe("benford", () => {
  it("gives the known probabilities", () => {
    expect(benford(1)).toBeCloseTo(0.30103, 5)
    expect(benford(9)).toBeCloseTo(0.04576, 5)
  })

  it("sums to 1 over digits 1-9", () => {
    const sum = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((total, d) => total + benford(d), 0)
    expect(sum).toBeCloseTo(1, 10)
  })
})

describe("firstDigit", () => {
  it.each([
    ["123", 1],
    ["-45", 4],
    ["0.0045", 4],
    ["0,0045", 4],
    ["1 234,5", 1],
    ["9e5", 9],
    ["1,234.5", 1],
    ["2.345,6", 2],
    ["3,456,789", 3],
    ["4.567.890", 4],
    ["5\u00a0678", 5],
    ["-0,003", 3],
  ])("%s -> %i", (cell, digit) => {
    expect(firstDigit(cell)).toBe(digit)
  })

  it.each(["", "abc", "0", "0.000", "Infinity", "0x1F", "12abc", "01.01.2025", "1.2.3", "-"])(
    "%s is not a number",
    (cell) => {
      expect(firstDigit(cell)).toBeNull()
    },
  )
})

describe("bestColumn", () => {
  it("picks the column with most numbers", () => {
    const rows = [
      ["country", "population"],
      ["CZ", "10900555"],
      ["SK", "5400000"],
    ]
    expect(bestColumn(rows)).toBe(1)
  })

  it("ignores date columns", () => {
    const rows = [
      ["date", "amount"],
      ["01.01.2025", "3 611,66"],
      ["02.01.2025", "95,40"],
    ]
    expect(bestColumn(rows)).toBe(1)
  })

  it("returns 0 for empty input", () => {
    expect(bestColumn([])).toBe(0)
  })

  it("prefers the last column on a tie", () => {
    const rows = [
      ["year", "value"],
      ["2020", "15"],
    ]
    expect(bestColumn(rows)).toBe(1)
  })
})

describe("countFirstDigits", () => {
  it("skips the header row", () => {
    expect(countFirstDigits([["2020"], ["5"]], 0)).toEqual([0, 0, 0, 0, 1, 0, 0, 0, 0])
  })

  it("counts first digits in one column", () => {
    const rows = [["n"], ["12"], ["19"], ["9"], ["x"]]
    expect(countFirstDigits(rows, 0)).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 1])
  })
})

describe("toDigitRows", () => {
  it("turns counts into shares", () => {
    const rows = toDigitRows([3, 1, 0, 0, 0, 0, 0, 0, 0])
    expect(rows[0]).toMatchObject({ digit: 1, count: 3, observed: 0.75 })
    expect(rows[1].observed).toBe(0.25)
  })

  it("gives zero shares when nothing was counted", () => {
    expect(toDigitRows(Array(9).fill(0)).every((row) => row.observed === 0)).toBe(true)
  })
})
