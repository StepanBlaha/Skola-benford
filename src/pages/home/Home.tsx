import { lazy, Suspense } from "react"
import { useCsvData } from "@/hooks/useCsvData"
import styles from "./Home.module.css"
import DataSection from "./components/DataSection"
import DigitTable from "./components/DigitTable"
import NoData from "./components/NoData"

// Load chart only when needed, recharts is big
const DigitChart = lazy(() => import("./components/DigitChart"))

export default function Home() {
  const csv = useCsvData()

  // Drop file anywhere on the page
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    csv.uploadFile(e.dataTransfer.files[0])
  }

  return (
    <div className={styles.page} onDragOver={handleDragOver} onDrop={handleDrop}>
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
          onUpload={csv.uploadFile}
          onLoadSample={csv.loadSample}
        />
        <span className={styles.rule} />

        {csv.total > 0 ? (
          <>
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
