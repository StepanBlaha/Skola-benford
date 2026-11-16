import { TriangleAlertIcon } from "lucide-react"
import Section from "@/components/Section/Section"
import {
  ACCEPTABLE_LIMIT,
  CLOSE_LIMIT,
  MARGINAL_LIMIT,
  MIN_NUMBERS,
  MIN_ORDERS,
  type Conformity,
} from "@/utils/conformity"
import styles from "./ResultSection.module.css"

const VERDICTS = {
  close: { title: "Close conformity", text: "The data follows Benford's law very well." },
  acceptable: { title: "Acceptable conformity", text: "The data follows Benford's law." },
  marginal: { title: "Marginal conformity", text: "The data follows Benford's law only roughly." },
  none: { title: "Nonconformity", text: "The data does not follow Benford's law." },
}

type ResultSectionProps = {
  mad: number
  conformity: Conformity
  total: number
  orders: number
}

export default function ResultSection({ mad, conformity, total, orders }: ResultSectionProps) {
  const verdict = VERDICTS[conformity]

  return (
    <Section title="Result" description="Does the data follow Benford's law?">
      <div className={styles.verdict}>
        <i className={styles[conformity]} />
        <div>
          <p className={styles.title}>{verdict.title}</p>
          <p className={styles.text}>{verdict.text}</p>
        </div>
        <span className={styles.mad}>MAD {mad.toFixed(4)}</span>
      </div>

      <p className={styles.explain}>
        MAD is the average difference between your data and Benford's law. Up to {CLOSE_LIMIT} is close, up to{" "}
        {ACCEPTABLE_LIMIT} acceptable, up to {MARGINAL_LIMIT} marginal and anything above does not follow the law.
      </p>

      {total < MIN_NUMBERS && (
        <p className={styles.warning}>
          <TriangleAlertIcon />
          Only {total} numbers. Benford's law needs at least {MIN_NUMBERS}, so the result is not reliable.
        </p>
      )}

      {orders < MIN_ORDERS && (
        <p className={styles.warning}>
          <TriangleAlertIcon />
          The numbers are too close to each other. Benford's law needs data from at least {MIN_ORDERS} orders of
          magnitude, like from 10 to 1000. Heights or grades do not follow it.
        </p>
      )}
    </Section>
  )
}
