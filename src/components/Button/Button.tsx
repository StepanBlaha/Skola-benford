import type { ComponentProps } from "react"
import styles from "./Button.module.css"

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "outline"
}

export default function Button({ variant = "primary", ...props }: ButtonProps) {
  return <button type="button" className={`${styles.button} ${styles[variant]}`} {...props} />
}
