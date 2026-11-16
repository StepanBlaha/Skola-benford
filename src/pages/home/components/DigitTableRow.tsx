import type { DigitRow } from "@/utils/benford"
import { formatPercent } from "@/utils/format"
import styles from "./DigitTable.module.css"

type DigitTableRowProps = {
  row: DigitRow
}

export default function DigitTableRow({ row }: DigitTableRowProps) {
  return (
    <tr>
      <td>{row.digit}</td>
      <td className={styles.number}>{row.count}</td>
      <td className={styles.number}>{formatPercent(row.observed)}</td>
      <td className={styles.number}>{formatPercent(row.expected)}</td>
    </tr>
  )
}
