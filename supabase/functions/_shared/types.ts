import type { Database } from '../../../src/types/_database.ts'
import type * as edge from '../../../src/types/shared.ts'

export type Role = Database['public']['Tables']['users']['Row']['role']
export type Permission = Database["public"]["Enums"]["user_permissions"]
export type RealtimeRegisteration = [true] | [false, Response]

export type UserAccount = edge.UserAccount<Role>
export type Events = edge.Events
export type CreateUser = edge.CreateUser<Role>
export type DeleteUser = edge.DeleteUser