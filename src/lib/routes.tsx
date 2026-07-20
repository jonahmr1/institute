import { Dashboard } from "@/app/dashboard"
import { Users } from "@/app/dashboard/routes/users"
import { Role } from "@/types"
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
} as const
