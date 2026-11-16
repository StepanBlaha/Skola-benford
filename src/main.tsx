import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

// Switch dark mode when the system theme changes
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")
darkQuery.addEventListener("change", () => document.documentElement.classList.toggle("dark", darkQuery.matches))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
