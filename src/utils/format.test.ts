import { describe, expect, it } from "vitest"
import { formatPercent, toPercent } from "./format"

describe("format", () => {
  it("converts a share to percent with one decimal", () => {
    expect(toPercent(0.30103)).toBe(30.1)
  })

  it("formats a share as text", () => {
    expect(formatPercent(0.30103)).toBe("30.1%")
    expect(formatPercent(0.05)).toBe("5.0%")
  })
})
