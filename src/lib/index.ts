import type { Permission, Role } from "@/types"

export const INSTITUTE_LOGO =
  "https://i.ytimg.com/vi/xLEg3oHARbU/maxresdefault.jpg"

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ["create:user", "read:users", "delete:user"],
  student: [],
} as const

export const isRole = (value: string): value is Role =>
  (Object.keys(ROLE_PERMISSIONS) as readonly string[]).includes(value)
