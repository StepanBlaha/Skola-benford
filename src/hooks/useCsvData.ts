import { useMemo, useState } from "react"
import { CsvFileSchema, CsvTextSchema, PastedTextSchema } from "@/schemas/csv"
import { bestColumn, countFirstDigits, toDigitRows } from "@/utils/benford"
import { conformity, meanAbsoluteDeviation, orderSpan } from "@/utils/conformity"
import { parseCsv } from "@/utils/csv"

export type LoadingSource = "file" | "sample" | null

// CSV text and everything counted from it
export function useCsvData() {
  const [text, setText] = useState("")
  // Column picked by user, null = pick automatically
  const [pickedColumn, setPickedColumn] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState<LoadingSource>(null)

  // Parse only when the text changes, big files are slow
  const csvRows = useMemo(() => parseCsv(text), [text])
  const header = csvRows[0] ?? []

  // If the picked column doesnt exist anymore use the automatic one
  let column = bestColumn(csvRows)
  if (pickedColumn !== null && pickedColumn < header.length) {
    column = pickedColumn
  }

  const digitRows = toDigitRows(countFirstDigits(csvRows, column))
  const total = digitRows.reduce((sum, row) => sum + row.count, 0)

  // How well the data follows Benford, and how spread out the numbers are
  const mad = meanAbsoluteDeviation(digitRows)
  const orders = orderSpan(csvRows, column)

  // Typing keeps the picked column
  function pasteText(next: string) {
    const result = PastedTextSchema.safeParse(next)
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }
    setText(result.data)
    setError("")
  }

  // For file and sample, resets the picked column
  function loadText(loaded: string) {
    const result = CsvTextSchema.safeParse(loaded)
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }
    setText(result.data)
    setPickedColumn(null)
  }

  async function uploadFile(file: File | undefined) {
    // No file picked
    if (!file) return

    const result = CsvFileSchema.safeParse(file)
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading("file")
    setError("")
    try {
      loadText(await file.text())
    } catch {
      setError("Could not read the file")
    }
    setLoading(null)
  }

  async function loadSample() {
    setLoading("sample")
    setError("")
    try {
      // BASE_URL so it works on github pages too
      const res = await fetch(import.meta.env.BASE_URL + "sample.csv")
      if (!res.ok) throw new Error(res.statusText)
      loadText(await res.text())
    } catch {
      setError("Could not load sample")
    }
    setLoading(null)
  }

  return {
    text,
    pasteText,
    header,
    column,
    setColumn: setPickedColumn,
    digitRows,
    total,
    mad,
    conformity: conformity(mad),
    orders,
    error,
    loading,
    uploadFile,
    loadSample,
    showError: setError,
  }
}
