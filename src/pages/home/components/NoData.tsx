import { ChartColumnIcon } from "lucide-react"
import styles from "./NoData.module.css"

type NoDataProps = {
  // There is some CSV text
  hasText: boolean
  // User can pick another column
  hasColumns: boolean
}

export default function NoData({ hasText, hasColumns }: NoDataProps) {
  const hint = hasColumns ? "Pick a column that contains numbers." : "Check that the CSV contains numbers."

  return (
    <div className={styles.empty}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <ChartColumnIcon />
        </div>
        <p className={styles.title}>{hasText ? "No numbers found" : "No data yet"}</p>
        <p className={styles.description}>{hasText ? hint : "Upload, drop or paste a CSV to see the chart."}</p>
      </div>
    </div>
  )
}
