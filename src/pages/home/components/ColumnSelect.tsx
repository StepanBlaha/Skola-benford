import { ChevronDownIcon } from "lucide-react"
import styles from "./ColumnSelect.module.css"

type ColumnSelectProps = {
  header: string[]
  column: number
  onChange: (column: number) => void
}

export default function ColumnSelect({ header, column, onChange }: ColumnSelectProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="csv-column" className={styles.label}>
        Column
      </label>
      <div className={styles.trigger}>
        <select
          id="csv-column"
          className={styles.select}
          value={column}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {header.map((name, i) => (
            <option key={i} value={i}>
              {name || `Column ${i + 1}`}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.chevron} aria-hidden />
      </div>
    </div>
  )
}
