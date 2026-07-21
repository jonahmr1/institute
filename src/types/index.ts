import type { User } from "@/lib/user"
import type { Database } from "./database.ts"
import type { Direction } from "radix-ui"
import type { Translations } from "@/locales"
import type * as edge from "./shared"

export type Role = Database["public"]["Tables"]["users"]["Row"]["role"]
export type Permission = Database["public"]["Enums"]["user_permissions"]

export interface Translation {
  [key: string]: string | Translation
}
export interface RolesAlias {
  roles_alias: Record<Role, string>
}

type DotNotation<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotNotation<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T]

export type TranslationKey = DotNotation<Translations>

export type AuthState =
  | { status: "loading"; user: undefined }
  | { status: "unauthenticated"; user: null }
  | { status: "unauthorized"; user: null }
  | { status: "authenticated"; user: User }

export type Response<T = unknown, F = string, U = string> = Promise<
  [true, T, Record<string, U>?] | [false, F, Record<string, U>?]
>

export type IDirectionProvider = React.ComponentProps<
  typeof Direction.DirectionProvider
>
export type UserAccount = edge.UserAccount<
  Role,
  Translations["roles_alias"][Role]
>
export type Events = edge.Events
export type CreateUser = edge.CreateUser<Role>
export type DeleteUser = edge.DeleteUser

// eslint-disable-next-line no-unused-vars
export type OnChange = (key: string, value: string) => void

export interface Rows<T> {
  data: T[]
  filters: (keyof T)[]
}

export type DbInvoice = Database["public"]["Tables"]["invoices"]["Row"]
