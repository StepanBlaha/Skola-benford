import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts"
import Section from "@/components/Section/Section"
import type { DigitRow } from "@/utils/benford"
import { toPercent } from "@/utils/format"
import styles from "./DigitChart.module.css"

const DATA_COLOR = "var(--fg)"
const BENFORD_COLOR = "var(--info)"

const AXIS_TICK = { fill: "var(--fg-muted)", fontSize: 12 }

/** Size before the chart measures itself, without it recharts shows a warning */
const INITIAL_SIZE = { width: 700, height: 250 }

type DigitChartProps = {
  rows: DigitRow[]
}

export default function DigitChart({ rows }: DigitChartProps) {
  // Percents like in the table
  const data = rows.map((row) => ({
    digit: row.digit,
    observed: toPercent(row.observed),
    expected: toPercent(row.expected),
  }))

  return (
    <Section title="Chart" description="How often each first digit appears, compared to Benford's law">
      <div className={styles.chart}>
        <div className={styles.plot}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={INITIAL_SIZE}>
            <ComposedChart data={data} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="digit" tickLine={false} axisLine={false} tickMargin={8} tick={AXIS_TICK} />
              <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={(value) => `${value}%`} />
              <Tooltip cursor={false} content={ChartTooltip} />
              <Bar dataKey="observed" fill={DATA_COLOR} radius={4} />
              <Line
                dataKey="expected"
                type="monotone"
                stroke={BENFORD_COLOR}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ fill: BENFORD_COLOR, stroke: "transparent", r: 3 }}
                activeDot={{ stroke: "transparent" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <ul className={styles.legend}>
          <li>
            <i style={{ background: DATA_COLOR }} />
            Your data %
          </li>
          <li>
            <i style={{ background: BENFORD_COLOR }} />
            Benford's law %
          </li>
        </ul>
      </div>
    </Section>
  )
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null

  // Data of the hovered digit
  const row = payload[0].payload

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>Digit {row.digit}</p>
      <div className={styles.tooltipRow}>
        <i style={{ background: DATA_COLOR }} />
        <span className={styles.tooltipName}>Your data %</span>
        <span className={styles.tooltipValue}>{row.observed}</span>
      </div>
      <div className={styles.tooltipRow}>
        <i style={{ background: BENFORD_COLOR }} />
        <span className={styles.tooltipName}>Benford's law %</span>
        <span className={styles.tooltipValue}>{row.expected}</span>
      </div>
    </div>
  )
}
