import { describe, expect, it } from "vitest"
import { CsvFileSchema, CsvTextSchema, PastedTextSchema } from "./csv"

describe("CsvTextSchema", () => {
  it("rejects empty or whitespace-only text", () => {
    expect(CsvTextSchema.safeParse("   \n ").success).toBe(false)
  })

  it("accepts and trims text", () => {
    expect(CsvTextSchema.parse("  a,b\n")).toBe("a,b")
  })
})

describe("PastedTextSchema", () => {
  it("allows clearing the textarea", () => {
    expect(PastedTextSchema.safeParse("").success).toBe(true)
  })

  it("rejects text over the size limit", () => {
    expect(PastedTextSchema.safeParse("x".repeat(6 * 1024 * 1024)).success).toBe(false)
  })
})

describe("CsvFileSchema", () => {
  it("accepts a small file", () => {
    expect(CsvFileSchema.safeParse(new File(["a,b"], "data.csv")).success).toBe(true)
  })

  it("rejects something that is not a file", () => {
    expect(CsvFileSchema.safeParse("data.csv").success).toBe(false)
  })
})
