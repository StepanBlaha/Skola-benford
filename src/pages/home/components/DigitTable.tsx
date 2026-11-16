import Section from "@/components/Section/Section"
import type { DigitRow } from "@/utils/benford"
import styles from "./DigitTable.module.css"
import DigitTableRow from "./DigitTableRow"

type DigitTableProps = {
  rows: DigitRow[]
}

export default function DigitTable({ rows }: DigitTableProps) {
  return (
    <Section title="Table" description="Counts and shares for each first digit">
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <caption className={styles.caption}>First digit counts compared to Benford's law</caption>
          <thead>
            <tr>
              <th scope="col">Digit</th>
              <th scope="col" className={styles.number}>
                Count
              </th>
              <th scope="col" className={styles.number}>
                Data
              </th>
              <th scope="col" className={styles.number}>
                Benford
              </th>
            </tr>
          </thead>
          <tbody className={styles.body}>
            {rows.map((row) => (
              <DigitTableRow key={row.digit} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
