import { useRef } from "react"
import { CircleAlertIcon, FileTextIcon, Loader2Icon, UploadIcon } from "lucide-react"
import Button from "@/components/Button/Button"
import Section from "@/components/Section/Section"
import type { LoadingSource } from "@/hooks/useCsvData"
import ColumnSelect from "./ColumnSelect"
import styles from "./DataSection.module.css"

type DataSectionProps = {
  text: string
  onTextChange: (text: string) => void
  header: string[]
  column: number
  onColumnChange: (column: number) => void
  total: number
  error: string
  loading: LoadingSource
  onUpload: (file: File | undefined) => void
  onLoadSample: () => void
}

export default function DataSection({
  text,
  onTextChange,
  header,
  column,
  onColumnChange,
  total,
  error,
  loading,
  onUpload,
  onLoadSample,
}: DataSectionProps) {
  const fileInput = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    onUpload(e.target.files?.[0])
    // Reset so the same file can be picked again
    e.target.value = ""
  }

  const spinner = <Loader2Icon className={styles.spinner} role="status" aria-label="Loading" />

  const actions = (
    <>
      <input ref={fileInput} type="file" accept=".csv,text/csv,text/plain" onChange={handleFileChange} hidden />
      <Button onClick={() => fileInput.current?.click()} disabled={loading !== null}>
        {loading === "file" ? spinner : <UploadIcon />}
        Upload CSV
      </Button>
      <Button variant="outline" onClick={onLoadSample} disabled={loading !== null}>
        {loading === "sample" ? spinner : <FileTextIcon />}
        Load sample
      </Button>
    </>
  )

  return (
    <Section title="Data" description="Upload a file, load the sample or paste CSV below" action={actions}>
      <div className={styles.field}>
        <label htmlFor="csv-text" className={styles.label}>
          CSV
        </label>
        <textarea
          id="csv-text"
          className={styles.textarea}
          placeholder={"country;population\nCzechia;10900555"}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>

      {error && (
        <div role="alert" className={styles.alert}>
          <CircleAlertIcon />
          <p>{error}</p>
        </div>
      )}

      {text && (
        <div className={styles.footer}>
          {header.length > 1 && <ColumnSelect header={header} column={column} onChange={onColumnChange} />}
          {total > 0 && (
            <span role="status" className={styles.badge}>
              {total} {total === 1 ? "number" : "numbers"} counted
            </span>
          )}
        </div>
      )}
    </Section>
  )
}
