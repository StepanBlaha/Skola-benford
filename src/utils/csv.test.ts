import { describe, expect, it } from "vitest"
import { detectDelimiter, parseCsv } from "./csv"

describe("parseCsv", () => {
  it("splits by comma", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ])
  })

  it("uses semicolon when present (Czech CSV)", () => {
    expect(parseCsv("a;b\n1,5;2")).toEqual([
      ["a", "b"],
      ["1,5", "2"],
    ])
  })

  it("skips empty lines and handles Windows line endings", () => {
    expect(parseCsv("a,b\r\n\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ])
  })

  it("removes quotes around cells", () => {
    expect(parseCsv('"name","value"\n"x","5"')).toEqual([
      ["name", "value"],
      ["x", "5"],
    ])
  })

  it("keeps the delimiter inside quoted cells", () => {
    expect(parseCsv('a,b,c\n1,"1,234",x')).toEqual([
      ["a", "b", "c"],
      ["1", "1,234", "x"],
    ])
  })

  it("turns doubled quotes into one", () => {
    expect(parseCsv('a\n"say ""hi"""')[1]).toEqual(['say "hi"'])
  })

  it("does not switch to ; because of one ; in the data", () => {
    expect(parseCsv("name,value\nx;y,5")[1]).toEqual(["x;y", "5"])
  })
})

describe("detectDelimiter", () => {
  it.each([
    ["a,b,c", ","],
    ["a;b;c", ";"],
    ["a\tb\tc", "\t"],
    ['"a,b";c', ";"],
  ])("%s -> %s", (header, delimiter) => {
    expect(detectDelimiter(header)).toBe(delimiter)
  })
})
