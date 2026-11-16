import { describe, expect, it } from "vitest"
import { toDigitRows } from "./benford"
import { conformity, meanAbsoluteDeviation, orderSpan } from "./conformity"

describe("meanAbsoluteDeviation", () => {
  it("is 0 when the data matches Benford exactly", () => {
    const rows = toDigitRows([0, 0, 0, 0, 0, 0, 0, 0, 0]).map((row) => ({ ...row, observed: row.expected }))
    expect(meanAbsoluteDeviation(rows)).toBeCloseTo(0, 10)
  })

  it("is big when all numbers start with 9", () => {
    expect(meanAbsoluteDeviation(toDigitRows([0, 0, 0, 0, 0, 0, 0, 0, 10]))).toBeGreaterThan(0.15)
  })
})

describe("conformity", () => {
  it.each([
    [0.004, "close"],
    [0.006, "close"],
    [0.01, "acceptable"],
    [0.014, "marginal"],
    [0.02, "none"],
  ])("MAD %f -> %s", (mad, expected) => {
    expect(conformity(mad)).toBe(expected)
  })
})

describe("orderSpan", () => {
  it("counts orders of magnitude between smallest and biggest number", () => {
    expect(orderSpan([["n"], ["10"], ["10 000"]], 0)).toBeCloseTo(3)
  })

  it("is small for numbers close together", () => {
    expect(orderSpan([["cm"], ["150"], ["200"]], 0)).toBeLessThan(0.2)
  })

  it("skips zeros, text and uses size of negative numbers", () => {
    expect(orderSpan([["n"], ["0"], ["abc"], ["-1"], ["100"]], 0)).toBeCloseTo(2)
  })

  it("is 0 when there are no numbers", () => {
    expect(orderSpan([["n"], ["abc"]], 0)).toBe(0)
  })
})
