import type { ReactNode } from "react"
import styles from "./Section.module.css"

type SectionProps = {
  title: string
  description?: string
  // Buttons shown next to the title
  action?: ReactNode
  children: ReactNode
}

export default function Section({ title, description, action, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      <span className={styles.rule} />
      <div className={styles.body}>{children}</div>
    </section>
  )
}
