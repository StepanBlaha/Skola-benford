import { lazy, Suspense } from "react"
import { useDropzone } from "react-dropzone"
import { useCsvData } from "@/hooks/useCsvData"
import styles from "./Home.module.css"
import DataSection from "./components/DataSection"
import DigitTable from "./components/DigitTable"
import NoData from "./components/NoData"
import ResultSection from "./components/ResultSection"

// Load chart only when needed, recharts is big
const DigitChart = lazy(() => import("./components/DigitChart"))

// File types for the picker and drag and drop
const CSV_FILES = { "text/csv": [".csv"], "text/plain": [".txt"] }

export default function Home() {
  const csv = useCsvData()

  // Drop file anywhere on the page, open() shows the file picker for the upload button
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: CSV_FILES,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: (files) => csv.uploadFile(files[0]),
    onDropRejected: () => csv.showError("Only CSV files can be loaded"),
  })

  return (
    <div {...getRootProps({ className: styles.page })}>
      <input {...getInputProps()} />
      {isDragActive && <div className={styles.dropOverlay}>Drop the CSV file</div>}
      <main className={styles.container}>
        <span className={styles.rule} />
        <header className={styles.hero}>
          <h1 className={styles.title}>Benford's law</h1>
          <p className={styles.subtitle}>Upload or paste a CSV and see how often each first digit appears</p>
        </header>
        <span className={styles.rule} />

        <DataSection
          text={csv.text}
          onTextChange={csv.pasteText}
          header={csv.header}
          column={csv.column}
          onColumnChange={csv.setColumn}
          total={csv.total}
          error={csv.error}
          loading={csv.loading}
          onPickFile={open}
          onLoadSample={csv.loadSample}
        />
        <span className={styles.rule} />

        {csv.total > 0 ? (
          <>
            <ResultSection mad={csv.mad} conformity={csv.conformity} total={csv.total} orders={csv.orders} />
            <span className={styles.rule} />
            <Suspense fallback={<div className={styles.chartFallback} />}>
              <DigitChart rows={csv.digitRows} />
            </Suspense>
            <span className={styles.rule} />
            <DigitTable rows={csv.digitRows} />
          </>
        ) : (
          <div className={styles.empty}>
            <NoData hasText={csv.text !== ""} hasColumns={csv.header.length > 1} />
          </div>
        )}
        <span className={styles.rule} />
      </main>
    </div>
  )
}
