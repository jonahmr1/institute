import { Dashboard } from "@/app/dashboard"
import { invoices } from "@/app/dashboard/routes/invoices"
import { Users } from "@/app/dashboard/routes/users"
import type { Role } from "@/types"
import i18n from "i18next"
import type { JSX } from "react"

export const ROUTES: Record<
  string,
  {
    label: () => string
    route: string
		role: Role
    element: () => JSX.Element
  }
> = {
  "/": {
    label: () => i18n.t("dashboard"),
    route: "/",
		role: 'student',
    element: Dashboard,
  },
  users: {
    label: () => i18n.t("nav.projects.items.users"),
    route: "users",
		role: 'manager',
    element: Users,
  },
  invoices: {
    label: () => i18n.t("nav.projects.items.invoices"),
    route: "invoices",
		role: 'student',
    element: invoices,
  },
} as const
