import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { Login } from "@/app/login"
import "@/index.css"
import { App } from "@/app"
import { AuthProvider } from "@/providers/auth"
import "@/locales"
import { DirectionProvider } from "./components/ui/direction"
import { ROUTES } from "./lib/routes"

const root = () => {
  const element = document.getElementById("root")
  if (!element) throw new Error("Root element not found")
  return element
}

if (window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.add("dark")

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    document.documentElement.classList.toggle("dark", event.matches)
  })

const Dashboard = ROUTES["/"].element

ReactDOM.createRoot(root()).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DirectionProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="login" element={<Login />} />
              <Route element={<App />}>
                <Route path={ROUTES["/"].route} element={<Dashboard />}>
                  <Route
                    path={ROUTES.users.route}
                    element={<ROUTES.users.element />}
                  />
                  <Route
                    path={ROUTES.invoices.route}
                    element={<ROUTES.invoices.element />}
                  />
                </Route>
              </Route>
            </Routes>
          </TooltipProvider>
        </DirectionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
