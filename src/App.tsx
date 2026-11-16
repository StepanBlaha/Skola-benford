import AppRoutes from "./routes"
import { BrowserRouter } from "react-router-dom"
function App() {
  // basename because the app runs on /Skola-benford/ on github pages
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}
export default App
